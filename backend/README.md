# Habit Tracker — Backend

Express + MongoDB (Mongoose) REST API.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your MongoDB Atlas connection string into MONGODB_URI,
# and set JWT_SECRET to any long random string
npm run dev
```

Server runs at `http://localhost:5000`.

## Endpoints

| Method | Route                       | Auth required | Description                                  |
|--------|------------------------------|:---:|-----------------------------------------------|
| POST   | /api/auth/register           | –  | Create an account `{ username, email, password }` |
| POST   | /api/auth/login               | –  | Log in `{ email, password }` → `{ token, user }` |
| GET    | /api/habits                  | ✅ | List the logged-in user's habits              |
| POST   | /api/habits                  | ✅ | Create a habit `{ name, frequency }`          |
| POST   | /api/habits/:id/complete     | ✅ | Log today's date as completed (409 if duplicate) |
| DELETE | /api/habits/:id              | ✅ | Delete a habit                                |
| GET    | /api/habits/:id/history      | ✅ | Return the habit's completions array          |
| POST   | /api/ai/coach                | ✅ | Get Gemini-generated motivational tips based on your habits/streaks |

Protected routes require an `Authorization: Bearer <token>` header. Habits are scoped to the authenticated user — you'll only ever see and modify your own.

## Testing in Postman

Import `HabitTracker.postman_collection.json` (in this folder) into Postman. It includes requests for every route, plus a "Complete habit again" request that demonstrates the 409 duplicate-completion rejection. Set the `baseUrl` and `habitId` collection variables as you go (`habitId` comes from the response of "Create habit").

## MongoDB Atlas quick setup

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Add a database user and allow your IP (or `0.0.0.0/0` for local dev)
3. Copy the connection string, replace `<username>`/`<password>`, and paste it into `.env` as `MONGODB_URI`
