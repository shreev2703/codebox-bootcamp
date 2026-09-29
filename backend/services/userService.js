const users = [
  { id: 1, name: "Alex" },
  { id: 2, name: "Sam" },
];

export function getAllUsers() {
  return users;
}

export function getUserById(id) {
  return users.find((u) => u.id === id);
}
