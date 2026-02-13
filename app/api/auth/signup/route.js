import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, username, email, password, code, referredBy } = await req.json(); 
    await connectDB();

    // 1. Verify OTP
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return NextResponse.json({ message: "Code expired or request new one" }, { status: 400 });
    }
    if (otpRecord.code !== code) {
      return NextResponse.json({ message: "Invalid Verification Code!" }, { status: 400 });
    }

    // 2. Check Existing User
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return NextResponse.json({ message: "User or Email already exists" }, { status: 400 });
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      balance: 0,
      referrals: 0,
      referralCode: username, // Apna username hi ref code hai
      referredBy: referredBy || null, // Kis ne invite kiya
      directTeam: [],
      teamCount: 0
    });

    // 4. --- REFERRAL SYSTEM LOGIC ---
    if (referredBy) {
        // Level 1: Find Upline (Direct Sponsor)
        const upline = await User.findOne({ username: referredBy });
        
        if (upline) {
            // Add to Upline's Direct Team List
            upline.directTeam.push({
                userId: newUser._id,
                username: newUser.username,
                activationStatus: false, // Abhi inactive hai
                joinedAt: new Date()
            });
            // Increase Total Team Count
            upline.teamCount = (upline.teamCount || 0) + 1;
            await upline.save();

            // Level 2: Find Super Upline (Indirect)
            if (upline.referredBy) {
                const superUpline = await User.findOne({ username: upline.referredBy });
                if (superUpline) {
                    // Sirf count badha do (List mein nahi daalna indirect ko)
                    superUpline.teamCount = (superUpline.teamCount || 0) + 1;
                    await superUpline.save();
                }
            }
        }
    }

    // 5. Delete OTP
    await Otp.deleteOne({ email });

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
