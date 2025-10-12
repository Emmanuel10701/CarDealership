// app/api/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message, contactMethod } = await request.json();

    // 1. Validate required input from the request body
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ 
        error: 'Name, email, phone, subject, and message are required.' 
      }, { status: 400 });
    }

    // 2. Validate environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error('Environment variables EMAIL_USER and EMAIL_PASS are not set.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // 3. Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Modern email template for admin
    const mailOptionsToAdmin = {
      from: emailUser,
      to: emailUser,
      subject: `New Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); margin-top: 40px; margin-bottom: 40px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </div>
              <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New Contact Submission</h1>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; margin: 8px 0 0;">AutoKenya Website</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="background: #f8fafc; border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1a202c; font-size: 20px; font-weight: 600; margin: 0 0 20px;">Customer Information</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Full Name</label>
                    <p style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0;">${name}</p>
                  </div>
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Email Address</label>
                    <p style="color: #007bff; font-size: 16px; font-weight: 600; margin: 0;">${email}</p>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Phone Number</label>
                    <p style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0;">${phone}</p>
                  </div>
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Contact Preference</label>
                    <p style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0; text-transform: capitalize;">${contactMethod}</p>
                  </div>
                </div>

                <div>
                  <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Inquiry Subject</label>
                  <p style="color: #007bff; font-size: 16px; font-weight: 600; margin: 0 0 20px;">${subject}</p>
                </div>

                <div>
                  <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Message</label>
                  <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>
              </div>

              <!-- Action Card -->
              <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); border-radius: 16px; padding: 25px; text-align: center;">
                <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 10px;">Response Required</h3>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">Please respond within 24 hours using their preferred contact method</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0;">This message was sent from your AutoKenya contact form</p>
              <p style="color: #a0aec0; font-size: 12px; margin: 8px 0 0;">© ${new Date().getFullYear()} AutoKenya. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Modern email template for user confirmation
    const mailOptionsToUser = {
      from: emailUser,
      to: email,
      subject: `We've Received Your Message - AutoKenya`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received - AutoKenya</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); margin-top: 40px; margin-bottom: 40px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Message Received</h1>
              <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; margin: 8px 0 0;">Thank you for contacting AutoKenya</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1a202c; font-size: 24px; font-weight: 700; margin: 0 0 10px;">Hello ${name},</h2>
                <p style="color: #718096; font-size: 16px; line-height: 1.6; margin: 0;">We've received your message and our team will get back to you within 24 hours.</p>
              </div>

              <!-- Summary Card -->
              <div style="background: #f8fafc; border-radius: 16px; padding: 30px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="color: #1a202c; font-size: 18px; font-weight: 600; margin: 0 0 20px;">Your Inquiry Summary</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Reference</label>
                    <p style="color: #2d3748; font-size: 14px; font-weight: 600; margin: 0;">#${Date.now().toString().slice(-6)}</p>
                  </div>
                  <div>
                    <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Subject</label>
                    <p style="color: #007bff; font-size: 14px; font-weight: 600; margin: 0;">${subject}</p>
                  </div>
                </div>

                <div>
                  <label style="display: block; color: #718096; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Your Message</label>
                  <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                    <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>
              </div>

              <!-- Next Steps -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 15px;">What Happens Next</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 12px; font-weight: 600;">1</span>
                    </div>
                    <p style="color: white; font-size: 14px; margin: 0; flex: 1;">Our specialist reviews your inquiry</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 12px; font-weight: 600;">2</span>
                    </div>
                    <p style="color: white; font-size: 14px; margin: 0; flex: 1;">We contact you via ${contactMethod}</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 12px; font-weight: 600;">3</span>
                    </div>
                    <p style="color: white; font-size: 14px; margin: 0; flex: 1;">Provide personalized assistance</p>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div style="background: #1a202c; border-radius: 16px; padding: 25px; text-align: center;">
                <h3 style="color: white; font-size: 16px; font-weight: 600; margin: 0 0 15px;">Need Immediate Assistance?</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <a href="tel:+254700000000" style="display: block; background: #007bff; color: white; text-decoration: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: all 0.3s;">Call Us</a>
                  <a href="https://wa.me/254700000000" style="display: block; background: #10b981; color: white; text-decoration: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: all 0.3s;">WhatsApp</a>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 8px;">Best regards,</p>
              <p style="color: #1a202c; font-size: 16px; font-weight: 600; margin: 0 0 15px;">The AutoKenya Team</p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} AutoKenya. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails concurrently
    await Promise.all([
      transporter.sendMail(mailOptionsToAdmin),
      transporter.sendMail(mailOptionsToUser),
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully! We will get back to you soon.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send message. Please try again later.' 
    }, { status: 500 });
  }
}