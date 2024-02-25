import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.AUTH_API_URL;
if (!API_URL) {
  throw new Error(
    "AUTH_API_URL environment variable is not set. Application will not start.",
  );
}
const ENDPOINT = API_URL + "verify_token";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("refresh-token")?.value;
  if (!token) {
    console.log("Error from client: No token in cookies.");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const body = JSON.stringify({
    authToken: token,
    refreshToken: token,
    audience: "platform-frontend",
  });
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      console.error(`Error from auth service: ${response.statusText}`);
      throw new Error("Authentication failed");
    }

    
    return NextResponse.next();
  } catch (error: any) {
    console.error(`Authentication error: ${error.message}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: "/panellll",
};
