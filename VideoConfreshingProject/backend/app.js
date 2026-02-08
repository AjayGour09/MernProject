import dotenv from "dotenv";
import express from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { connectToSocket } from "./src/controllers/socketManager.js";

import userRoutes from "./src/routes/userRoutes.js";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json({ linits: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ message: "Hello" });
});

server.listen(port, () => {
  console.log(`Server Started At PORT ${port}`);
  connectDB();
});
