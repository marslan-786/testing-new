import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlanRequest from "@/models/PlanRequest";
import Withdraw from "@/models/Withdraw";

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch Lists (Sorted by Newest)
    const users = await User.find().sort({ createdAt: -1 });
    const planRequests = await PlanRequest.find({ status: "pending" }).sort({ createdAt: -1 });
    const withdrawRequests = await Withdraw.find({ status: "pending" }).sort({ createdAt: -1 });

    // 2. CALCULATIONS (Stats Tab ke liye)
    
    // Total Users
    const totalUsers = users.length;
    
    // Total Investment (Jinke plan approve ho chuke hain unki prices jama karein)
    const approvedPlans = await PlanRequest.find({ status: "approved" });
    const totalInvestment = approvedPlans.reduce((acc, curr) => acc + curr.price, 0);

    // Total Withdrawn (Jo withdraw approve ho chuke hain)
    const approvedWithdrawals = await Withdraw.find({ status: "approved" });
    const totalWithdrawn = approvedWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);

    // Total User Balance Liability (Sab users ke current balance ka sum)
    const totalUserBalance = users.reduce((acc, curr) => acc + (curr.balance || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        users,
        planRequests,
        withdrawRequests,
        stats: {
          totalUsers,
          totalInvestment,
          totalWithdrawn,
          totalUserBalance
        }
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching admin data" }, { status: 500 });
  }
}
