import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

// 1. GET FULL USER DATA (Dashboard, Profile, Wallet sab ke liye)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email }).select("-password"); // Password ke ilawa sab lay ao

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error loading profile" }, { status: 500 });
  }
}

// 2. UPDATE PROFILE (Name, Email, Pic)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { currentEmail, newName, newUsername, newEmail, newProfilePic } = body;

    await connectDB();

    // Find User
    const user = await User.findOne({ email: currentEmail });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Update Fields
    if (newName) user.name = newName;
    if (newProfilePic) user.profilePic = newProfilePic;
    
    // Username check (agar change kar raha hai to duplicate na ho)
    if (newUsername && newUsername !== user.username) {
        const checkUser = await User.findOne({ username: newUsername });
        if (checkUser) return NextResponse.json({ message: "Username already taken" }, { status: 400 });
        user.username = newUsername;
        user.referralCode = newUsername; // Ref code bhi update hoga
    }

    // Email check
    if (newEmail && newEmail !== user.email) {
        const checkEmail = await User.findOne({ email: newEmail });
        if (checkEmail) return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        user.email = newEmail;
    }

    await user.save();

    return NextResponse.json({ success: true, message: "Profile Updated Successfully!", user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
                                        }
