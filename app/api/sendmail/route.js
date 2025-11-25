import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Corporate Dealer Constants
const DEALER_NAME = 'Maina Cars';
const DEALER_EMAIL = 'info@mainacars.com';
const SUPPORT_PHONE = '+254700000000';
const WEBSITE_URL = 'https://mainacars.com';
const SHOWROOM_ADDRESS = 'Nairobi, Kenya';

// Function to fetch subscribers from /api/subscribe (Retained fixes from previous turn)
async function getSubscribers() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL 
      : 'http://localhost:3001'; 
    
    const response = await fetch(`${baseUrl}/api/subscriber`); 
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subscribers: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data;
    } else if (data.subscribers && Array.isArray(data.subscribers)) {
      return data.subscribers;
    } else if (data.emails && Array.isArray(data.emails)) {
      return data.emails;
    } else {
      console.warn('Unexpected response format from /api/subscribe:', data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    return [];
  }
}

// Email Configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  
  // ✅ FIX: Corrected function name from createTransporter to createTransport
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Main POST - Send Emails Immediately
export async function POST(request) {
  try {
    const { subject, message, emailType = 'general' } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found in the system' },
        { status: 404 }
      );
    }

    console.log('🚀 Sending emails ASAP to', subscribers.length, 'subscribers');

    const transporter = createTransporter();
    const sentEmails = [];
    const failedEmails = [];

    // Send email to ALL subscribers immediately
    const emailPromises = subscribers.map(async (email) => {
      try {
        const mailOptions = {
          from: {
            name: DEALER_NAME,
            address: process.env.EMAIL_USER
          },
          to: email,
          subject: subject,
          // 🌟 MODERNIZED TEMPLATE STARTS HERE 🌟
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <style type="text/css">
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }

                    /* Reset */
                    body { margin: 0 !important; padding: 0 !important; }
                    table { border-collapse: collapse !important; }
                    a { text-decoration: none; }
                    p { margin: 0 0 16px; }

                    /* Base Styles */
                    .container { max-width: 600px; }
                    .header-bg { background-color: #0d47a1; /* Dark Blue */ }
                    .header-content { padding: 30px 20px; text-align: center; }
                    .header-text { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; }
                    .subheader-text { color: #bbdefb; font-size: 16px; margin-top: 5px; }
                    .content-area { background-color: #ffffff; padding: 30px 20px; border-radius: 0 0 8px 8px; }
                    .button {
                        display: inline-block;
                        background-color: #1a73e8; /* Blue Primary */
                        color: #ffffff !important;
                        padding: 12px 25px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 16px;
                        text-decoration: none;
                        line-height: 1.2;
                    }
                    .footer-area { background-color: #f7f9fc; padding: 20px 20px 30px; text-align: center; color: #7f8c8d; font-size: 12px; border-top: 1px solid #eeeeee; }
                    .unsubscribe-link { color: #7f8c8d; text-decoration: underline; }

                    /* Media Queries for Mobile */
                    @media screen and (max-width: 500px) {
                        .container { width: 100% !important; max-width: 100% !important; }
                        .header-text { font-size: 24px !important; }
                        .content-area, .header-content { padding: 20px !important; }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">

                <center style="width: 100%; background-color: #f0f4f7;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                                    
                                    <tr>
                                        <td align="center" class="header-bg">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td class="header-content">
                                                        <h1 class="header-text" style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">
                                                            ${DEALER_NAME}
                                                        </h1>
                                                        <p class="subheader-text">
                                                            Premium Automotive Excellence
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td align="left" class="content-area" style="color: #333333; font-size: 16px; line-height: 1.6;">
                                            ${message}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" class="footer-area">
                                            <p style="margin: 0 0 10px; font-weight: 600;">${DEALER_NAME}</p>
                                            <p style="margin: 0 0 5px;">${SHOWROOM_ADDRESS}</p>
                                            <p style="margin: 0 0 15px;">${SUPPORT_PHONE} | ${DEALER_EMAIL}</p>

                                            <p style="margin: 0;">
                                                <a href="${WEBSITE_URL}/unsubscribe" class="unsubscribe-link">
                                                    Unsubscribe
                                                </a> | 
                                                <a href="${WEBSITE_URL}" class="unsubscribe-link">
                                                    Visit Website
                                                </a>
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
          `,
          // 🌟 MODERNIZED TEMPLATE ENDS HERE 🌟
          replyTo: DEALER_EMAIL
        };

        await transporter.sendMail(mailOptions);
        sentEmails.push(email);
        console.log(`✅ Email sent to: ${email}`);
        
        return { email, status: 'success' };
        
      } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error.message);
        failedEmails.push({ email, error: error.message });
        return { email, status: 'failed', error: error.message };
      }
    });

    // Wait for all emails to be sent
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent immediately to ${sentEmails.length} subscribers`,
      stats: {
        totalSubscribers: subscribers.length,
        sent: sentEmails.length,
        failed: failedEmails.length,
        successRate: `${((sentEmails.length / subscribers.length) * 100).toFixed(1)}%`
      },
      sentEmails: sentEmails,
      failedEmails: failedEmails,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error sending emails:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send emails',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET function remains unchanged as it only deals with API structure
export async function GET() {
  try {
    const subscribers = await getSubscribers();
    
    return NextResponse.json({
      success: true,
      dealer: DEALER_NAME,
      totalSubscribers: subscribers.length,
      subscribers: subscribers,
      ready: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscribers',
        details: error.message 
      },
      { status: 500 }
    );
  }
}