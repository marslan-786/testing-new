import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Note: For advanced security, we usually use JWT tokens. 
    // Here we return user data to save in LocalStorage for speed.
    return NextResponse.json({ 
      message: "Login Successful", 
      user: { name: user.name, username: user.username, balance: user.balance, referrals: user.referrals } 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
