import mongoose from "mongoose";

const PlanRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User ki Email ya ID
    username: { type: String, required: true },
    planId: { type: String, required: true }, // starter, pro, vip
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    trxId: { type: String, required: true }, // Transaction ID
    screenshot: { type: String }, // Image URL (abhi ke liye string)
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    adminMessage: { type: String, default: "" }, // Agar reject hua to wajah
  },
  { timestamps: true }
);

export default mongoose.models.PlanRequest || mongoose.model("PlanRequest", PlanRequestSchema);
