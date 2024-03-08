'use server'
import yaml from 'js-yaml';
import axios from "axios";
import https from "https";
import { z } from 'zod';
import { cookies } from 'next/headers';
const IS_PRODUCTION = process.env.NODE_ENV === "production";


const yamlSchema = z.string().refine((data) => {
  try {
    yaml.load(data);
    return true;  // It's valid YAML
  } catch {
    return false;  // It's not valid YAML
  }
}, {
  message: "Invalid YAML content",  // Custom error message
});

const KubeConfigRequestSchema = z.object({
  userId: z.number().int(),  // Ensure it's an integer
  authToken: z.string(),
  refreshToken: z.string(),
  kubeConfFile: yamlSchema,  // Use the custom YAML validation schema
});

async function readFileContent(file: any) {
  if (file instanceof File) {
    return file.text();
  }
  throw new Error("Config file is not a valid file");
}

export async function postKubeConf(formData: FormData) {
  try {
    const refreshToken = cookies().get("refresh-token")?.value
    const userIdValue = formData.get("userId");
    if (typeof userIdValue !== "string" || !userIdValue.trim()) throw new Error("User ID is missing or not a string");
    const userId = parseInt(userIdValue, 10);
    
    const authToken = formData.get("authToken");
    if (typeof authToken !== "string" || !authToken.trim()) throw new Error("Auth token is missing or not a string");

    const configFileText = await readFileContent(formData.get("kubeConfFile"));
    const validatedFields = KubeConfigRequestSchema.safeParse({
      userId: userId,
      authToken: authToken,
      refreshToken: refreshToken,
      kubeConfFile: configFileText,
    });

    if (!validatedFields.success) {
      console.log( validatedFields.error )
      return { errors: validatedFields.error } 
    }

    const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
    await axios.post('https://127.0.0.1:8001/api/v1/k8/conf/create', validatedFields.data, { httpsAgent });
    
    return { status: 200 };
  } catch (error) {
    console.log(error)
    let errorMessage: string
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    return { errors: errorMessage };
  }
};

export async function getUsersKubeConf(authToken: String) {

}
