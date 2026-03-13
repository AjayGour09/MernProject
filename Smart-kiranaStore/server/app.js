import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./config/env.js";
import routes from "./routers/routes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: ENV.CLIENT_ORIGIN }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "smart-kirana-auth" });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

export default app;