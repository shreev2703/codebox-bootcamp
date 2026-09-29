import mongoose from "mongoose";

export async function connectDB(url) {
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to backend/.env");
  }
  await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected to MongoDB");
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
