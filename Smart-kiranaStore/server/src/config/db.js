import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  if (!ENV.MONGO_URI) throw new Error("MONGO_URI missing in .env");

  mongoose.set("strictQuery", true);
  await mongoose.connect(ENV.MONGO_URI);

  console.log("✅ MongoDB connected");
}