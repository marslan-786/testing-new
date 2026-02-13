import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlanRequest from "@/models/PlanRequest";
import Withdraw from "@/models/Withdraw";

export async function POST(req) {
  try {
    const { type, id, action, reason } = await req.json();
    await connectDB();

    // ==========================================
    // 1. HANDLE PLAN APPROVAL / REJECTION
    // ==========================================
    if (type === "plan") {
      const request = await PlanRequest.findById(id);
      if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

      // Find the User who requested the plan
      const user = await User.findOne({ email: request.userId });
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

      if (action === "approve") {
        // --- A. ACTIVATE PLAN ---
        request.status = "approved";
        await request.save();

        user.plan = {
          isActive: true,
          planName: request.planName,
          planPrice: request.price,
          activationDate: new Date()
        };

        // --- B. GIVE SELF REWARD (Cashback) ---
        // 500 -> 50, 1000 -> 100, 2000 -> 200
        let selfReward = 0;
        if (request.price === 500) selfReward = 50;
        else if (request.price === 1000) selfReward = 100;
        else if (request.price === 2000) selfReward = 200;

        if (selfReward > 0) {
            user.balance += selfReward;
            user.totalEarnings += selfReward;
            user.earningHistory.push({
                source: "Plan Cashback",
                amount: selfReward,
                fromUser: "System",
                date: new Date()
            });
        }

        // --- C. HANDLE UPLINE (Referrer) ---
        if (user.referredBy) {
            const upline = await User.findOne({ username: user.referredBy });
            
            if (upline) {
                // 1. Update Status in Direct Team List (Mark as Active)
                // Hum directTeam array mein dhoond kar update karenge
                const memberIndex = upline.directTeam.findIndex(m => m.username === user.username);
                if (memberIndex !== -1) {
                    upline.directTeam[memberIndex].activationStatus = true;
                }

                // 2. Give Direct Commission
                // 500 -> 150, 1000 -> 300, 2000 -> 500
                let commission = 0;
                if (request.price === 500) commission = 150;
                else if (request.price === 1000) commission = 300;
                else if (request.price === 2000) commission = 500;

                if (commission > 0) {
                    upline.balance += commission;
                    upline.totalEarnings += commission;
                    upline.earningHistory.push({
                        source: "Direct Referral Bonus",
                        amount: commission,
                        fromUser: user.username,
                        date: new Date()
                    });
                }

                // 3. Give Indirect Commission (Level 2) - Optional/Extra
                // Agar Upline ka bhi koi Upline hai (Super Upline)
                if (upline.referredBy) {
                    const superUpline = await User.findOne({ username: upline.referredBy });
                    if (superUpline) {
                        let indirectComm = 0;
                        if (request.price === 500) indirectComm = 50;
                        else if (request.price === 1000) indirectComm = 100;
                        else if (request.price === 2000) indirectComm = 150;

                        if (indirectComm > 0) {
                            superUpline.balance += indirectComm;
                            superUpline.totalEarnings += indirectComm;
                            superUpline.earningHistory.push({
                                source: "Indirect Bonus",
                                amount: indirectComm,
                                fromUser: user.username,
                                date: new Date()
                            });
                            await superUpline.save();
                        }
                    }
                }

                await upline.save(); // Save Upline Changes
            }
        }

        await user.save(); // Save User Changes

      } else {
        // --- REJECT CASE ---
        request.status = "rejected";
        request.adminMessage = reason;
        await request.save();
      }
    }

    // ==========================================
    // 2. HANDLE WITHDRAW REQUESTS
    // ==========================================
    else if (type === "withdraw") {
      const request = await Withdraw.findById(id);
      if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

      const user = await User.findOne({ email: request.userId });

      if (action === "approve") {
        request.status = "approved";
        await request.save();
        
        // Deduct Balance
        if (user) {
          user.balance -= request.amount;
          user.totalWithdraw += request.amount;
          user.withdrawHistory.push({
              method: request.method,
              amount: request.amount,
              accountNumber: request.accountNumber,
              status: "approved",
              requestDate: new Date()
          });
          await user.save();
        }
      } else {
        request.status = "rejected";
        request.adminMessage = reason;
        await request.save();
        // Record rejection in user history too if needed, but separate history is safer
        if (user) {
             user.withdrawHistory.push({
              method: request.method,
              amount: request.amount,
              accountNumber: request.accountNumber,
              status: "rejected",
              adminMessage: reason,
              requestDate: new Date()
          });
          await user.save();
        }
      }
    }

    return NextResponse.json({ success: true, message: "Action Completed" }, { status: 200 });

  } catch (error) {
    console.error("Admin Action Error:", error);
    return NextResponse.json({ message: "Action Failed" }, { status: 500 });
  }
}
