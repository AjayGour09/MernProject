import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    unit: { type: String, default: "pcs", trim: true },
    qty: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },

    category: { type: String, default: "", trim: true },
    barcode: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

productSchema.index({ shopId: 1, name: 1 });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);