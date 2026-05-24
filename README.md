# Shiftly AI

Mobile-first Nuxt app for staff scheduling, realtime workplace updates and a lightweight AI assistant.

## Stack

- Nuxt 4
- Vue 3
- Tailwind CSS
- Supabase Auth, database and realtime
- Pinia

## Environment

Create a local `.env` from `.env.example` and fill in your Supabase project values:

```bash
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_KEY=
NUXT_SUPABASE_SECRET_KEY=
NUXT_ADMIN_EMAILS=owner@example.com,manager@example.com
```

`OPENAI_API_KEY` is optional in the current codebase and reserved for replacing the rule-based chat endpoint with a live OpenAI-backed assistant.

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Use `npm run check` before deployment. It runs TypeScript checks and then a production build.

## Admin Console

Allowed admin users can open `/admin` to manage operational content:

- publish announcements and optionally create a team notification
- create and delete shifts
- add employees
- update employee work status
- send and delete notifications

The admin console uses Nuxt server API routes and the Supabase service role key, then checks the signed-in user's email against `NUXT_ADMIN_EMAILS`. Keep `NUXT_SUPABASE_SECRET_KEY` server-only and never expose it as a public env var.

## Deploy

Set the same environment variables in your hosting provider, then run:

```bash
npm run build
```

The production server output is generated in `.output`.
