import { type Context, Elysia } from "elysia";
import { auth } from "../../lib/auth";

/**
 * Auth Module Controller
 * Handles authentication routing and session identity.
 */
export const authModule = new Elysia({ name: "auth-module", prefix: "/auth" })
	// Mount the Better Auth handler
	.all(
		"/*",
		(context: Context) => {
			const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
			if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
				return auth.handler(context.request);
			}
			context.set.status = 405;
			return "Method Not Allowed";
		},
		{
			// CRITICAL: Disable Elysia's automatic body parsing for auth routes.
			// Better Auth expects a raw, unread request stream.
			parse: "none",
		},
	)
	// Use derive to resolve session and share it globally
	.derive({ as: "global" }, async ({ request: { headers } }) => {
		const session = await auth.api.getSession({ headers });

		return {
			user: session?.user,
			session: session?.session,
			isAuthenticated: !!session,
		};
	});
