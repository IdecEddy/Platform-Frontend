import { z } from "zod";
import axios from 'axios';
import https from 'https';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx}) => {
      const body = {
        email: input.email,
        password: input.password,
        audience: "platform-frontend", 
      };
      const httpsAgent = new https.Agent({  
        rejectUnauthorized: false // WARNING: This disables SSL certificate validation.
      });
      const { data } = await axios.post("https://127.0.0.1:8000/api/v1/auth/login", body, { httpsAgent });
      return  data.authToken 
    }),
});
