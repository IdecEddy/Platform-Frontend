import { z } from "zod";
import axios, { AxiosError } from "axios";
import https from "https";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cookies } from "next/headers";

const API_URL = process.env.AUTH_API_URL;
if (!API_URL) {
  throw new Error(
    "AUTH_API_URL environment variable is not set. Application will not start.",
  );
}

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const isProduction = process.env.NODE_ENV === "production";
      const body = {
        email: input.email,
        password: input.password,
        audience: "platform-frontend",
      };
      const httpsAgent = new https.Agent({
        rejectUnauthorized: isProduction,
      });
      try {
        const response = await axios.post(API_URL, body, { httpsAgent });
        if (response.data.authToken) {
          const authToken = response.data.authToken;
          return { auth: true, data: authToken, error: null };
        } else {
          return {
            auth: false,
            data: null,
            error: "Authentication token was not provided.",
          };
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error instanceof AxiosError
            ? "Failed to authenticate. Please check your credentials and try again."
            : "An unknown error occurred.";
        return { auth: false, data: null, error: errorMessage };
      }
    }),
  validateToken: publicProcedure.query(async () => {
    const authToken = cookies().get("refresh-token")?.value;
    if (authToken) {
      const body = {
        token: authToken,
        audience: "platform-frontend",
      };
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // WARNING: This disables SSL certificate validation.
      });
      const { data } = await axios.post(
        "https://127.0.0.1:8000/api/v1/auth/verify_token",
        body,
        { httpsAgent },
      );
      return { auth: true, data: data };
    }
    return { auth: false, data: {} };
  }),
});
