"use server";
import { api } from "~/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { NextResponse, NextRequest } from "next/server";

export async function setCookie(request: NextRequest) {
  const data = await request.formData()
  const email = data.get("email") as string;
  const password = data.get("password") as string;
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
      const destinationUrl = new URL("http://localhost:3000/panel");
      const response = NextResponse.redirect(destinationUrl, { status: 302 });
      response.cookies.set("refresh-token", data.data.refresh_token, { 
        httpOnly: true,
        secure: false,
      })
      return response;
    }
    if (data && data.error && data.auth == false) {
      return {
        error: "Login Failed - Invalid login details!",
      };
    }
  }
}
