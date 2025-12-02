import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Corporate Dealer Constants
const DEALER_NAME = 'Corporate Sellers';
const DEALER_EMAIL = 'corporatesellerske@gmail.com';
const SUPPORT_PHONE = '0791596795';
const WEBSITE_URL = process.env.NEXT_PUBLIC_URL || 'https://corporatesellers.com';
const SHOWROOM_ADDRESS = 'Nairobi, Kenya';
const DEFAULT_CAR_IMAGE = '/car1.png';

// Function to fetch subscribers from /api/subscribe
async function getSubscribers() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_URL 
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
      return [];
    }
  } catch (error) {
    return [];
  }
}

// Email Configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Function to get image attachment
async function getImageAttachment(attachImage, imageBuffer, emailType) {
  if (!attachImage) {
    return [];
  }

  // Use uploaded image if available
  if (imageBuffer) {
    return [{
      filename: 'car2.png',
      content: imageBuffer,
      cid: 'corporatesellers.com',
      contentType: 'image/png'
    }];
  }

  // Use default image for promotions/newsletters
  const isPromotionOrNewsletter = 
    emailType === 'new_listings' || 
    emailType === 'monthly_promotions' || 
    emailType === 'newsletter';

  if (isPromotionOrNewsletter) {
    try {
      // Try to read the default car image
      const publicPath = path.join(process.cwd(), 'public', DEFAULT_CAR_IMAGE.replace('/', ''));
      if (fs.existsSync(publicPath)) {
        const defaultImageBuffer = fs.readFileSync(publicPath);
        return [{
          filename: 'lll.png',
          content: defaultImageBuffer,
          cid: 'carImage@mainacars.com',
          contentType: 'image/png'
        }];
      }
      console.warn('Default car image not found:', DEFAULT_CAR_IMAGE);
    } catch (error) {
      console.error('Error reading default car image:', error);
    }
  }

  return [];
}

// Function to generate HTML email with image
function generateEmailHTML(message, hasImage) {
  const imageSection = hasImage ? `
    <tr>
      <td align="center" style="padding: 20px 0;">
        <img src="cid:carImage@mainacars.com" alt="Latest Car Promotion" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e0e0e0;">
      </td>
    </tr>
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email from ${DEALER_NAME}</title>
        <style type="text/css">
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

            /* Reset */
            body { margin: 0 !important; padding: 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            table { border-collapse: collapse !important; }
            a { text-decoration: none; color: #1a73e8; }
            p { margin: 0 0 16px; line-height: 1.6; }

            /* Base Styles */
            .container { max-width: 600px; margin: 0 auto; }
            .header-bg { background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%); }
            .header-content { padding: 40px 20px; text-align: center; }
            .header-text { color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; }
            .subheader-text { color: #bbdefb; font-size: 16px; margin: 0; }
            .content-area { background-color: #ffffff; padding: 40px 30px; }
            .button {
                display: inline-block;
                background-color: #1a73e8;
                color: #ffffff !important;
                padding: 14px 32px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                text-decoration: none;
                text-align: center;
                margin: 20px 0;
            }
            .footer-area { 
                background-color: #f8f9fa; 
                padding: 30px 20px; 
                text-align: center; 
                color: #6c757d; 
                font-size: 14px;
                border-top: 1px solid #dee2e6;
            }
            .unsubscribe-link { 
                color: #6c757d; 
                text-decoration: underline; 
                margin: 0 10px;
            }
            .promotion-tag {
                display: inline-block;
                background: #ff6b6b;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 10px;
            }

            /* Image Styling */
            .car-image-container {
                margin: 30px 0;
                text-align: center;
            }
            .car-image {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            /* Media Queries for Mobile */
            @media screen and (max-width: 500px) {
                .container { width: 100% !important; }
                .header-text { font-size: 24px !important; }
                .header-content, .content-area { padding: 30px 20px !important; }
                .button { padding: 12px 24px; font-size: 15px; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f7;">

        <center style="width: 100%; background-color: #f0f4f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
                            
                            <!-- Header -->
                            <tr>
                                <td align="center" class="header-bg">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td class="header-content">
                                                <h1 class="header-text">
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
                            
                            <!-- Content Area -->
                            <tr>
                                <td align="left" class="content-area" style="color: #333333; font-size: 16px; line-height: 1.7;">
                                    ${message}
                                </td>
                            </tr>

                            ${imageSection}

                            <!-- Call to Action -->
                            <tr>
                                <td align="center" style="padding: 30px; background-color: #f8f9fa;">
                                    <a href="${WEBSITE_URL}" class="button">
                                        Visit Our Showroom →
                                    </a>
                                    <p style="color: #6c757d; font-size: 14px; margin: 10px 0 0 0;">
                                        Limited time offers available
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" class="footer-area">
                                    <p style="margin: 0 0 15px; font-weight: 600; color: #495057;">${DEALER_NAME}</p>
                                    <p style="margin: 0 0 8px;">${SHOWROOM_ADDRESS}</p>
                                    <p style="margin: 0 0 15px;">
                                        📞 ${SUPPORT_PHONE} | ✉️ ${DEALER_EMAIL}
                                    </p>

                                    <p style="margin: 0;">
                                        <a href="${WEBSITE_URL}/unsubscribe" class="unsubscribe-link">
                                            Unsubscribe
                                        </a> | 
                                        <a href="${WEBSITE_URL}/preferences" class="unsubscribe-link">
                                            Preferences
                                        </a> | 
                                        <a href="${WEBSITE_URL}" class="unsubscribe-link">
                                            Website
                                        </a>
                                    </p>
                                    
                                    <p style="margin: 20px 0 0 0; font-size: 12px; color: #adb5bd;">
                                        © ${new Date().getFullYear()} ${DEALER_NAME}. All rights reserved.
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
  `;
}

