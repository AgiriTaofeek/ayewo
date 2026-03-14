import cors from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { rateLimit } from "elysia-rate-limit";
import { env } from "./env";
import { v1Module } from "./modules/v1";
import { loggerPlugin } from "./plugins/logger";
import { requestIdPlugin } from "./plugins/request-id";

export const app = new Elysia()
	.use(
		helmet({
			contentSecurityPolicy: process.env.NODE_ENV === "production",
		}),
	)
	.use(requestIdPlugin)
	.use(loggerPlugin)
	.use(
		rateLimit({
			max: 100, // max 100 requests per minute per IP
			duration: 60000,
		}),
	)
	.use(
		cors({
			origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
			credentials: true,
		}),
	)
	.use(opentelemetry())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return { error: "Not Found" };
		console.error(error);
	})
	.use(v1Module);

export type App = typeof app;
