# Church Schedule Keeper

A React + Vite church website with a secure admin portal.

## Features

- English and Tamil website content
- Public church homepage
- Admin login at `/admin/login`
- Admin dashboard for editing website content
- Weekly schedule management
- Event management
- Contact/social information management
- Hero image URL management
- Supabase Auth + Postgres + Row Level Security

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create an email/password user in Supabase Authentication.
4. Add that user's UUID to `public.admin_users` using the SQL shown in `supabase/schema.sql`.
5. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Run `npm install` and `npm run dev`.

The public site keeps the original design and falls back to the original content if the database is not configured. Once Supabase is configured, the admin portal controls the live content.
