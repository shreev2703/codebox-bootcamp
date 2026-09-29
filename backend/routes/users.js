import { Router } from "express";
import {
  isValidId,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";

const router = Router();

router.param("id", (req, res, next, id) => {
  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  next();
});

router.get("/", async (req, res) => {
  res.json(await getAllUsers());
});

router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.post("/", async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const user = await createUser({ name, email });
  res.status(201).json(user);
});

router.put("/:id", async (req, res) => {
  const { name, email } = req.body || {};
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Provide name or email to update" });
  }
  const user = await updateUser(req.params.id, updates);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  const user = await deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "User deleted" });
});

export default router;
