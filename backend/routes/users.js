import { Router } from "express";
import { getAllUsers, getUserById } from "../services/userService.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getAllUsers());
});

router.get("/:id", (req, res) => {
  const user = getUserById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

export default router;
