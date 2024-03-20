"use server";
import axios from "axios";
import { read } from "fs";
import https from "https";
import { readFileContent } from "~/utils/files";
import { KubeConfigRequestSchema } from "~/validations/kubeConfCreateRequest";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function postKubeConf(formData: FormData, authToken: String) {
  try {
    const clusterLabel = formData.get("label");
    const clusterDescription = formData.get("description");
    const configFileText = await readFileContent(formData.get("kubeConfFile") as File);
    const caFile = await readFileContent(formData.get("caFile") as File);
    const keyFile = await readFileContent(formData.get("keyFile") as File);
    const certFile = await readFileContent(formData.get("certFile") as File);
    const validatedFields = KubeConfigRequestSchema.safeParse({
      kubeConfFile: configFileText,
      clusterLabel: clusterLabel,
      clusterDescription: clusterDescription,
      authToken: authToken,
      certFile: certFile,
      keyFile: keyFile,
      caFile: caFile,
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
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }
    return { errors: { apiError: [errorMessage] } };
  }
}
