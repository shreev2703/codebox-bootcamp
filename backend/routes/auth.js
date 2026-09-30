import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmailWithPassword } from "../services/userService.js";

const router = Router();

function authResponse(user) {
  const token = jwt.sign(
    { sub: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );
  return { token, user: { id: user._id, name: user.name, email: user.email } };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hash });
  res.status(201).json(authResponse(user));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await getUserByEmailWithPassword(email);
  // Same message for unknown email and wrong password so emails can't be probed.
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json(authResponse(user));
});

export default router;
