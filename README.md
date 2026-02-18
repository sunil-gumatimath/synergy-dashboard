# Synergy EMS

[**Demo Link**](https://synergy-emp-crm.vercel.app/) – Try Synergy EMS live

Synergy EMS is a full-featured employee management platform built with React and Supabase.  
It covers HR operations, team productivity, and internal collaboration in one web app.

## About the Project

Synergy EMS is designed as an internal operations platform for growing teams that need one place to manage people data and day-to-day execution. Instead of using separate tools for attendance, leave, tasks, support, reporting, and team communication, this project combines them into a single role-based dashboard experience.

The current implementation focuses on:

- Practical HR workflows for Admin/Manager/Employee roles
- Fast, responsive frontend interactions with realtime updates
- A deployable architecture that works for local development and production

## What You Get

- Employee management with profile, document, and note workflows
- Role-aware experience for `Admin`, `Manager`, and `Employee`
- Time tracking, leave management, calendar, and reporting
- Tasks board, support tickets, performance reviews, and team chat
- Realtime-backed frontend with Supabase Auth + Postgres + Realtime
- Production-ready Docker + Nginx setup and PWA support

## Tech Stack

- React 19 + React Router 7
- Vite 6
- Supabase (`@supabase/supabase-js`)
- Bun (required package manager/runtime for this repo)
- Recharts, date-fns, lucide-react
- Docker (multi-stage build) + Nginx

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```powershell
Copy-Item .env.example .env.local
```

Set values in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Initialize database

Choose one approach.

`Option A (recommended for local demo/dev):`
- Run `database/synergy_ems_complete.sql` in Supabase SQL Editor.
- This is destructive (drops/recreates core tables and inserts seed data).
- If needed, run `database/update_user_roles.sql`.
- Run `supabase/migrations/20260218000000_chat_tables.sql` for chat tables.

`Option B (migration-driven):`
- Run, in order:
1. `supabase/migrations/20260101000000_setup.sql`
2. `supabase/migrations/20260101000001_fix_rls.sql`
3. `supabase/migrations/20260218000000_chat_tables.sql`

### 4. Start the app

```bash
bun run dev
```

Open `http://localhost:5173`.

## Demo Login (Seed Data)

If you used the full seed SQL:

- Email: `admin@gmail.com`
- Password: `Admin@123`

## NPM Scripts

- `bun run dev` - start dev server
- `bun run build` - production build to `dist/`
- `bun run preview` - preview production build
- `bun run lint` - run ESLint

## Access Matrix

| Area | Employee | Manager | Admin |
|---|---|---|---|
| `/dashboard` | Yes | Yes | Yes |
| `/analytics` | No | Yes | Yes |
| `/employees` + `/employees/:id` | No | Yes | Yes |
| `/reports` | No | Yes | Yes |
| `/tasks`, `/leave`, `/timetracking`, `/calendar`, `/support`, `/chat`, `/performance`, `/settings`, `/profile` | Yes | Yes | Yes |
| `/login`, `/reset-password` | Public | Public | Public |

## Docker Run

`docker-compose.yml` builds and serves the production build on port `8080`.

1. Ensure `.env` exists with:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

2. Build and run:

```bash
docker compose up -d --build
```

3. Open `http://localhost:8080`.

## Project Structure

```text
src/
  components/              UI + layout components
  contexts/                Auth/theme/toast providers
  features/                Domain modules (employees, tasks, leave, reports, chat, etc.)
  pages/                   Login/profile/reset-password/detail pages
  services/                Supabase data-access layer
  lib/                     Supabase client + token refresh
database/                  Complete SQL setup + utility scripts
supabase/migrations/       Migration scripts
public/                    Static assets + manifest + service worker
Dockerfile                 Multi-stage production build
docker-compose.yml         Local container orchestration
nginx.conf                 SPA routing + caching + security headers
```

## Important Notes

- `npm install` is intentionally blocked by `preinstall` (`only-allow bun`).
- If env vars are missing, the app falls back to placeholder Supabase values and auth/data calls will fail.
- Team chat requires chat migration tables (`conversations`, `messages`, `message_reactions`, `user_presence`).

## License

This project is open-source and free to use under the MIT License.  
See `LICENSE` for full terms.
