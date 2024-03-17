export async function readFileContent(file: File | string): Promise<string> {
  if (file instanceof File) {
    return file.text();
  }
  throw new Error("Config file is not a valid file");
}
