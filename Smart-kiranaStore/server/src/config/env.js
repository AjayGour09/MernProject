import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",

  // ✅ NEW
  JWT_SECRET: process.env.JWT_SECRET || "smart_kirana_secret_key_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};