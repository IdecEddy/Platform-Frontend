import { z } from "zod";
import axios, { AxiosError } from "axios";
import https from "https";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cookies } from "next/headers";

const API_URL = process.env.AUTH_API_URL;
const isProduction = process.env.NODE_ENV === "production";

if (!API_URL) {
  throw new Error(
    "AUTH_API_URL environment variable is not set. Application will not start.",
  );
}

const LOGIN_ENDPOINT = API_URL + "login";
const VALIDATE_ENDPOINT = API_URL + "verify_token";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const body = {
        email: input.email,
        password: input.password,
        audience: "platform-frontend",
      };
      const httpsAgent = new https.Agent({
        rejectUnauthorized: isProduction,
      });
      try {
        const response = await axios.post(LOGIN_ENDPOINT, body, { httpsAgent });
        if (response.data.authToken) {
          return { auth: true, data: response.data, error: null };
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
    if (!authToken) {
      return { auth: false, data: null, error: "No refresh token provided." };
    }
    const body = {
      refreshToken: authToken,
      authToken: authToken,
      audience: "platform-frontend",
    };
    const httpsAgent = new https.Agent({
      rejectUnauthorized: isProduction,
    });
    const { data } = await axios.post(VALIDATE_ENDPOINT, body, { httpsAgent });
    return { auth: true, data: data };
  }),
});
