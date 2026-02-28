import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    balance: { type: Number, default: 0 }, // total baki
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);