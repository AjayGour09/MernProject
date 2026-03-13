import mongoose from "mongoose";
import app from "./src/app.js";
import { ENV } from "./src/config/env.js";

async function start() {
  await mongoose.connect(ENV.MONGO_URI);
  console.log("✅ MongoDB connected");

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on ${ENV.PORT}`);
  });
}

start().catch((e) => {
  console.error("❌ Failed to start:", e.message);
  process.exit(1);
});