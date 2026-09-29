import User from "../models/User.js";

export function isValidId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export function getAllUsers() {
  return User.find().sort({ createdAt: 1 });
}

export function getUserById(id) {
  return User.findById(id);
}

export function createUser({ name, email }) {
  return User.create({ name, email });
}

export function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { returnDocument: "after", runValidators: true });
}

export function deleteUser(id) {
  return User.findByIdAndDelete(id);
}
