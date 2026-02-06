import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Models
import HoldingsModel from "./model/HoldingsModel.js";
import PositionsModel from "./model/PositionsModel.js";
import OrdersModel from "./model/OrdersModel.js";

// Routes
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// GET HOLDINGS
app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

// GET POSITIONS
app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// NEW ORDER
app.post("/newOrder", async (req, res) => {
  const newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();
  res.json({ message: "Order saved!" });
});

// DB + SERVER
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
