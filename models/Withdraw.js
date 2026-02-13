import mongoose from "mongoose";

const WithdrawSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User Email
    method: { type: String, required: true }, // Easypaisa, Jazzcash etc
    accountTitle: { type: String, required: true },
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    adminMessage: { type: String, default: "" } // Agar reject ho to wajah
  },
  { timestamps: true }
);

export default mongoose.models.Withdraw || mongoose.model("Withdraw", WithdrawSchema);
