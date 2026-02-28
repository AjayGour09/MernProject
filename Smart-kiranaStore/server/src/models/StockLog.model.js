import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    change: { type: Number, required: true }, // +10, -2 etc
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("StockLog", stockLogSchema);