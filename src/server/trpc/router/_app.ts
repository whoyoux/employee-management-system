// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { employeeRouter } from "./employee";
import { projectRouter } from "./project";

export const appRouter = router({
  auth: authRouter,
  employee: employeeRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
