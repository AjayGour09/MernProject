import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./src/config/env.js";
import routes from "./src/routers/routes.js";
import { notFound, errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

// ✅ IMPORTANT: credentials true + exact origin
app.use(
  cors({
    origin: ENV.CLIENT_ORIGIN, // http://localhost:5173
    credentials: true,
  })
);

app.use(morgan("dev"));

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "kirana-smart" })
);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;