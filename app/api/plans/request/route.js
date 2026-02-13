import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PlanRequest from "@/models/PlanRequest";
import User from "@/models/User"; // User model bhi chahiye taake check kar sakein

// 1. Submit New Request (POST)
export async function POST(req) {
  try {
    const { userId, username, planId, planName, price, trxId, screenshot } = await req.json();
    await connectDB();

    // Check if pending request already exists
    const existingRequest = await PlanRequest.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return NextResponse.json({ message: "You already have a pending request!" }, { status: 400 });
    }

    // Create New Request
    const newRequest = await PlanRequest.create({
      userId,
      username,
      planId,
      planName,
      price,
      trxId,
      screenshot, // Real app mein yahan Cloudinary URL hoga
    });

    return NextResponse.json({ message: "Request Submitted Successfully!", request: newRequest }, { status: 201 });

  } catch (error) {
    console.error("Plan Request Error:", error);
    return NextResponse.json({ message: "Failed to submit request" }, { status: 500 });
  }
}

// 2. Get User Request Status (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ message: "User ID missing" }, { status: 400 });

    await connectDB();
    
    // Find latest request (chahe pending ho ya rejected/approved)
    const latestRequest = await PlanRequest.findOne({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ request: latestRequest }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching status" }, { status: 500 });
  }
}
