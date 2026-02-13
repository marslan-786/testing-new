import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, username, email, password, code } = await req.json(); // Code bhi receive karein
    await connectDB();

    // 1. Verify OTP First (Sabse Important)
    const otpRecord = await Otp.findOne({ email });
    
    if (!otpRecord) {
      return NextResponse.json({ message: "Code expired or request new one" }, { status: 400 });
    }

    if (otpRecord.code !== code) {
      return NextResponse.json({ message: "Invalid Verification Code!" }, { status: 400 });
    }

    // 2. Check Existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      balance: 0,
      referrals: 0
    });

    // 4. Delete OTP after usage (Cleanup)
    await Otp.deleteOne({ email });

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
