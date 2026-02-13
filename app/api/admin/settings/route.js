import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(req) {
  try {
    const { newUsername, newPassword } = await req.json();
    await connectDB();

    // Find the only admin (assuming 1 admin for now)
    const admin = await Admin.findOne();
    
    if (admin) {
        admin.username = newUsername;
        admin.password = newPassword;
        await admin.save();
        return NextResponse.json({ success: true, message: "Credentials Updated!" });
    } else {
        // Create if not exists
        await Admin.create({ username: newUsername, password: newPassword });
        return NextResponse.json({ success: true, message: "Admin Created!" });
    }

  } catch (error) {
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}
