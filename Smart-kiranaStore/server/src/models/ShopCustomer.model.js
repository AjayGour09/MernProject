import mongoose from "mongoose";

const shopCustomerSchema = new mongoose.Schema(
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
    balance: {
      type: Number,
      default: 0, // +ve = baki, -ve = advance
    },
  },
  { timestamps: true }
);

shopCustomerSchema.index({ shopId: 1, customerId: 1 }, { unique: true });

export default mongoose.models.ShopCustomer ||
  mongoose.model("ShopCustomer", shopCustomerSchema);