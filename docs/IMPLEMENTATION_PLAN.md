# Royal CI — Institute Management System

Internal implementation guide. **Do not surface step numbers or “phase” labels in user-facing UI.**

---

## Scope (current)

| Surface | Included |
|---------|----------|
| Public Website | Home, About, Courses, Gallery, Contact, Enquiry |
| Admin Panel | Single institute admin (no institute switcher UI) |
| Student Panel | Approved students only |

**Not in scope:** Institute Panel, multi-institute UI, Razorpay, SMS/WhatsApp automation, mobile app, custom certificate builder.

**Database:** `Institute` model + `instituteId` on tenant-scoped tables for future multi-institute — not exposed in UI today.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Database | **PostgreSQL** (Prisma) — production & local dev via Docker |
| Auth | HTTP-only JWT session cookie (`jose`) + role guards |
| Storage | **Supabase Storage** via `StorageProvider` abstraction; local `.storage-dev/` fallback in dev |
| Validation | Zod |
| PDFs | `pdf-lib` (documents module — later) |

---

## Database

See `prisma/schema.prisma`.

- Provider: `postgresql` only (no SQLite in production).
- `Institute` is the tenant root; all admin/student data is scoped by `instituteId`.
- File references use `storageKey` (bucket + path), not local filesystem paths.
- `ExamAttempt.answers` uses PostgreSQL `Json`.

### Local PostgreSQL

```bash
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

Or point `DATABASE_URL` at a Supabase Postgres instance.

---

## Storage abstraction

```
src/lib/storage/
  types.ts      # StorageProvider interface, buckets, buildStorageKey()
  supabase.ts   # Production Supabase Storage
  local.ts      # Dev fallback when Supabase env is unset
  index.ts      # getStorageProvider()
```

**Buckets:** `notes` · `payments` · `gallery` · `documents` (receipts, admit cards, certificates, marksheets)

**Key format:** `{instituteId}/{category}/{filename}`

Set in Supabase dashboard or CLI before uploading in production.

---

## Auth structure

```
src/lib/auth/
  session.ts       # JWT cookie create/read/destroy
  credentials.ts   # login, register, logout, hashPassword
  guards.ts        # requireAdminSession, requireStudentSession, requireApprovedStudent
  index.ts         # public exports

src/actions/auth.ts   # Server actions for login/logout/register
src/middleware.ts     # Protect /admin/* and /student/* routes
src/lib/institute.ts  # getDefaultInstitute() — single tenant helper
```

Session payload includes `instituteId` for future tenant isolation.

---

## Folder structure

```
prisma/
  schema.prisma
  seed.ts              # default Institute + admin user

src/app/
  layout.tsx           # Root fonts
  (site)/              # Public website + SiteLayout
  admin/
    login/
    (panel)/           # Admin shell (sidebar grows with modules)
  student/
    (panel)/           # Student shell

src/actions/
  auth.ts
  admin/               # (reserved)
  student/             # (reserved)
  public/              # (reserved)

src/components/
  site/ ui/ panels/ forms/   # Existing design system + panel chrome

src/lib/
  db.ts
  institute.ts
  auth/
  storage/
  validations/
```

---

## Build order (internal — not shown in UI)

1. **Foundation** ← current
   - PostgreSQL schema + seed
   - Auth + role guards + middleware
   - Storage abstraction
   - Admin/student panel shells (dashboard only)

2. Student registration + admin approval workflow

3. Courses, enquiries, gallery (public + admin)

4. Fees and payment verification

5. MCQ exams (mock + final)

6. PDF documents (receipt, admit card, certificate, marksheet)

---

## Environment variables

Copy `.env.example` → `.env`.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Min 32 chars |
| `DEFAULT_INSTITUTE_SLUG` | Seeded institute slug (`royal-ci`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Production storage |
| `STORAGE_PROVIDER` | `auto` \| `supabase` \| (local fallback in dev) |

---

## Default admin (after seed)

- URL: `/admin/login`
- Email: `admin@royalci.local`
- Password: `admin123` (change in production)

---

## Commands

```bash
npm install
docker compose up -d          # local Postgres
npx prisma migrate dev
npx prisma db seed
npm run dev
```
