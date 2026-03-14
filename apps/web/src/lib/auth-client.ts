// import { passkeyClient } from "@better-auth/passkey/client";
// import { organizationClient, twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "./env";

export const authClient = createAuthClient({
	baseURL: env.VITE_BETTER_AUTH_URL,
	// plugins: [
	// 	organizationClient(),
	// 	twoFactorClient(),
	// 	usernameClient(),
	// 	passkeyClient(),
	// ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
