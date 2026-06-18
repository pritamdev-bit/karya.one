# KARYA.ONE

An AI-powered productivity super app that unifies Gmail and Google Calendar with an intelligent assistant. Built with Next.js, Clerk authentication, Corsair OAuth, and an AI agent powered by DeepSeek.

## Features

- **Unified Inbox** -- Gmail-like email interface with sidebar navigation, labels, pagination, and full email detail view
- **Smart Calendar** -- Full calendar with Day/Week/Month/Agenda views, color-coded events, and conflict detection
- **AI Assistant (Karya AI)** -- Chat with an AI that can read, search, and summarize emails, draft replies, and manage calendar events
- **Dashboard** -- Three-panel layout combining inbox, AI chat, and calendar at a glance
- **OAuth Integration** -- Seamless Google account connection for Gmail and Google Calendar via Corsair
- **Authentication** -- Email/password sign-in, Google SSO, and email OTP verification via Clerk

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Runtime | Bun (package manager) |
| Styling | Tailwind CSS v4 + shadcn/ui (radix-nova) |
| Authentication | Clerk (`@clerk/nextjs`) |
| Database | Neon PostgreSQL + Drizzle ORM |
| AI | OpenAI Agents SDK + DeepSeek (`deepseek-v4-flash`) |
| OAuth / Integrations | Corsair SDK (`@corsair-dev/gmail`, `@corsair-dev/googlecalendar`) |

## Project Structure

```
super-app/
├── app/
│   ├── api/
│   │   ├── auth/              # OAuth callback handler
│   │   ├── connect/           # Initiates Google OAuth flow
│   │   ├── chat/              # AI chat endpoint (SSE streaming)
│   │   ├── emails/            # Email list + detail endpoints
│   │   ├── calendar/          # Google Calendar events endpoint
│   │   ├── revoke-access/     # Disconnect Google integrations
│   │   └── utils/             # Rate limiter, stale data checker
│   ├── (user)/
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── inbox/             # Full inbox + email detail pages
│   │   ├── calendar/          # Full calendar page
│   │   └── components/        # Shared UI components (TopNav, panels, etc.)
│   ├── sign-in/               # Sign-in page
│   ├── sign-up/               # Sign-up page with OTP verification
│   ├── onboarding/            # Google account connection flow
│   ├── layout.tsx             # Root layout (ClerkProvider, font)
│   ├── page.tsx               # Landing / marketing page
│   └── globals.css            # Tailwind + shadcn theme variables
├── components/
│   ├── login-form.tsx         # Login form component
│   ├── signup-form.tsx        # Signup form component
│   └── ui/                    # shadcn/ui components
├── src/
│   └── server/
│       ├── corsair.ts         # Corsair instance (plugins, DB, encryption)
│       ├── ai.ts              # AI agent factory (DeepSeek + MCP tools)
│       └── db/
│           └── schema.ts      # Drizzle ORM schema (4 tables)
├── proxy.ts                   # Clerk middleware (auth, onboarding gate)
├── drizzle.config.ts          # Drizzle Kit configuration
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) (recommended)
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) account with email/password + Google OAuth enabled
- A [Google Cloud Console](https://console.cloud.google.com/) project with Gmail API and Google Calendar API enabled
- A [DeepSeek](https://platform.deepseek.com/) API key (or any OpenAI-compatible API)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd super-app
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root based on the provided `.env.example`:

```bash
cp .env.example .env
```

Then fill in your actual credentials. See the [Environment Variables](#environment-variables) section for details.

### 4. Set up the database

Make sure your `DATABASE_URL` points to your Neon PostgreSQL database, then push the schema:

```bash
npx drizzle-kit push
```

### 5. Set up Google Cloud Console

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Gmail API** and **Google Calendar API**
3. Create **OAuth 2.0 credentials** (Web application type)
4. Add `http://localhost:3000/api/auth` as an authorized redirect URI
5. Configure these credentials in your Corsair integration

### 6. Set up Clerk

1. Create a project at [clerk.com](https://clerk.com/)
2. Enable **Email address** authentication (password + email verification)
3. Enable **Google** as a social connection
4. Copy the API keys into your `.env` file

### 7. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `CORSAIR_KEK` | Yes | Key Encryption Key for Corsair token storage (generate a strong random string) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key (starts with `pk_test_` or `pk_live_`) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (starts with `sk_test_` or `sk_live_`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Sign-in page URL (typically `/sign-in`) |
| `APP_URL` | Yes | Base URL for OAuth redirects (e.g., `http://localhost:3000`) |
| `OPENAI_API_KEY` | Yes | API key for DeepSeek or OpenAI-compatible provider |
| `BASE_URL` | Yes | API base URL (e.g., `https://api.deepseek.com/v1`) |

> **Never commit your `.env` file to version control.** The `.gitignore` is configured to exclude `.env*` files.

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/connect?plugin=<name>` | GET | Initiates Google OAuth flow for the specified plugin |
| `/api/auth` | GET | Handles OAuth callback from Google |
| `/api/chat` | POST | AI chat endpoint (streams responses via SSE) |
| `/api/emails` | GET | Fetches Gmail messages (cached, paginated) |
| `/api/emails/[id]` | GET | Fetches a single email with full body |
| `/api/calendar` | GET | Fetches Google Calendar events |
| `/api/revoke-access` | POST | Disconnects all Google integrations |

## Architecture

### Authentication Flow

1. User signs in/up via Clerk (email/password, Google SSO, or OTP)
2. Middleware (`proxy.ts`) checks if user is authenticated
3. If authenticated, middleware checks if Gmail + Calendar are both connected via Corsair
4. If not connected, user is redirected to `/onboarding` to connect accounts step-by-step
5. Once both are connected, user can access the dashboard and all features

### AI Agent

Karya AI is built with the [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) and uses the DeepSeek `deepseek-v4-flash` model. It has access to Gmail and Calendar tools via Corsair's MCP integration, allowing it to:

- Read, search, and summarize emails
- Draft and send email replies
- List, create, update, and delete calendar events
- Check schedules and find free slots

Chat responses are streamed via Server-Sent Events (SSE) for real-time rendering.

### Data Caching

Email data is cached in PostgreSQL via the `corsair_entities` table with a 5-minute staleness window. The app checks if cached data is older than 5 minutes before refetching from the Gmail API.

### Rate Limiting

API endpoints are protected with an in-memory sliding window rate limiter:

- `/api/emails`: 10 requests/minute per user
- `/api/emails/[id]`: 20 requests/minute per user
- `/api/calendar`: 10 requests/minute per user

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start the development server |
| `bun build` | Build the production bundle |
| `bun start` | Start the production server |
| `bun lint` | Run ESLint |

## License

This project is private and not open for public distribution.
