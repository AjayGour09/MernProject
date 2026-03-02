import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    unit: { type: String, default: "pcs", trim: true },
    qty: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },

    // ✅ New (optional) - simple friendly fields
    category: { type: String, default: "", trim: true },
    barcode: { type: String, default: "", trim: true }, // barcode/sku (future ready)
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);