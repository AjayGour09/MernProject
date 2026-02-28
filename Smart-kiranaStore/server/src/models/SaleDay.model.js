import mongoose from "mongoose";

const saleDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // "YYYY-MM-DD"
    cash: { type: Number, default: 0, min: 0 },
    upi: { type: Number, default: 0, min: 0 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SaleDay", saleDaySchema);