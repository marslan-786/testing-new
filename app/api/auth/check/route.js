import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { field, value } = await req.json();
    await connectDB();

    // Check agar field 'email' hai ya 'username'
    const query = {};
    query[field] = value;

    const user = await User.findOne(query);

    if (user) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error checking" }, { status: 500 });
  }
}
