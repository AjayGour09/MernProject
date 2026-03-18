import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    details: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);