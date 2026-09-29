import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import { requireAuth } from "./middleware/auth.js";
import { connectDB, isConnected } from "./db/database.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to backend/.env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from CodeBox!");
});

app.get("/api/health", (req, res) => {
  if (!isConnected()) {
    return res.status(503).json({ status: "error", db: "disconnected" });
  }
  res.json({ status: "ok", db: "connected" });
});

app.use("/api/users", usersRouter);

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ id: req.user.sub, name: "Alex", role: "student" });
});

// Express 5 forwards rejected promises from async handlers here.
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Email already in use" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

try {
  await connectDB(process.env.DATABASE_URL);
} catch (err) {
  console.error(`Could not connect to MongoDB: ${err.message}`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