// Main POST - Send Emails with Image Attachment
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const subject = formData.get('subject');
    const message = formData.get('message');
    const emailType = formData.get('emailType') || 'general';
    const attachImage = formData.get('attachImage') === 'true';
    const subscribersData = formData.get('subscribers');
    const imageFile = formData.get('image');

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    let subscribers = [];
    
    // Use provided subscribers array OR fetch from API
    if (subscribersData) {
      try {
        const parsedSubscribers = JSON.parse(subscribersData);
        if (Array.isArray(parsedSubscribers)) {
          subscribers = parsedSubscribers;
        }
      } catch (e) {
        console.log('Could not parse subscribers array, fetching from API');
      }
    }
    
    // If no subscribers provided, fetch from API
    if (subscribers.length === 0) {
      const fetchedSubscribers = await getSubscribers();
      subscribers = fetchedSubscribers.map(sub => 
        typeof sub === 'object' ? sub.email : sub
      ).filter(email => email);
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found in the system' },
        { status: 404 }
      );
    }

    const transporter = createTransporter();
    const sentEmails = [];
    const failedEmails = [];

    // Process image if attached
    let imageBuffer = null;
    if (attachImage && imageFile) {
      const bytes = await imageFile.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    }

    // Get image attachments
    const attachments = await getImageAttachment(attachImage, imageBuffer, emailType);
    const hasImage = attachments.length > 0;

    // Generate HTML with image placeholder if needed
    const emailHTML = generateEmailHTML(message, hasImage);

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
          html: emailHTML,
          attachments: attachments,
          replyTo: DEALER_EMAIL,
          // Text fallback for email clients that don't support HTML
          text: message.replace(/<[^>]*>/g, '')
        };

        await transporter.sendMail(mailOptions);
        sentEmails.push(email);
        
        return { email, status: 'success' };
        
      } catch (error) {
        failedEmails.push({ email, error: error.message });
        return { email, status: 'failed', error: error.message };
      }
    });

    // Wait for all emails to be sent
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${sentEmails.length} subscribers`,
      imageAttached: hasImage,
      imageType: hasImage ? (imageBuffer ? 'uploaded' : 'default') : 'none',
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

// GET function for API testing
export async function GET() {
  try {
    const subscribers = await getSubscribers();
    
    return NextResponse.json({
      success: true,
      dealer: DEALER_NAME,
      totalSubscribers: subscribers.length,
      subscribers: subscribers,
      defaultCarImage: DEFAULT_CAR_IMAGE,
      ready: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    }, { status: 200 });
    
  } catch (error) {
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