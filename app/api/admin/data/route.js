import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlanRequest from "@/models/PlanRequest";
import Withdraw from "@/models/Withdraw";

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch All Users
    const users = await User.find().sort({ createdAt: -1 });

    // 2. Fetch Pending Plan Requests
    const planRequests = await PlanRequest.find({ status: "pending" });

    // 3. Fetch Pending Withdraw Requests
    const withdrawRequests = await Withdraw.find({ status: "pending" });

    // 4. CALCULATIONS (Stats)
    const totalUsers = users.length;
    
    // Total Investment (Sum of approved plans prices)
    const approvedPlans = await PlanRequest.find({ status: "approved" });
    const totalInvestment = approvedPlans.reduce((acc, curr) => acc + curr.price, 0);

    // Total Withdrawals Given
    const approvedWithdrawals = await Withdraw.find({ status: "approved" });
    const totalWithdrawn = approvedWithdrawals.reduce((acc, curr) => acc + curr.amount, 0);

    // Total User Balance Liability
    const totalUserBalance = users.reduce((acc, curr) => acc + curr.balance, 0);

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
