import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    qty: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["UDAAR", "PAYMENT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [itemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

transactionSchema.index({ shopId: 1, customerId: 1, createdAt: -1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);