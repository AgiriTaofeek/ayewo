import "dotenv/config";
import { app } from "./app";
import { env } from "./env";

app.listen(env.PORT);

console.log(
	`\x1b[32m[READY]\x1b[0m 🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);
console.log(
	`\x1b[34m[DOCS]\x1b[0m 📚 Swagger v1 available at http://${app.server?.hostname}:${app.server?.port}/api/v1/swagger`,
);

/**
 * Graceful Shutdown Handling
 */
const handleShutdown = async () => {
	console.log(
		"\n\x1b[33m[SHUTDOWN]\x1b[0m 🛑 Gracefully shutting down Ayewo API...",
	);
	await app.stop();
	process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
