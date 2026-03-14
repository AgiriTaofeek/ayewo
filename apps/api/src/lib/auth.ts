import { prisma } from "@repo/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
// import { passkey } from "@better-auth/passkey";
// import { organization, twoFactor, username } from "better-auth/plugins";
import { env } from "../env";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	basePath: "/api/v1/auth",
	trustedOrigins: [env.FRONTEND_URL],
	emailAndPassword: {
		enabled: true,
	},
	// socialProviders: {
	// 	google: {
	// 		clientId: env.GOOGLE_CLIENT_ID || "",
	// 		clientSecret: env.GOOGLE_CLIENT_SECRET || "",
	// 	},
	// 	github: {
	// 		clientId: env.GITHUB_CLIENT_ID || "",
	// 		clientSecret: env.GITHUB_CLIENT_SECRET || "",
	// 	},
	// },
	plugins: [
		openAPI(),
		// organization({
		// 	allowUserToCreateOrganization: true,
		// }),
		// twoFactor(),
		// username(),
		// passkey(),
	],
});

/**
 * Helper to extract OpenAPI schema from Better Auth for Elysia Swagger integration
 */
let _schemaPromise: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = () => (_schemaPromise ??= auth.api.generateOpenAPISchema());

export const authOpenAPI = {
	getPaths: async (prefix = "/api/v1/auth") => {
		const schema = await getSchema();
		const paths = schema.paths || {};
		const reference: Record<string, unknown> = Object.create(null);

		for (const path of Object.keys(paths)) {
			const key = prefix + path;
			const pathItem = paths[path as keyof typeof paths];
			reference[key] = pathItem;

			if (pathItem && typeof pathItem === "object") {
				for (const method of Object.keys(pathItem)) {
					const operation = (pathItem as Record<string, unknown>)[method];
					if (
						operation &&
						typeof operation === "object" &&
						!Array.isArray(operation)
					) {
						// Safely add tags to the operation
						(operation as Record<string, unknown>).tags = ["Authentication"];
					}
				}
			}
		}

		// biome-ignore lint/suspicious/noExplicitAny: Cast to any at the boundary to satisfy Elysia Swagger's internal types
		return reference as any;
	},
	getComponents: async () => {
		const schema = await getSchema();
		// biome-ignore lint/suspicious/noExplicitAny: Cast to any at the boundary to satisfy Elysia Swagger's internal types
		return (schema.components || {}) as any;
	},
} as const;
