import { Elysia } from "elysia";
import { HealthModel } from "./model";
import { HealthService } from "./service";
/**
 * Health Module Controller
 * Handles vitality and diagnostic routing.
 */
export const healthModule = new Elysia({
	name: "health-module",
	prefix: "/health",
})
	.get(
		"/",
		() => ({
			status: "ok",
			timestamp: new Date().toISOString(),
		}),
		{
			detail: {
				summary: "Service Vitality",
				description: "Simple check to verify the server is responding.",
				tags: ["System"],
			},
			response: HealthModel.basic,
		},
	)
	.get("/vitals", () => HealthService.getVitals(), {
		detail: {
			summary: "System Vitals",
			description:
				"Comprehensive diagnostics including database health, resource usage, and latency.",
			tags: ["System"],
		},
		response: HealthModel.vitals,
	});
