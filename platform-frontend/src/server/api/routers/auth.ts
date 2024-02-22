import { z } from "zod";
import axios, { AxiosError } from "axios";
import https from "https";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cookies } from "next/headers";

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
        rejectUnauthorized: false, // WARNING: This disables SSL certificate validation.
      });
      try {
        const response = await axios.post(
          "https://127.0.0.1:8000/api/v1/auth/login",
          body,
          { httpsAgent },
        );
        if (response.data.authToken) {
          const authToken = response.data.authToken;
          return { auth: true, data: authToken, error: undefined };
        }
      } catch (error) {
        if ( error instanceof AxiosError ) {
          if (error.response) {
            return { auth: false, data: undefined, error: error };
          }
        }
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
