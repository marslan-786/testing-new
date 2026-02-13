import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectDB();

    // 1. Check if ANY admin exists, if not create default
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ username: "admin", password: "admin" });
      console.log("Default Admin Created");
    }

    // 2. Verify Credentials
    const admin = await Admin.findOne({ username, password });
    
    if (!admin) {
      return NextResponse.json({ message: "Invalid Admin Credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Welcome Boss!", success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
