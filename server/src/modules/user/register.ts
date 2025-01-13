import { TRPCError } from "@trpc/server";
import argon2d from "argon2";
import { z } from "zod";
import { __prod__ } from "../../constants/prod";
import db from "../../database/db";
import { DbUser, users } from "../../database/schema";
import { publicProcedure } from "../../trpc";
import { sendAuthCookies } from "../../utils/createAuthTokens";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Input validation
export const registerInput = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
}).pick({
  email: true,
  password: true,
  name: true,
});

// Output validation
export const registerOutput = createSelectSchema(users).omit({
  password: true,
  refreshTokenVersion: true,
});

export const register = publicProcedure
  .input(registerInput)
  .output(registerOutput)
  .mutation(async ({ input, ctx }) => {
    let newUser: DbUser;

    try {
      newUser = (
        await db
          .insert(users)
          .values({
            email: input.email.toLowerCase(),
            password: await argon2d.hash(input.password),
          })
          .returning()
      )[0];
    } catch (e: any) {
      if (e.message.includes("users_email_unique")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }

    if (__prod__) {
      return newUser;
    } else {
      sendAuthCookies(ctx.res, newUser);
      return newUser;
    }
  });
