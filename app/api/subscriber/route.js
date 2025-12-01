import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';
import nodemailer from 'nodemailer';

// Constants
const DEALER_NAME = 'Corporate Sellers';
const SUPPORT_PHONE = '0791596795';

// Final, Highly Modernized, Table-Based, and Responsive HTML Email Templates
const emailTemplates = {
    admin: ({ email }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Subscriber</title>
    <style type="text/css">
        body { margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f5f7; -webkit-text-size-adjust: 100%; }
        /* Reset table styles */
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td, th { padding: 0; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background-color: #3f51b5; color: #ffffff; text-align: center; }
        .content { padding: 30px; color: #333333; }
        .data-block { background-color: #e8eaf6; padding: 15px; border-radius: 6px; }
        .footer { background-color: #333333; color: #aaaaaa; text-align: center; }

        /* Mobile Styles */
        @media only screen and (max-width: 620px) {
            .wrapper { width: 100% !important; border-radius: 0 !important; margin: 0 !important; box-shadow: none !important; }
            .content { padding: 20px 15px !important; }
            .header { padding: 25px 15px !important; }
            .header h1 { font-size: 22px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7;">
    <center style="width: 100%; background-color: #f4f5f7;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px;">
            <tr>
                <td align="center" style="padding: 0;">
                    <div class="wrapper" style="width: 100%; max-width: 600px;">
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="header" style="background-color: #3f51b5; padding: 30px; text-align: center; color: #ffffff;">
                                    <h1 style="font-size: 26px; margin: 0; font-weight: 700; font-family: Arial, sans-serif; color: #ffffff;">
                                        📥 New Subscriber Notification
                                    </h1>
                                </td>
                            </tr>
                        </table>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="content" style="padding: 30px; color: #333333; font-family: Arial, sans-serif;">
                                    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                        A **new user** has successfully subscribed to the **${DEALER_NAME}** mailing list.
                                    </p>
                                    
                                    <div class="data-block" style="background-color: #e8eaf6; padding: 15px; border-radius: 6px;">
                                        <p style="color: #111; font-weight: 700; margin: 0 0 10px 0; font-size: 16px;">Subscriber Details:</p>
                                        <p style="margin: 5px 0; font-size: 16px; color: #3f51b5; font-weight: 600; word-break: break-all;">
                                            Email: <span style="font-weight: 700;">${email}</span>
                                        </p>
                                        <p style="font-size:13px; color:#555; margin: 10px 0 0 0;">Subscribed On: ${new Date().toLocaleString()}</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="footer" style="background-color: #333333; padding: 20px 30px; text-align: center; color: #aaaaaa; font-family: Arial, sans-serif;">
                                    <p style="margin: 0; color: #dddddd; font-size: 14px;">${DEALER_NAME} System Alert</p>
                                    <p style="margin: 5px 0 0 0; color: #aaaaaa; font-size: 12px;">Support Phone: ${SUPPORT_PHONE}</p>
                                    <p style="margin: 5px 0 0 0; color: #aaaaaa; font-size: 12px;">© ${new Date().getFullYear()} ${DEALER_NAME}.</p>
                                </td>
                            </tr>
                        </table>
                        
                    </div>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`,

    user: ({ email }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Corporate Sellers</title>
    <style type="text/css">
        body { margin:0; padding:0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f5f7; -webkit-text-size-adjust: 100%; }
        /* Reset table styles */
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td, th { padding: 0; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background-color: #000000; color: #ffffff; text-align: center; }
        .content { padding: 30px; color: #333333; text-align: center; }
        .cta-email { font-weight: 700; color: #3f51b5; font-size: 18px; display: block; margin: 10px 0 25px 0; padding: 15px; background-color: #e8eaf6; border-radius: 4px; word-break: break-all; }
        .footer { background-color: #333333; color: #aaaaaa; text-align: center; }

        /* Mobile Styles */
        @media only screen and (max-width: 620px) {
            .wrapper { width: 100% !important; border-radius: 0 !important; margin: 0 !important; box-shadow: none !important; }
            .content { padding: 20px 15px !important; }
            .header { padding: 25px 15px !important; }
            .header h1 { font-size: 26px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7;">
    <center style="width: 100%; background-color: #f4f5f7;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px;">
            <tr>
                <td align="center" style="padding: 0;">
                    <div class="wrapper" style="width: 100%; max-width: 600px;">
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="header" style="background-color: #000000; padding: 35px 30px; text-align: center; color: #ffffff;">
                                    <h1 style="font-size: 30px; margin: 0; font-weight: 800; font-family: Arial, sans-serif; color: #ffffff;">
                                        ${DEALER_NAME}
                                    </h1>
                                    <p style="color: #cccccc; font-size: 16px; margin: 5px 0 0 0; font-family: Arial, sans-serif;">Subscription Confirmed 🎉</p>
                                </td>
                            </tr>
                        </table>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="content" style="padding: 30px; color: #333333; text-align: center; font-family: Arial, sans-serif;">
                                    <p style="font-size:18px; font-weight:600; color:#111; margin: 0 0 15px 0;">Welcome to the Corporate Sellers network!</p>
                                    
                                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                                        Your email has been successfully registered:
                                    </p>
                                    
                                    <span class="cta-email" style="font-weight: 700; color: #3f51b5; font-size: 18px; display: block; margin: 10px auto 25px auto; padding: 15px; background-color: #e8eaf6; border-radius: 4px; max-width: 80%; word-break: break-all;">
                                        ${email}
                                    </span>
                                    
                                    <p style="font-size: 16px; line-height: 1.6; margin: 0;">
                                        Thank you for subscribing. You're now subscribed to receive **exclusive offers** and updates on our **premium vehicle inventory** and corporate listings.
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td class="footer" style="background-color: #333333; padding: 20px 30px; text-align: center; color: #aaaaaa; font-family: Arial, sans-serif;">
                                    <p style="margin: 0; font-size: 14px;">© ${new Date().getFullYear()} ${DEALER_NAME}. All rights reserved.</p>
                                    <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 12px;">**Phone: ${SUPPORT_PHONE}** | Your Trusted Automotive Partner</p>
                                </td>
                            </tr>
                        </table>
                        
                    </div>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`,
};

// Helper: Validate email environment
const validateEnvironment = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('EMAIL_USER and EMAIL_PASS are not set.');
        return false;
    }
    return true;
};

// Helper: Create Nodemailer transporter
const createTransporter = () =>
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

// POST: Add subscriber and send emails
export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        if (!validateEnvironment()) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

        // Check duplicate subscriber
        const existingSubscriber = await prisma.subscriber.findUnique({ where: { email } });
        if (existingSubscriber) return NextResponse.json({ error: 'Subscriber already exists' }, { status: 409 });

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
            subject: `New Subscriber - ${DEALER_NAME}`,
            html: emailTemplates.admin({ email }),
        };
        const userMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Welcome to ${DEALER_NAME}!`,
            html: emailTemplates.user({ email }),
        };

        await Promise.all([transporter.sendMail(adminMail), transporter.sendMail(userMail)]);

        return NextResponse.json(
            { success: true, message: 'Subscriber added and emails sent.', subscriber },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding subscriber:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

// GET: Fetch all subscribers
export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, email: true, createdAt: true },
        });
        return NextResponse.json({ success: true, subscribers }, { status: 200 });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}