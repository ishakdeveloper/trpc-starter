import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { __prod__ } from "./constants/prod";
import { router, publicProcedure } from "./trpc";
import { createContext } from "./trpc";
import { me } from "./modules/user/me";
import { logout } from "./modules/user/logout";
import { register } from "./modules/user/register";
import { login } from "./modules/user/login";

export const appRouter = router({
  me,
  logout,
  register,
  login,
  hello: publicProcedure.query(() => "Hello World"),
});

export const app = express();

app.use(
  "/trpc",
  cors({
    maxAge: __prod__ ? 86400 : undefined,
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
  cookieParser(),
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError(opts) {
      const { error, type, path, input, ctx, req } = opts;
      console.error("Error:", error);
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.log("Internal server error");
      }
    },
  })
);

export type AppRouter = typeof appRouter;
