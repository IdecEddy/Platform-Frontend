import { z } from "zod";
import axios, { AxiosError } from "axios";
import https from "https";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jwtSchema } from "~/validations/authToken";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const configRouter = createTRPCRouter({
  deleteRecordById: publicProcedure
    .input(
      z.object({
        databaseId: z
          .number()
          .int()
          .min(1, { message: "the database ID must be larger then zero" }),
        authToken: jwtSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log("The ID we are going to remove is: " + input.databaseId);
        const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
        const body = {
          authToken: input.authToken,
          databaseId: input.databaseId,
        };
        await axios.post("https://127.0.0.1:8001/api/v1/k8/conf/deleteById", body, {
          httpsAgent,
        });
        return { status: 200 };
      } catch (error) {
        console.log(error);
      }
    }),
  getConfigsByUserId: publicProcedure
    .input(
      z.object({
        userId: z
          .number()
          .int()
          .min(1, { message: "The user I must be larger then zero" }),
        authToken: jwtSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
        const body = {
          userId: 1,
          authToken: input.authToken,
        };
        const usersConfs = await axios.post(
          "https://127.0.0.1:8001/api/v1/k8/conf/users_confs",
          body,
          { httpsAgent },
        );
        return usersConfs.data;
      } catch (error) {
        console.log(error);
      }
    }),
});
