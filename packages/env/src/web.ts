import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const webEnv = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_BETTER_AUTH_URL: z.string().url(),
		VITE_API_URL: z.string().url(),
	},
	runtimeEnv: {
		VITE_BETTER_AUTH_URL:
			process.env.VITE_BETTER_AUTH_URL ??
			(import.meta as unknown as { env: Record<string, string> }).env
				?.VITE_BETTER_AUTH_URL,
		VITE_API_URL:
			process.env.VITE_API_URL ??
			(import.meta as unknown as { env: Record<string, string> }).env
				?.VITE_API_URL,
	},
	emptyStringAsUndefined: true,
	skipValidation:
		!!process.env.SKIP_ENV_VALIDATION ||
		process.env.NODE_ENV === "test" ||
		!!process.env.CI,
});
