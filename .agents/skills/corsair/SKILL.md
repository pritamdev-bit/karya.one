# Corsair Integration Skill

## Overview

Corsair handles OAuth flows for third-party integrations (Gmail, Google Calendar). It manages token storage, encryption, and multi-tenancy via Clerk user IDs.

## Architecture

```
src/server/corsair.ts          # Corsair instance (plugins, DB, encryption)
app/api/connect/route.ts       # Initiates OAuth → redirects to provider
app/api/auth/route.ts          # Handles OAuth callback → stores tokens
```

## Available Plugins

| Plugin | Package | Route Param |
|---|---|---|
| Gmail | `@corsair-dev/gmail` | `gmail` |
| Google Calendar | `@corsair-dev/googlecalendar` | `googlecalendar` |

## Connect Flow

1. User clicks connect button
2. Redirect to `/api/connect?plugin=<plugin_name>`
3. Route generates OAuth URL via `generateOAuthUrl(corsair, plugin, { tenantId, redirectUri })`
4. Stores `state` in httpOnly cookie (`oauth_state`, 10 min expiry)
5. User authorizes on Google
6. Google redirects to `/api/auth?code=...&state=...`
7. Route verifies state cookie, calls `processOAuthCallback(corsair, { code, state, redirectUri })`
8. Tokens stored encrypted in DB, cookie cleared

## Key Code References

### Initiating a connection (client-side)

```tsx
// Simple redirect — browser handles the OAuth flow
window.location.href = `/api/connect?plugin=gmail`;
```

### Connecting multiple plugins sequentially

```tsx
// Connect Gmail first, then Calendar after callback
// Modify app/api/auth/route.ts to redirect to next plugin
window.location.href = `/api/connect?plugin=gmail`;
```

### Checking connected status (server-side)

```tsx
import { corsair } from '@/src/server/corsair';

// List connected plugins for a tenant
const integrations = await corsair.getIntegrations(tenantId);
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection (Neon) |
| `CORSAIR_KEK` | Key encryption key for token storage |
| `APP_URL` | Base URL for OAuth redirects (e.g., `http://localhost:3000`) |

## Modifying the Callback

Edit `app/api/auth/route.ts` to change post-connection behavior:
- Redirect to another plugin connection (step-by-step onboarding)
- Redirect to dashboard
- Show a success page

Current behavior: shows a simple HTML success page with a link home.

## Multi-Tenancy

Corsair uses Clerk's `userId` as the `tenantId`. Each user's tokens are isolated. The `auth()` helper from `@clerk/nextjs/server` provides the `userId`.
