"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handler(formData: FormData) {
  const name = formData.get("name");
  if (name == "edwin") {
    cookies().set("name", name);
    redirect("/sandbox/secure");
  }
}
