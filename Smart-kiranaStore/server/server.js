import app from "./app.js";
import { ENV } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";

async function start() {
  await connectDB();
  app.listen(ENV.PORT, () => console.log(`🚀 Server running on ${ENV.PORT}`));
}

start().catch((e) => {
  console.error("❌ Failed to start:", e.message);
  process.exit(1);
});