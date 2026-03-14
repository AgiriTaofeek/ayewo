import { t } from "elysia";

export const HealthModel = {
	basic: t.Object({
		status: t.String(),
		timestamp: t.String(),
	}),
	vitals: t.Object({
		status: t.String(),
		timestamp: t.String(),
		services: t.Object({
			database: t.String(),
		}),
		system: t.Object({
			uptime: t.Number(),
			memory: t.Object({
				rss: t.Number(),
				heapTotal: t.Number(),
				heapUsed: t.Number(),
				external: t.Number(),
				arrayBuffers: t.Optional(t.Number()),
			}),
			platform: t.String(),
			runtime: t.String(),
		}),
		latency: t.String(),
	}),
} as const;
