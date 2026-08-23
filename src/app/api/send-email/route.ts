import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, body, type, userDetails } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, body)" },
        { status: 400 }
      );
    }

    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL BODY]:\n${body}`);

    // If SMTP environment credentials exist, send real email via Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Bandhakavi Family App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: body,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notification email dispatched to ${to}`,
      dispatchedAt: new Date().toISOString(),
      details: { to, subject, type, userDetails }
    });
  } catch (error: any) {
    console.error("Email dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch email", details: error.message },
      { status: 500 }
    );
  }
}
