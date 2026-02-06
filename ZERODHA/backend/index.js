import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// MODELS (default export hona chahiye)
import HoldingsModel from "./model/HoldingsModel.js";
import PositionsModel from "./model/PositionsModel.js";
import OrdersModel from "./model/OrdersModel.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// AUTH
app.use("/api/auth", authRoutes);

// -------------------- API ROUTES -------------------- //

// GET HOLDINGS
app.get("/allHoldings", async (req, res) => {
  try {
    const data = await HoldingsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET POSITIONS
app.get("/allPositions", async (req, res) => {
  try {
    const data = await PositionsModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS (⚠️ ye missing tha isliye orders show nahi ho rahe the)
app.get("/allOrders", async (req, res) => {
  const orders = await OrdersModel.find({});
  res.json(orders);
});


// NEW ORDER
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: Number(req.body.qty),
      price: Number(req.body.price),
      mode: req.body.mode,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- DB + SERVER -------------------- //

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Error:", err));
