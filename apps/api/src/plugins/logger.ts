import { logger } from "@bogeychan/elysia-logger";

/**
 * Standardized Community Logger Plugin
 * Uses Pino for high-performance structured logging.
 *
 * In production, it logs JSON for ingestion.
 * In development, it uses pino-pretty for human-readable console output.
 */
export const loggerPlugin = logger({
	level: "info",
	// Use pino-pretty in development for beautiful console logs
	transport:
		process.env.NODE_ENV === "development"
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "HH:MM:ss Z",
						ignore: "pid,hostname",
					},
				}
			: undefined,
});
