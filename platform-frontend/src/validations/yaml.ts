import { z } from "zod";
import yaml from "js-yaml";

export const yamlSchema = z.string().refine(
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
