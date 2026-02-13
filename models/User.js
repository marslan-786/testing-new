import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // --- 1. PERSONAL INFO (Profile) ---
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" }, // Avatar URL

    // --- 2. WALLET & EARNINGS ---
    balance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }, // Life time earning
    totalWithdraw: { type: Number, default: 0 }, // Jitna nikal chuka hai

    // --- 3. PLAN DETAILS (Active Plan) ---
    plan: {
      isActive: { type: Boolean, default: false },
      planName: { type: String, default: "None" }, // Starter, Pro, VIP
      planPrice: { type: Number, default: 0 },
      activationDate: { type: Date },
      expiryDate: { type: Date }, // Agar lifetime hai to null
    },

    // --- 4. REFERRAL SYSTEM ---
    referralCode: { type: String, unique: true }, // Uska apna code (username hi hoga)
    referredBy: { type: String, default: null }, // Kis ne invite kiya (Upline)
    
    // Direct Team (Level 1)
    directTeam: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: { type: String },
        activationStatus: { type: Boolean, default: false },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    
    // Indirect Team (Level 2) - Optional/Auto-calculated
    teamCount: { type: Number, default: 0 }, // Total team size

    // --- 5. HISTORY LOGS (Sub-Folders) ---
    earningHistory: [
      {
        source: { type: String }, // 'Direct Bonus', 'Ad Watch', 'Indirect'
        amount: { type: Number },
        fromUser: { type: String }, // Kis user se commission aya
        date: { type: Date, default: Date.now }
      }
    ],
    
    withdrawHistory: [
      {
        method: { type: String }, // Easypaisa, Jazzcash
        amount: { type: Number },
        accountNumber: { type: String },
        status: { type: String, default: "pending" }, // pending, approved, rejected
        requestDate: { type: Date, default: Date.now },
        adminMessage: { type: String }
      }
    ]
  },
  { timestamps: true } // CreatedAt, UpdatedAt auto ayega
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
