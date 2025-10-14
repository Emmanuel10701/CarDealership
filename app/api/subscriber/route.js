import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import nodemailer from 'nodemailer';

// Constants
const DEALER_NAME = 'Maina Cars';
const SUPPORT_PHONE = '+254700000000';

// Email Templates
const emailTemplates = {
  admin: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);margin-top:40px;margin-bottom:40px;">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#000000 0%,#333333 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:white;font-size:26px;font-weight:700;margin:0;">📩 New Subscriber</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:8px 0 0;">${DEALER_NAME} Website</p>
          </div>

          <!-- Content -->
          <div style="padding:40px 30px;text-align:center;">
            <h2 style="color:#1a202c;font-size:22px;font-weight:600;margin:0 0 20px;">New subscriber details</h2>
            <p style="color:#2d3748;font-size:16px;margin:0;">Email: <strong>${email}</strong></p>
            <p style="color:#718096;font-size:14px;margin-top:15px;">Subscribed on ${new Date().toLocaleString()}</p>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:25px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#718096;font-size:14px;margin:0;">This message was sent from your ${DEALER_NAME} subscription form</p>
            <p style="color:#a0aec0;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} ${DEALER_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  user: ({ email }) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);margin-top:40px;margin-bottom:40px;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#000000 0%,#333333 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:white;font-size:28px;font-weight:700;margin:0;">🎉 Welcome to ${DEALER_NAME}</h1>
            <p style="color:rgba(255,255,255,0.8);font-size:16px;margin:8px 0 0;">Subscription Confirmed</p>
          </div>

          <!-- Content -->
          <div style="padding:40px 30px;text-align:center;">
            <p style="color:#1a202c;font-size:18px;line-height:1.6;">Hey there! 👋</p>
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:10px 0 20px;">
              Thank you for subscribing to <strong>${DEALER_NAME}</strong> with <strong>${email}</strong>.<br/>
              You'll now receive updates on the latest car listings and exclusive deals.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;padding:25px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#1a202c;font-size:16px;font-weight:700;margin:0;">${DEALER_NAME}</p>
            <p style="color:#718096;font-size:12px;margin:4px 0 0;">Your Trusted Automotive Partner</p>
            <p style="color:#a0aec0;font-size:12px;margin-top:10px;">© ${new Date().getFullYear()} ${DEALER_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

// Helpers
const validateEnvironment = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER and EMAIL_PASS are not set.');
    return false;
  }
  return true;
};

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Main POST
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Skip format validation intentionally
    if (!validateEnvironment()) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check duplicates
    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (existingSubscriber) {
      return NextResponse.json({ error: 'Subscriber already exists' }, { status: 409 });
    }

    // Save subscriber
    const subscriber = await prisma.subscriber.create({
      data: { email },
      select: { id: true, email: true, createdAt: true },
    });

    // Send emails
    const transporter = createTransporter();
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📩 New Subscriber - ${DEALER_NAME}`,
      html: emailTemplates.admin({ email }),
    };
    const userMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎉 Welcome to ${DEALER_NAME}!`,
      html: emailTemplates.user({ email }),
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Subscriber added successfully and emails sent.',
        subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error adding subscriber:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET subscribers
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true },
    });
    return NextResponse.json({ success: true, subscribers }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
