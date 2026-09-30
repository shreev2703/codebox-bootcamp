import mongoose from "mongoose";

let connection = null;

// Reuses one connection, including across warm serverless invocations on Vercel.
export function connectDB(url) {
  if (!url) {
    return Promise.reject(new Error("DATABASE_URL is not set. Add it to backend/.env"));
  }
  if (!connection) {
    connection = mongoose
      .connect(url, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => {
        connection = null;
        throw err;
      });
  }
  return connection;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
