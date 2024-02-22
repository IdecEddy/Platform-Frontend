"use server";
import { cookies } from "next/headers";
import { api } from "~/trpc/server";
import { TRPCClientError } from "@trpc/client";

export async function setCookie(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (email != undefined && password != undefined) {
    let data;
    try {
      data = await api.auth.login.mutate({
        email: email,
        password: password,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        return {
          error: JSON.parse(error.message)[0].message,
        };
      }
    }
    if (data && data.auth == true) {
      cookies().set({
        name: "refresh-token",
        value: data.data,
        httpOnly: true,
        secure: false,
      });
      return {
        auth: "true",
      };
    }
    if (data && data.error && data.auth == false) {
      return {
        error: "Login Failed - Invalid login details!",
      };
    }
  }
}
