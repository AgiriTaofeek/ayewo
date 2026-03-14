# MVP: Authentication & Onboarding Flow

## Overview
Ayewo uses a **Workspace-first** onboarding flow, leveraging the Better Auth `organization` plugin. This ensures a seamless transition from a single individual to a distributed QA team.

## The Seamless User Flow

1. **The First User (The "Founder")**
   - User signs up with their work email.
   - User is prompted to **Create a Workspace** (e.g., "Acme QA Team").
   - Upon creation, this user is automatically assigned the **Owner/Admin** role for that workspace.
   - They land on the Dashboard as the sole member.

2. **Inviting the Team**
   - The Admin goes to "Settings > Team" and sends email invites to colleagues.
   - During invitation, the Admin selects an initial role: **Manager** or **Tester**.
   - Better Auth generates a secure, unique invite link sent via email.

3. **Joining the Workspace**
   - Colleagues click the link, create their account (if they don't have one), and are automatically joined to the "Acme QA Team" workspace with their pre-assigned role.
   - (Optional) **Domain Discovery**: If enabled, users with the same `@acme.com` domain can see and request to join the workspace without an explicit invite.

## Role-Based Access Control (RBAC)

Inside a Workspace, permissions are enforced as follows:

- **Admin (Owner)**:
    - Manage billing and workspace settings.
    - Delete the workspace or projects.
    - Invite/Remove members and change their roles.
- **Manager**:
    - Create/Edit projects and requirements.
    - Define test strategies, milestones, and cycles.
    - Assign test runs to Testers.
- **Tester**:
    - Create/Edit test cases.
    - Execute assigned test runs.
    - View reports and analytics.

## Authentication Strategy: Hybrid-Session (Stateful & Secure)

For a world-class enterprise SaaS like Ayewo, we adopt a **Hybrid-Session** strategy using Better Auth:

1. **Session-Based (Main App)**: We use secure, server-side sessions stored in our database. This allows **immediate revocation** of access for security breaches—a mandatory requirement for enterprise clients.
2. **Encrypted Cookies**: Sessions are delivered via `HttpOnly`, `Secure`, and `SameSite: Lax/Strict` cookies to eliminate XSS/CSRF risks.
3. **JWT for Extensibility**: We provide JWT-based API keys for third-party integrations (CI/CD pipelines, DevOps tools).

## Seamless Login Experience

To deliver a "premium" feel, we implement:
- **Passkeys (WebAuthn)**: Biometric/Hardware login (TouchID/FaceID) for frictionless, passwordless access.
- **Social/Enterprise SSO**: One-click login via Google Workspace and GitHub.
- **SAML Integration (v2)**: Ready-to-scale for enterprise identity providers (Okta, Azure AD).
- **Persistent Sessions**: "Remember me" functionality that keeps the user logged in securely for up to 30 days.

## Implementation Details (Better Auth)
- **Plugin**: Enable `organization`, `passkey`, and `social-providers`.
- **Database**: Prisma handles `Session` and `Organization` persistence.

## Success Criteria
- A user can sign up and create a workspace in under 60 seconds.
- An invited tester can log in and find their assigned test runs immediately.
- A tester is restricted from editing workspace-level settings.
