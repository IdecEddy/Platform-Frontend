"use server";
import yaml from "js-yaml";
import axios from "axios";
import https from "https";
import { z } from "zod";
import { cookies } from "next/headers";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const yamlSchema = z.string().refine(
  (data) => {
    try {
      yaml.load(data);
      return true; // It's valid YAML
    } catch {
      return false; // It's not valid YAML
    }
  },
  {
    message: "Invalid YAML content", // Custom error message
  },
);

const KubeConfigRequestSchema = z.object({
  userId: z.number().int().gt(0, "The userId myst be greater then zero."),
  authToken: z
    .string()
    .trim()
    .min(1, "The auth token must be at least one character long."),
  clusterLabel: z
    .string()
    .trim()
    .min(1, "The cluster label must be at least one character long.")
    .max(50, "The cluster Label cant be longer then 50 characters."),
  clusterDescription: z
    .string()
    .trim()
    .min(1, "The cluster description must be at least one character long.")
    .max(250, "The cluster description must be less then 250 characters long."),
  kubeConfFile: yamlSchema, // Use the custom YAML validation schema
});

async function readFileContent(file: any) {
  if (file instanceof File) {
    return file.text();
  }
  throw new Error("Config file is not a valid file");
}

export async function postKubeConf(formData: FormData) {
  try {
    const userId = formData.get("userId");
    if (typeof userId !== "string") throw new Error("User ID not a string");
    const parsedUserId = parseInt(userId);
    const authToken = formData.get("authToken");
    const clusterLabel = formData.get("label");
    const clusterDescription = formData.get("description");
    const configFileText = await readFileContent(formData.get("kubeConfFile"));
    const validatedFields = KubeConfigRequestSchema.safeParse({
      userId: parsedUserId,
      authToken: authToken,
      kubeConfFile: configFileText,
      clusterLabel: clusterLabel,
      clusterDescription: clusterDescription,
    });
    if (!validatedFields.success) {
      console.log(validatedFields.error);
      return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
    await axios.post(
      "https://127.0.0.1:8001/api/v1/k8/conf/create",
      validatedFields.data,
      { httpsAgent },
    );

    return { status: 200 };
  } catch (error) {
    console.log(error);
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    return { errors: errorMessage };
  }
}

export async function getUsersKubeConf(authToken: String) {
  const body = {
    userId: 1,
    authToken: authToken,
  };

  const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
  try {
    const confResponse = await axios.post(
      "https://127.0.0.1:8001/api/v1/k8/conf/users_confs",
      body,
      { httpsAgent },
    );
    console.log(confResponse.status);
    return confResponse.data;
  } catch (error) {
    console.log(error);
  }
}
