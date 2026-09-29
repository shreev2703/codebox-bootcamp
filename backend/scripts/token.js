import "dotenv/config";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in .env");
  process.exit(1);
}

const token = jwt.sign({ sub: 1 }, process.env.JWT_SECRET, {
  algorithm: "HS256",
  expiresIn: "15m",
});

console.log(token);
