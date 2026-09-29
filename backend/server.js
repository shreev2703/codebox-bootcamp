import "dotenv/config";
import express from "express";
import usersRouter from "./routes/users.js";
import { requireAuth } from "./middleware/auth.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to backend/.env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from CodeBox!");
});

app.use("/api/users", usersRouter);

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ id: req.user.sub, name: "Alex", role: "student" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
