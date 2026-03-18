import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { ENV } from "./src/config/env.js";
import routes from "./src/routers/routes.js";

const app = express();

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests, try later" },
});

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ENV.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/auth", authLimiter);
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "smart-kirana-auth",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: err.errors[0]?.message || "Validation failed",
    });
  }

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

export default app;