import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const employeeRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return `${input?.id}`;
    }),
  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        projectId: z.string(),
        addedById: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { firstName, lastName, projectId, addedById } = input;
      const employee = await ctx.prisma.employee.create({
        data: {
          firstName,
          lastName,
          projectId,
          addedById,
        },
      });
      return employee;
    }),
});
