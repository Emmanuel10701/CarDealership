// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Constants
const DEALER_NAME = 'CorporateSellers';
const SUPPORT_PHONE = '0791596795'; // The primary support number

// Admin Email Address (where submissions go)
const ADMIN_EMAIL = 'emmanuelmakau90@gmail.com';

// Email Templates
const emailTemplates = {
  admin: ({ name, email, phone, subject, message, contactMethod }) => `
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 5px solid #cc0000;">
        
                <h1 style="color: #cc0000; font-size: 24px; margin-bottom: 5px;">🚨 New Contact Submission (Action Required)</h1>
        <p style="font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">Received via ${DEALER_NAME} Website</p>
        
                <div style="background-color: #e8f0f8; border: 1px solid #cceeff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #0056b3; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Customer & Inquiry Details</h2>
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</li>
            <li style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></li>
            <li style="margin-bottom: 8px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #0056b3; text-decoration: none;">${phone}</a></li>
            <li style="margin-bottom: 8px;"><strong>Subject:</strong> ${subject}</li>
            <li><strong>Preferred Contact:</strong> <span style="text-transform: capitalize; font-weight: bold; color: #cc0000;">${contactMethod}</span></li>
          </ul>
        </div>

        <p style="font-weight: bold; margin: 15px 0 5px;">Customer Message:</p>
        <div style="border: 1px solid #cccccc; padding: 15px; background-color: #fcfcfc; border-radius: 4px; white-space: pre-wrap; font-size: 15px;">
          ${message}
        </div>

                <div style="background-color: #333333; color: white; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
          <h3 style="margin-top: 0; color: white; font-size: 16px; margin-bottom: 10px;">ACTION REQUIRED: Respond to Customer!</h3>
          <p style="font-size: 20px; font-weight: bold; margin: 5px 0; color: #ffc107;">
            Follow up via: ${contactMethod.toUpperCase()}
          </p>
        </div>
        
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 20px;">This email contains sensitive customer information. Handle with care.</p>
      </div>
    </body>
    </html>
  `,

  user: ({ name, email, phone, subject, message, contactMethod }) => `
   <html>
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Message Received - ${DEALER_NAME}</title>
   </head>
   <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f7f7f7;">
     <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 5px solid #10b981;">

              <h1 style="color: #10b981; font-size: 24px; margin-bottom: 5px;">✅ Message Received!</h1>
       <p style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">Hello ${name}, thank you for reaching out to ${DEALER_NAME}.</p>
       <p>We confirm that we have received your message. Our team will review your inquiry and aim to get back to you as soon as possible via your preferred contact method.</p>

              <div style="background-color: #f0fff4; border: 1px solid #d4edda; padding: 20px; border-radius: 8px; margin-top: 25px; margin-bottom: 25px;">
         <h2 style="color: #0c8a66; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Your Inquiry Summary</h2>
         <ul style="list-style-type: none; padding: 0; margin: 0;">
           <li style="margin-bottom: 8px;"><strong>Subject:</strong> ${subject}</li>
           <li><strong>Preferred Contact:</strong> <span style="text-transform: capitalize; font-weight: bold;">${contactMethod}</span></li>
         </ul>
        </div>

       <p style="font-weight: bold; margin-bottom: 5px;">Your Message:</p>
       <div style="border: 1px solid #cccccc; padding: 15px; background-color: #ffffff; border-radius: 4px; white-space: pre-wrap; font-size: 15px;">
         ${message}
       </div>

              <div style="background-color: #333333; color: white; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
         <h3 style="margin-top: 0; color: white; font-size: 16px; margin-bottom: 10px;">Need Immediate Assistance?</h3>
         <p style="font-size: 20px; font-weight: bold; margin: 5px 0;">
           <a href="tel:${SUPPORT_PHONE}" style="color: #ffc107; text-decoration: none;">📞 ${SUPPORT_PHONE}</a>
         </p>
       </div>

              <p style="font-size: 12px; color: #777; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} ${DEALER_NAME}. This is an automated confirmation.</p>
     </div>
   </body>
   </html>
  `,
};

// Validation Functions
const validateInput = (data) => {
  const { name, email, phone, subject, message } = data;
  
  if (!name || !email || !phone || !subject || !message) {
    return 'Name, email, phone, subject, and message are required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }

  return null;
};

const validateEnvironment = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error('Environment variables EMAIL_USER and EMAIL_PASS are not set.');
    return false;
  }

  return true;
};

// Email Service
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmails = async (transporter, formData) => {
  const { name, email, subject } = formData;

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: ADMIN_EMAIL, // Send to the new admin email
    subject: `New Contact: ${subject}`,
    html: emailTemplates.admin(formData),
  };

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `We've Received Your Message - ${DEALER_NAME}`,
    html: emailTemplates.user(formData),
  };

  return Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(userMailOptions),
  ]);
};

// Main Handler
export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, subject, message, contactMethod } = formData;

    // Input Validation
    const validationError = validateInput(formData);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Environment Validation
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // Email Setup and Sending
    const transporter = createTransporter();
    await sendEmails(transporter, formData);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We will get back to you as soon as possible.',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}