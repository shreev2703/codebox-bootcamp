# CodeBox Bootcamp

Small Express + MongoDB API built during the CodeBox bootcamp (Day 1, Day 2, and the take-home), with a plain HTML frontend.

## Structure

```
backend/
  server.js               app setup, middleware, startup
  routes/users.js         users CRUD routes
  services/userService.js database logic
  models/User.js          mongoose model
  db/database.js          MongoDB connection
  middleware/auth.js      JWT check for protected routes
  scripts/token.js        signs a test token
  .env.example
frontend/
  index.html
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

To get a token for `/api/me`:

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
| POST | `/api/users` | 201 | 400 missing fields, 409 duplicate email |
| PUT | `/api/users/:id` | 200 | 400, 404 |
| DELETE | `/api/users/:id` | 200 | 400 bad id, 404 |
| GET | `/api/me` | 200 | 401 missing/invalid/expired token |

## curl cheat sheet

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/users
curl -i http://localhost:3000/api/users/<id>

curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com"}'

curl -i -X PUT http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Smith"}'

curl -i -X DELETE http://localhost:3000/api/users/<id>

TOKEN=$(npm run -s token)
curl -i http://localhost:3000/api/me -H "Authorization: Bearer $TOKEN"
```

Unexpected errors return 500 with `{ "error": "Something went wrong" }`.
