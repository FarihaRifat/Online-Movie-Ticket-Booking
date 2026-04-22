# Movie Ticket Booking — Railway + Supabase (production)

## 1. Supabase

1. Create/open project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run the full script from `SUPABASE_SETUP.sql`.
3. Confirm tables: `movies`, `bookings` (and `times` if used).

---

## 2. Why “Direct” fails on Railway

Supabase **Direct** (`db.<project>.supabase.co`, port **5432**, user `postgres`) is **not IPv4 compatible** for many hosts. Railway reaches the database over **IPv4**, so you get **network unreachable** or IPv6 errors.

**Use Session pooler instead** (Supabase → **Connect** → choose **Session pooler**, not “Direct”).

---

## 3. Railway (backend) — variables

1. **New Project** → **Deploy from GitHub** → this repo.
2. **Root directory**: empty (uses root `Dockerfile`).
3. Add variables using **Option A** *or* **Option B** below.

### Option B (best if your password contains `@` or `#`)

No URL encoding. Copy values from Supabase **Connect → Session pooler** (host, user, port).

| Variable | Example | Notes |
|----------|---------|--------|
| `SUPABASE_POOLER_HOST` | `aws-0-ap-south-1.pooler.supabase.com` | Copy **exactly** from Supabase (region may differ: `aws-0-`, `aws-1-`, etc.). |
| `SUPABASE_DB_PASSWORD` | *(your database password)* | Plain text in Railway is fine; special characters OK. |
| `SUPABASE_DB_USER` | `postgres.bxlwxucefflxeiyqeoew` | Format `postgres.<project-ref>` from Session pooler screen. |
| `SUPABASE_POOLER_PORT` | `5432` | Default if omitted. |
| `SUPABASE_DB_NAME` | `postgres` | Default if omitted. |

Do **not** use the Direct host `db....supabase.co` here — use the **pooler** hostname from the Session pooler tab.

### Option A (`DATABASE_URL`)

Copy the **Session pooler** URI from Supabase (not Direct).

- If you put the URI in Railway, the password must be **URL-encoded** in that single string: **`@` → `%40`**, **`#` → `%23`**, etc.

**Wrong (broken parsing because of `@` in password):**

```text
postgresql://postgres:MyPass@word@db.xxx.supabase.co:5432/postgres
```

**Right (password `MyPass@word` encoded):**

```text
postgresql://postgres:MyPass%40word@aws-0-REGION.pooler.supabase.com:5432/postgres
```

Use the **pooler host** from the Session pooler UI, not `db.xxx.supabase.co`, unless Supabase’s copied URI still shows it for session mode (follow what the dashboard copies).

4. **Health check:** `GET /api/health` (no database).
5. Test: `https://YOUR-SERVICE.up.railway.app/api/movies` → `"success": true` and `data` array.

---

## 4. Netlify (frontend)

- Base directory **`frontend`**, build `npm run build`, publish **`dist`**.
- Optional: **`VITE_API_BASE_URL`** = your Railway URL (no trailing slash) if it is not the default in `apiConfig.js`.

---

## 5. Verify

- [ ] `GET /api/health` → `{"ok":true,...}`
- [ ] `GET /api/movies` → lists movies
- [ ] Booking inserts a row in Supabase `bookings`

---

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| `database_not_configured` | Set `DATABASE_URL` **or** `SUPABASE_POOLER_HOST` + `SUPABASE_DB_PASSWORD`. |
| `@` in password breaks `DATABASE_URL` | Use **Option B** (separate password variable), **or** encode `@` as `%40` in the URI. |
| IPv6 / network unreachable | You used **Direct** `db.*:5432` — switch to **Session pooler** host + port `5432`. |
| `Tenant or user not found` | Wrong pooler host/region — copy host from Session pooler exactly; set `SUPABASE_DB_USER` to `postgres.<ref>` from that screen. |
| Update/delete movie fails | Use `POST /api/movies/update` and `POST /api/movies/delete` (router supports these). |
