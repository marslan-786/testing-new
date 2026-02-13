import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. Generate 6 Digit Code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Nodemailer Transporter (Gmail App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Railway Variables mein dena hai
        pass: process.env.GMAIL_APP_PASSWORD, // Railway Variables mein dena hai
      },
    });

    // 3. Email Template
    const mailOptions = {
      from: '"StoreX Security" <no-reply@storex.com>',
      to: email,
      subject: "Your Verification Code - StoreX",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1;">StoreX Verification</h2>
            <p>Use the code below to verify your account:</p>
            <h1 style="background-color: #eee; padding: 10px; letter-spacing: 5px; border-radius: 5px;">${code}</h1>
            <p style="color: red; font-size: 12px;">This code expires in 5 minutes.</p>
          </div>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    // *NOTE: Yahan hum code ko DB mein save bhi karenge aglay step mein, abhi sirf send kar rahe hain*
    
    return NextResponse.json({ message: "Code Sent Successfully", code: code }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
