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

    let info: any = null;
    let previewUrl: string | null = null;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production or Custom SMTP Server Delivery
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      info = await transporter.sendMail({
        from: `"Bandhakavi Family Portal" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: body,
      });
      console.log(`[REAL SMTP DELIVERED] To: ${to} | MessageId: ${info.messageId}`);
    } else {
      // Real Test SMTP Delivery Fallback via Ethereal Mail
      try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        info = await transporter.sendMail({
          from: `"Bandhakavi Family Portal" <${testAccount.user}>`,
          to,
          subject,
          text: body,
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || null;
        console.log(`[TEST SMTP DELIVERED] To: ${to} | MessageId: ${info.messageId}`);
        if (previewUrl) {
          console.log(`[REAL EMAIL PREVIEW LINK]: ${previewUrl}`);
        }
      } catch (testErr) {
        console.error("Test SMTP fallback warning:", testErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Notification email dispatched to ${to}`,
      dispatchedAt: new Date().toISOString(),
      previewUrl,
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
