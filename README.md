# CodeBox Bootcamp

Small Express + MongoDB app built during the CodeBox bootcamp. Users can sign up and log in (JWT), and logged-in users can add, edit, and delete users from a plain HTML frontend.

## Structure

```
backend/
  server.js               app setup, middleware, startup
  routes/users.js         users CRUD routes
  routes/auth.js          register and login
  services/userService.js database logic
  models/User.js          mongoose model
  db/database.js          MongoDB connection
  middleware/auth.js      JWT check for protected routes
  scripts/token.js        signs a test token
  .env.example
frontend/
  index.html
api/index.js              Vercel entry, reuses backend/server.js
vercel.json
```

## Setup

Requires Node 18.11+ and a MongoDB Atlas cluster (or any MongoDB URL).

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

- `PORT` - defaults to 3000
- `JWT_SECRET` - any long random string, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `DATABASE_URL` - your MongoDB connection string, e.g. `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/codebox`

## Run

```bash
npm run dev
```

The server runs on http://localhost:3000. Open `frontend/index.html` in a browser to use the frontend.

Sign up or log in on the page to get a token. For quick curl testing you can also run:

```bash
npm run token
```

This script is only for local testing, not a real login.

## Routes

| Method | Path | Success | Errors |
| --- | --- | --- | --- |
| GET | `/` | 200 | |
| GET | `/api/health` | 200 | 503 if db is down |
| GET | `/api/users` | 200 | |
| GET | `/api/users/:id` | 200 | 400 bad id, 404 |
| POST | `/api/auth/register` | 201 + token | 400 missing fields or short password, 409 duplicate email |
| POST | `/api/auth/login` | 200 + token | 400 missing fields, 401 wrong email or password |
| POST | `/api/users` (auth) | 201 | 400 missing fields, 401, 409 duplicate email |
| PUT | `/api/users/:id` (auth) | 200 | 400, 401, 404 |
| DELETE | `/api/users/:id` (auth) | 200 | 400 bad id, 401, 404 |
| GET | `/api/me` (auth) | 200 | 401 missing/invalid/expired token |

Routes marked (auth) need an `Authorization: Bearer <token>` header. Passwords are hashed with bcrypt and never returned.

## curl cheat sheet

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/users
curl -i http://localhost:3000/api/users/<id>

curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"password123"}'

curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'

TOKEN=<token from register or login>

curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Sam","email":"sam@example.com"}'

curl -i -X PUT http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Sam Lee"}'

curl -i -X DELETE http://localhost:3000/api/users/<id> -H "Authorization: Bearer $TOKEN"

curl -i http://localhost:3000/api/me -H "Authorization: Bearer $TOKEN"
```

Unexpected errors return 500 with `{ "error": "Something went wrong" }`.

## Deploy to Vercel

The repo root deploys as one Vercel project: `frontend/` is served as the static site and `api/index.js` runs the Express app as a serverless function.

1. Import the repo in Vercel (or run `vercel --prod` from the repo root).
2. Add `DATABASE_URL` and `JWT_SECRET` under Project Settings > Environment Variables.
3. In MongoDB Atlas > Network Access, allow `0.0.0.0/0`, since Vercel does not use fixed IPs.
