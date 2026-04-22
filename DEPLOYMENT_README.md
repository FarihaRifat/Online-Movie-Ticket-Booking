# Movie Ticket Booking — Railway + Supabase (production)

## 1. Supabase

1. Create/open project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run the full script from `SUPABASE_SETUP.sql`.
3. Confirm tables: `movies`, `bookings` (and `times` if used).

## 2. Railway (backend)

1. **New Project** → **Deploy from GitHub** → select this repo.
2. **Root directory**: leave empty (uses repo root `Dockerfile`).
3. **Variables** — add **one** of the following (required for the API to start):

### Option A (recommended)

`DATABASE_URL` = copy **Session pooler** URI from Supabase **Connect** (not “Direct” — Direct is IPv6-only and fails on Railway).

- If your DB password contains `@`, replace it with **`%40`** in the URL.

### Option B

- `SUPABASE_POOLER_HOST` — pooler hostname from the same Session pooler screen (e.g. `aws-0-REGION.pooler.supabase.com`).
- `SUPABASE_DB_PASSWORD` — database password.
- Optional: `SUPABASE_POOLER_PORT` (default `5432`), `SUPABASE_DB_USER` (default `postgres.YOUR_PROJECT_REF`), `SUPABASE_PROJECT_REF`, `SUPABASE_DB_NAME`.

4. Deploy. **Health check:** `GET /api/health` (no database).

5. Test: `https://YOUR-RAILWAY-URL.up.railway.app/api/movies` → should return `"success": true` and a `data` array.

## 3. Netlify (frontend)

1. Connect repo; **Base directory** `frontend`, build `npm run build`, publish `dist`.
2. If the Railway URL changes, set build variable **`VITE_API_BASE_URL`** to your Railway base (no trailing slash), then redeploy the site.

## 4. Verify

- [ ] `/api/health` returns `{"ok":true,...}`
- [ ] `/api/movies` lists movies
- [ ] Booking creates a row in Supabase `bookings`

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| `database_not_configured` | Set `DATABASE_URL` or pooler host + password variables. |
| IPv6 / network unreachable | Use **Session pooler** URI, not Direct `db.*:5432`. |
| `Tenant or user not found` | Wrong pooler host/region — copy host exactly from Supabase Connect. |
| Update/delete movie fails | Backend routes `POST /api/movies/update` and `POST /api/movies/delete` (fixed in router). |
