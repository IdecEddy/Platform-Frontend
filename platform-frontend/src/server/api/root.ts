import { authRouter } from "~/server/api/routers/auth";
import { createTRPCRouter } from "~/server/api/trpc";
import { configRouter } from "./routers/config";
import { clusterRouter } from "./routers/clusters";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  config: configRouter,
  clusters: clusterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
