import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Assuming this is within an async function context

  const token = request.cookies.get("auth-token")?.value;
  // Redirect immediately if the token doesn't exist
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const apiUrl = "https://127.0.0.1:8000/api/v1/auth/verify_token";
  const body = JSON.stringify({
    token,
    audience: "platform-frontend",
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    // Check for HTTP error responses (e.g., not 2xx)
    if (!response.ok) {
      console.error(`Error from auth service: ${response.statusText}`);
      throw new Error("Authentication failed");
    }

    // Assuming the API returns { isAuthenticated: boolean }
    const isAuthenticated = await response.json();
    console.log(isAuthenticated);
    // If everything is OK, proceed with the request
    return NextResponse.next();
  } catch (error: any) {
    console.error(`Authentication error: ${error.message}`);
    // Optionally, redirect to a custom error page or log the user out
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: "/panel",
};
