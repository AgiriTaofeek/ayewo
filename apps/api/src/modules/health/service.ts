import { prisma } from "@repo/database";

export abstract class HealthService {
	static async getVitals() {
		const start = performance.now();
		let dbStatus = "up";

		try {
			// Fast connectivity check
			await prisma.$queryRaw`SELECT 1`;
		} catch (e) {
			console.error("Health check database failure:", e);
			dbStatus = "down";
		}

		const end = performance.now();

		return {
			status: dbStatus === "up" ? "healthy" : "degraded",
			timestamp: new Date().toISOString(),
			services: {
				database: dbStatus,
			},
			system: {
				uptime: process.uptime(),
				memory: process.memoryUsage(),
				platform: process.platform,
				runtime: `Bun ${Bun.version}`,
			},
			latency: `${(end - start).toFixed(2)}ms`,
		};
	}
}
