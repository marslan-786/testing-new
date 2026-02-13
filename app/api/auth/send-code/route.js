import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    // 1. Generate 6 Digit Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save Code to DB (Update if exists)
    await Otp.findOneAndUpdate(
      { email },
      { code },
      { upsert: true, new: true }
    );

    // 3. Send Email logic (Same as before)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"StoreX" <no-reply@storex.com>',
      to: email,
      subject: "Your Verification Code - StoreX",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1;">StoreX Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="background-color: #eee; padding: 10px; letter-spacing: 5px; border-radius: 5px;">${code}</h1>
            <p style="color: red; font-size: 12px;">Valid for 5 minutes only.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Code Sent Successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
              }
