# EcoWaste — Smart Waste Management

Next.js (App Router) full-stack app for citizens to report waste issues, request pickups and track complaints, with an admin dashboard for municipal teams.

- **Frontend + backend:** Next.js 16 (pages in `src/app`, REST API in `src/app/api`)
- **Database:** MongoDB via Mongoose (`src/models`)
- **Auth:** passwords hashed with **bcrypt**; login issues a signed **JWT** stored in an httpOnly cookie
- **Image uploads:** stored in MongoDB (`images` collection) and served from `/api/uploads/<file>`, so they work on Vercel
- **Config:** `MONGODB_URI` / `JWT_SECRET` come from env vars when set, otherwise from the hardcoded fallbacks in `src/lib/config.js`

## Setup

1. Install and start MongoDB (local [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free MongoDB Atlas cluster).
2. Configure environment:
   ```bash
   cp .env.example .env.local   # then edit MONGODB_URI / JWT_SECRET if needed
   ```
3. Install, seed and run:
   ```bash
   npm install
   npm run seed     # WARNING: clears and re-creates the demo data
   npm run dev      # http://localhost:3000
   ```

## Demo accounts (created by `npm run seed`)

| Role    | Email                 | Password   |
|---------|-----------------------|------------|
| Admin   | admin@ecowaste.app    | admin123   |
| Admin   | ops@ecowaste.app      | ops12345   |
| Citizen | citizen@ecowaste.app  | citizen123 |
| Citizen | priya@ecowaste.app    | priya123   |
| Citizen | rahul@ecowaste.app    | rahul123   |
| Citizen | neha@ecowaste.app     | neha123    |
| Citizen | vikram@ecowaste.app   | vikram123  |

On the login page pick the matching **Citizen / Admin** toggle. New users can also register (always as citizens).

## Project structure

```
scripts/seed.mjs          demo data + dummy users (bcrypt-hashed)
src/app/                  pages: / , /login , /app/* (citizen), /admin/*
src/app/api/              auth, complaints, pickups, centers, users, notifications, analytics, uploads
src/lib/                  db connection, JWT auth helpers, upload helper, constants
src/models/               Mongoose schemas
src/context/AppContext.jsx client-side data store that talks to the API
```

## API overview

| Method | Route | Who |
|--------|-------|-----|
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | public |
| GET/PATCH | `/api/auth/me` | logged in |
| GET/POST | `/api/complaints` (POST is multipart with optional `photo`) | citizen sees own, admin sees all |
| PATCH | `/api/complaints/:id` | admin |
| GET/POST | `/api/pickups` · PATCH `/api/pickups/:id` | citizen / admin |
| GET/POST | `/api/centers` · PATCH/DELETE `/api/centers/:id` | read: all · write: admin |
| GET | `/api/users`, `/api/analytics` | admin |
| GET/PATCH | `/api/notifications` | logged in |
| GET | `/api/uploads/:file` | public |
