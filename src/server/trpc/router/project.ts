import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "../../../env/server.mjs";

export const projectRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          employees: true,
          createdAt: true,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const projectName = input.name.trimStart().trimEnd();

      if (projectName.length <= 3) {
        throw new TRPCError({
          message: "Project name must contain at least 3 character",
          code: "BAD_REQUEST",
        });
      }

      if (projectName.length >= 15) {
        throw new TRPCError({
          message: "Project name must contain at most 15 character",
          code: "BAD_REQUEST",
        });
      }

      if (!input.name) {
        throw new TRPCError({
          message: "Please provide a project name",
          code: "BAD_REQUEST",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          isPremium: true,
          projects: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user)
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });

      if (
        !user.isPremium &&
        user.projects.length >= (+env.MAX_FREE_PROJECTS || 2)
      ) {
        throw new TRPCError({
          message: `You reached the limit of projects!`,
          code: "UNAUTHORIZED",
        });
      }

      return await ctx.prisma.project.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name.trim(),
        },
        select: {
          id: true,
          name: true,
        },
      });
    }),
});
