import express from "express";

const app = express();
const PORT = 3000;

const users = [
  { id: 1, name: "Alex" },
  { id: 2, name: "Sam" },
];

app.get("/", (req, res) => {
  res.send("Hello from CodeBox!");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
