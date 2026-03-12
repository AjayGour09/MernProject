import mongoose from "mongoose";

const saleDaySchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },
    cash: {
      type: Number,
      default: 0,
      min: 0,
    },
    upi: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

saleDaySchema.index({ shopId: 1, date: 1 }, { unique: true });

export default mongoose.models.SaleDay ||
  mongoose.model("SaleDay", saleDaySchema);