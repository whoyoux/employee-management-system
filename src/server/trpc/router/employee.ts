import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const employeeRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return `${input?.id}`;
    }),
});
