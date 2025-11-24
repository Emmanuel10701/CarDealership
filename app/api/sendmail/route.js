import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Corporate Dealer Constants
const DEALER_NAME = 'Maina Cars';
const DEALER_EMAIL = 'info@mainacars.com';
const SUPPORT_PHONE = '+254700000000';
const WEBSITE_URL = 'https://mainacars.com';
const SHOWROOM_ADDRESS = 'Nairobi, Kenya';

// Function to fetch subscribers from /api/subscribe
async function getSubscribers() {
  try {
    // If you're running locally, use absolute URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/subscribe`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subscribers: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data; // Direct array of emails
    } else if (data.subscribers && Array.isArray(data.subscribers)) {
      return data.subscribers; // { subscribers: [] } format
    } else if (data.emails && Array.isArray(data.emails)) {
      return data.emails; // { emails: [] } format
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
  
  return nodemailer.createTransporter({
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

    // Fetch subscribers from /api/subscribe
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
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  font-family: 'Inter', 'Arial', sans-serif; 
                  line-height: 1.6; 
                  color: #1a202c; 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  background: #f8fafc; 
                }
                .header { 
                  background: linear-gradient(135deg, #000000 0%, #333333 100%); 
                  color: white; 
                  padding: 30px; 
                  text-align: center; 
                  border-radius: 10px 10px 0 0; 
                }
                .content { 
                  background: white; 
                  padding: 30px; 
                  border-radius: 0 0 10px 10px; 
                  box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
                }
                .footer { 
                  text-align: center; 
                  margin-top: 20px; 
                  color: #718096; 
                  font-size: 12px; 
                  border-top: 1px solid #e2e8f0; 
                  padding-top: 15px; 
                }
                .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #000000 0%, #333333 100%);
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 10px 0;
                  font-weight: 600;
                }
                .highlight {
                  background: #f0fff4;
                  padding: 15px;
                  border-radius: 8px;
                  border-left: 4px solid #38a169;
                  margin: 15px 0;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin:0;font-size:24px;">${DEALER_NAME}</h1>
                <p style="margin:8px 0 0;opacity:0.9;">Premium Automotive Excellence</p>
              </div>
              
              <div class="content">
                ${message}
                
                <div class="footer">
                  <p><strong>${DEALER_NAME}</strong><br>
                  ${SHOWROOM_ADDRESS}<br>
                  ${SUPPORT_PHONE} | ${DEALER_EMAIL}</p>
                  <p><a href="${WEBSITE_URL}/unsubscribe" style="color:#718096;text-decoration:none;">Unsubscribe from these emails</a></p>
                </div>
              </div>
            </body>
            </html>
          `,
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

// GET - Get subscriber info (also fetches from /api/subscribe)
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