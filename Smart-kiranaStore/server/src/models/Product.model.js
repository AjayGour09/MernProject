import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    unit: { type: String, default: "pcs" }, // pcs/kg/ltr etc
    qty: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 }, // per product threshold
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);