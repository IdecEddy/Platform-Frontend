import { z } from "zod";
import axios from "axios";
import https from "https";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { jwtSchema } from "~/validations/authToken";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const clusterRouter = createTRPCRouter({
  clusterInfo: publicProcedure
    .input(
      z.object({
        authToken: jwtSchema,
        configId: z.number().int().min(1, "id must be bigger then zero"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const httpsAgent = new https.Agent({ rejectUnauthorized: IS_PRODUCTION });
        const body = {
          authToken: input.authToken,
          configId: input.configId,
        };
        const response = await axios.post("https://127.0.0.1:8001/api/v1/k8/v", body, {
          httpsAgent,
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }),
});
