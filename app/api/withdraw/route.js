import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdraw from "@/models/Withdraw";
import User from "@/models/User";

// 1. Submit Withdraw Request (POST)
export async function POST(req) {
  try {
    const { userId, method, accountTitle, accountNumber, amount } = await req.json();
    await connectDB();

    // Check Balance
    const user = await User.findOne({ email: userId });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.balance < amount) {
      return NextResponse.json({ message: "Insufficient Balance!" }, { status: 400 });
    }

    // Create Request
    const newWithdraw = await Withdraw.create({
      userId,
      method,
      accountTitle,
      accountNumber,
      amount
    });

    // Option: Hum balance abhi katlein ya approval ke baad?
    // Behtar hai abhi temporary hold pe rakhein, lekin simple system mein hum approval par katenge.
    // Filhal balance nahi kaat rahay, Admin panel se kaatenge jab approve hoga.

    return NextResponse.json({ message: "Withdrawal Requested Successfully!", data: newWithdraw }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Failed to submit request" }, { status: 500 });
  }
}

// 2. Get Withdraw History (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ message: "User ID missing" }, { status: 400 });

    await connectDB();
    const history = await Withdraw.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ history }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching history" }, { status: 500 });
  }
}
