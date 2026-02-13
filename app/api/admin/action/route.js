import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlanRequest from "@/models/PlanRequest";
import Withdraw from "@/models/Withdraw";

export async function POST(req) {
  try {
    const { type, id, action, reason, amount, userId } = await req.json();
    await connectDB();

    // --- A. HANDLE PLAN REQUESTS ---
    if (type === "plan") {
      const request = await PlanRequest.findById(id);
      if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

      if (action === "approve") {
        request.status = "approved";
        await request.save();

        // Activate User Plan
        const user = await User.findOne({ email: request.userId }); // userId in PlanRequest is email
        if (user) {
          user.plan = {
            isActive: true,
            planName: request.planName,
            planPrice: request.price,
            activationDate: new Date()
          };
          await user.save();
          // NOTE: Referral Commission Logic yahan lagani hogi baad mein
        }
      } else {
        request.status = "rejected";
        request.adminMessage = reason;
        await request.save();
      }
    }

    // --- B. HANDLE WITHDRAW REQUESTS ---
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
          await user.save();
        }
      } else {
        request.status = "rejected";
        request.adminMessage = reason;
        await request.save();
        // Rejected hai to balance wapis nahi katna (kyunke humne request pe hold nahi lagaya tha)
      }
    }

    // --- C. USER ACTIONS (Suspend) ---
    else if (type === "user") {
        const user = await User.findById(id);
        if(action === "suspend") {
            // Add a suspended flag to User Model later, for now we can just utilize this API
            // user.isSuspended = !user.isSuspended; 
            // await user.save();
            return NextResponse.json({ message: "Suspend feature coming soon (Add field to model)" });
        }
    }

    return NextResponse.json({ success: true, message: "Action Completed" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Action Failed" }, { status: 500 });
  }
}
