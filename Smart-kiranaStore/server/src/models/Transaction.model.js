import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    type: { type: String, enum: ["UDAAR", "PAYMENT"], required: true },
    amount: { type: Number, required: true, min: 1 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);