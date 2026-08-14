# HabitLoop

A full-stack MERN habit tracker with JWT auth, per-user private habit lists, and an AI habit coach powered by Gemini.

**Live app:** _add your Netlify URL here after deploying_
**Live API:** _add your Render URL here after deploying_

<!-- Add 2-3 screenshots here once deployed, e.g.:
![Dashboard](./docs/screenshot-dashboard.png)
![AI Coach](./docs/screenshot-coach.png)
![Login](./docs/screenshot-login.png)
-->

## Feature checklist

- [x] React + Vite + Tailwind frontend
- [x] HabitCard / HabitList / AddHabitForm / MiniCalendar
- [x] Express REST API (GET/POST/DELETE habits, complete, history)
- [x] Duplicate-completion rejection (409)
- [x] MongoDB/Mongoose persistence
- [x] JWT auth (register/login), bcrypt password hashing
- [x] Habits scoped per user; protected routes (frontend + backend)
- [x] Logout clears token; username shown in navbar
- [x] Timezone-safe date handling (see below)
- [x] GitHub Actions CI on push to `main`
- [x] Gemini-powered "Get AI Coaching" button with loading/error states

## Project structure

```
MERN/
  backend/     Express API, MongoDB models, JWT auth, Gemini integration
  frontend/    React + Vite + Tailwind app
  .github/workflows/ci.yml
```

## Local setup

```bash
# backend
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev

# frontend (separate terminal)
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. In Render, **New +** → **Web Service** → connect the repo.
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - (Or use the included `backend/render.yaml` as a Blueprint.)
3. In the Render dashboard, add these **environment variables**:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `CORS_ORIGIN` | your Netlify URL (add after step below) |
   | `GEMINI_API_KEY` | from https://aistudio.google.com/apikey |

4. Deploy. Note the resulting URL, e.g. `https://habit-tracker-backend.onrender.com`.

### Frontend → Netlify

1. In Netlify, **Add new site** → **Import an existing project** → connect the repo.
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - (`netlify.toml` in `frontend/` already encodes this, plus the SPA redirect React Router needs.)
2. In Site settings → Environment variables, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-render-url>/api` |

3. Deploy. Note the resulting URL, e.g. `https://habitloop.netlify.app`.
4. Go back to Render and set `CORS_ORIGIN` to that Netlify URL, then redeploy the backend so it accepts requests from it.

### GitHub Actions CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: it builds the frontend (`npm run lint && npm run build`) and syntax-checks the backend. Render/Netlify auto-deploy from `main` independently of this — CI's job is just to catch broken builds before they land.

> Note: `npm ci` (used in CI) requires a committed `package-lock.json`. Run `npm install` locally in both `backend/` and `frontend/` at least once and commit the resulting lock files before your first push.

### Tag the release

Once deployed and verified:

```bash
git tag -a v1.0 -m "HabitLoop v1.0 — live with CI pipeline"
git push origin v1.0
```

## Timezone fix (Week 6, item 5)

Habit completions are calendar-day concepts, not precise timestamps. Earlier versions computed "today" using the server's UTC clock, which could log or evaluate a completion on the wrong day for users outside UTC (Render's default server timezone). The fix:

- The **frontend** determines "today" from the browser's local time and sends it explicitly as `localDate` (`YYYY-MM-DD`) when completing a habit.
- The **backend** stores that date anchored to UTC midnight of the given string, so reading it back with `.toISOString()` always returns the exact same date, regardless of server timezone.
- Streak and calendar-strip calculations on both ends use this same convention, so they always agree.

To manually verify: change your system clock/timezone to something far from UTC (e.g. UTC-11 or UTC+13), complete a habit late at night, and confirm the streak and mini-calendar still show it on the correct day, and that a second completion attempt the same day is rejected with 409.

## AI Habit Coach (Week 7)

`POST /api/ai/coach` (auth required) gathers the logged-in user's habit names, frequencies, and current streaks, sends them to Gemini with a habit-coach prompt, and returns motivational tips. The "Get AI Coaching" button on the dashboard shows a loading skeleton while waiting and an inline error message if the request fails (e.g. missing `GEMINI_API_KEY`, rate limit, or network issue).
