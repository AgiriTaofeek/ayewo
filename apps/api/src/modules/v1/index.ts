import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authOpenAPI } from "../../lib/auth";
import { authModule } from "../auth";
import { healthModule } from "../health";

const authPaths = await authOpenAPI.getPaths();
const authComponents = await authOpenAPI.getComponents();

/**
 * V1 API Module
 * Assembles all version 1 features into a single prefixed instance.
 */
export const v1Module = new Elysia({ prefix: "/api/v1" })
	.use(
		swagger({
			path: "/swagger",
			documentation: {
				info: { title: "Ayewo API v1", version: "1.0.0" },
				paths: authPaths,
				components: authComponents,
			},
		}),
	)
	.use(healthModule)
	.use(authModule)
	.guard(
		{
			beforeHandle({ isAuthenticated, set }) {
				if (!isAuthenticated) {
					set.status = 401;
					return { error: "Unauthorized" };
				}
			},
		},
		(app) =>
			app.get("/protected", ({ user }) => {
				return {
					message: `Hello ${user?.name}, you have accessed a protected route!`,
					user,
				};
			}),
	);
