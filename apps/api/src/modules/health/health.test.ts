import { describe, expect, it } from "bun:test";
import { healthModule } from "./index";

describe("Health Module", () => {
	it("GET /health -> returns basic status", async () => {
		const response = await healthModule
			.handle(new Request("http://localhost/health"))
			.then((r) => r.json());

		expect(response.status).toBe("ok");
		expect(typeof response.timestamp).toBe("string");
	});

	it("GET /health/vitals -> returns detailed diagnostics", async () => {
		const response = await healthModule
			.handle(new Request("http://localhost/health/vitals"))
			.then((r) => r.json());

		expect(response.status).toMatch(/healthy|degraded/);
		expect(response.services.database).toMatch(/up|down/);
		expect(response.system).toBeDefined();
		expect(response.system.uptime).toBeGreaterThan(0);
		expect(response.latency).toContain("ms");
	});
});
