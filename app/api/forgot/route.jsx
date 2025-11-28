import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '../../../libs/prisma'; // ✅ named import
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Delete old tokens
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    const appUrl = "http://localhost:3001/pages/";
    const resetLink = `${appUrl}/resetpassword?token=${token}`;

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Password Reset Request',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333333;">CorporateSellers Password Reset</h2>
        <p style="color: #555555;">
          Hello, we received a request to reset your password for your CorporateSellers account. 
          Please click the link below to set a new password. This link will expire in 1 hour.
        </p>
        <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <p style="color: #555555; margin-top: 10px;">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    </div>
  `,
});


    return NextResponse.json({ message: 'Password reset link sent successfully.' });

  } catch (error) {
    console.error('Error in password reset API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
