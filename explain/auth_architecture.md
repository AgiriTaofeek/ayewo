# Ayewo: Better Auth Architectural Deep Dive

This document explains the "World-Class" authentication system implemented in Ayewo, covering everything from the database layer to the user session flow.

---

## 1. The Data Foundation (Prisma Schema)

Our database schema is designed for **Multi-Tenancy (Workspaces)** and **High Security**.

### Key Models
- **`User`**: The central identity.
    - `username`: Unique handle for the user.
    - `twoFactorEnabled`: Toggle for 2FA security.
    - `displayEmail`: A secondary field for public-facing emails if different from the login email.
- **`Session`**: Tracks active logins.
    - `token`: The session identifier stored in the user's cookie.
    - `activeOrganizationId`: **CRITICAL**. This persists which workspace the user is currently working in. Without this, switching tabs would lose your workspace context.
- **`Account`**: Handles login methods (OAuth or Password).
    - `@@unique([providerId, accountId])`: Prevents duplicate links to the same social account.
- **`Organization` (Workspaces)**: The container for projects and teams.
- **`Member`**: Links a `User` to an `Organization` with a `role` (Admin, Manager, Tester).
- **`Passkey`**: Stores WebAuthn public keys for biometric login (TouchID/FaceID).

## 1.1 Data Modeling & Relationships

For a world-class system, the relationships between these models must be robust and clear.

### The Identity Hub (User)
The `User` is the core. Every other security model orbits it.
- **Relational Logic**: 
    - `sessions Session[]`: A User can be logged in on multiple devices (Laptop, Mobile).
    - `accounts Account[]`: A User can link multiple login methods (Email + Google + GitHub).
- **Prisma Syntax**:
    ```prisma
    model User {
      id       String    @id @default(uuid())
      sessions Session[]
      accounts Account[]
    }
    ```

### The Workspace Bridge (Member)
We don't link Users directly to Organizations. We use a **Join Table** (`Member`).
- **Reasoning**: This allows us to store "Contextual Data"—specifically the `role`. A user might be an `ADMIN` in one workspace but a `TESTER` in another.
- **Relationship**: Many-to-Many via `Member`.
- **Prisma Syntax**:
    ```prisma
    model Member {
      userId         String
      organizationId String
      role           String
      user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
      organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
    }
    ```
    *(Note: `onDelete: Cascade` ensures that if an organization is deleted, all member records are wiped automatically!)*

### Security & Hardware (Passkey & TwoFactor)
To protect user accounts, we provide 1:N (one-to-many) relationships for security credentials.
- **Reasoning**: A user should be able to register multiple Passkeys (e.g., MacBook TouchID and a YubiKey).
- **Prisma Syntax**:
    ```prisma
    model Passkey {
      userId String
      user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
    }
    ```

---

## 2. Server Configuration (`apps/api/src/lib/auth.ts`)

We use **Better Auth** as a headless, framework-agnostic engine.

### Plugins & Features
- **Prisma Adapter**: Bridges the auth engine to our database.
- **Organization Plugin**: Handles the logic for creating workpaces, inviting members, and managing roles.
- **Two-Factor Plugin**: Manages TOTP secrets and backup codes.
- **Username Plugin**: Allows users to log in or be identified by a handle instead of just an email.
- **Social Providers**: Configured for Google and GitHub.

### Security Implementation
- **Hybrid-Session**: Better Auth generates a session in the database and a corresponding high-security cookie on the client.
- **Revocation**: Unlike stateless JWTs, we can delete a row in the `Session` table to **instantly** log someone out if their account is compromised.

---

## 3. The API Bridge (`apps/api/src/app.ts`)

Elysia is a fast Bun-based framework. We mount Better Auth like this:
```typescript
.all("/api/auth/*", (ctx) => auth.handler(ctx.request))
```
- **`.all("*")`**: Better Auth handles all HTTP methods (GET, POST, etc.) for its internal routes (e.g., `/api/auth/sign-in`, `/api/auth/organization/create`).
- **CORS**: We explicitly allow `credentials: true` so the browser can send and receive the session cookies securely.

---

## 4. The User Flow (Step-by-Step)

### A. Sign Up & Onboarding
1. User calls `authClient.signUp.email()`.
2. Better Auth creates a `User` and an `Account` (password) in the DB.
3. The user then calls `authClient.organization.create()`.
4. Better Auth creates an `Organization` and a `Member` record, assigning the user the "owner" role.

### B. Sign In
1. User provides credentials.
2. Better Auth verifies the password/OAuth.
3. A new row is added to the `Session` table.
4. A secure cookie named `better-auth.session-token` is sent to the browser with `HttpOnly` and `Secure` flags.

### C. Authenticated Requests
1. Every time the user visits the dashboard, the browser sends the cookie.
2. The server calls `auth.getSession()`.
3. It checks the DB to see if the token is valid and not expired.
4. It attaches the `User` and `Session` (including `activeOrganizationId`) to the request context.

### D. Logout
1. The client calls `authClient.signOut()`.
2. The server deletes the `Session` row from the database.
3. The server sends an expired cookie to the browser to clear it locally.

---

## 5. Client Integration (`apps/web/src/lib/auth-client.ts`)

We use the `@better-auth/react` hooks for a seamless UI:
- **`useSession()`**: A real-time hook that tells the UI if a user is logged in.
- **`signIn.social()`**: Triggers the OAuth flow.
- **`organization.setActive()`**: Updates the `activeOrganizationId` in the database so the user stays in the right workspace.

---

## Why this is "World Class"
By using this architecture, Ayewo achieves **Enterprise-Grade Security** (Session revocation, 2FA, Passkeys) while maintaining **Developer Simplicity** (Type-safety, modular plugins). Every piece of data is linked, audited, and protected.
