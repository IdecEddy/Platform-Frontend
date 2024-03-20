import { z } from "zod";
import { yamlSchema } from "./yaml";
import { jwtSchema } from "./authToken";

export const KubeConfigRequestSchema = z.object({
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
  kubeConfFile: yamlSchema, // Use the custom YAML validation schema,
  authToken: jwtSchema,
  caFile: z.string().trim().min(1, "CA file must be longer then one character"),
  keyFile: z.string(),
  certFile: z.string(),
});
