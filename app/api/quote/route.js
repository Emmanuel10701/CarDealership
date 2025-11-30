import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// --- Constants ---
const DEALER_NAME = 'CorporateSellers';
const SUPPORT_PHONE = '+254 791 596 795';
const SUPPORT_EMAIL = 'info@corporatesellers.co.ke';
const SHOWROOM_ADDRESS = 'Westlands Business District, Nairobi';
const DEALER_SLOGAN = 'Premium Auto Solutions Since 2016';

// --- Helper Functions ---

const formatBudget = (budget) => {
    const budgetMap = {
        'under-1m': 'Under KSh 1 Million',
        '1m-2m': 'KSh 1 Million - 2 Million',
        '2m-3m': 'KSh 2 Million - 3 Million',
        '3m-5m': 'KSh 3 Million - 5 Million',
        '5m-8m': 'KSh 5 Million - 8 Million',
        '8m-12m': 'KSh 8 Million - 12 Million',
        'over-12m': 'Over KSh 12 Million'
    };
    return budgetMap[budget] || budget.replace(/-/g, ' - ');
};

const formatTimeline = (timeline) => {
    const timelineMap = {
        'immediately': 'Immediately',
        'within-2weeks': 'Within 2 weeks',
        '1-2months': '1-2 months',
        '3-6months': '3-6 months',
        'just-browsing': 'Just browsing'
    };
    return timelineMap[timeline] || timeline;
};

const formatPreferredYear = (preferredYear) => {
    const yearMap = {
        '2020-2023': '2020-2023',
        '2017-2019': '2017-2019',
        '2014-2016': '2014-2016',
        '2010-2013': '2010-2013',
        'before-2010': 'Before 2010'
    };
    return preferredYear ? yearMap[preferredYear] || preferredYear : 'Any year';
};

// --- Email Templates (HTML Version for better formatting) ---

// Helper function for rendering table rows cleanly
const renderTableRow = (label, value) => {
    return `
        <tr>
            <td style="padding: 8px 15px 8px 0; font-weight: bold; vertical-align: top; width: 35%; color: #555;">${label}</td>
            <td style="padding: 8px 0; vertical-align: top; width: 65%; color: #333;">${value}</td>
        </tr>
    `;
};

const quoteRequestTemplates = {
    // ADMIN TEMPLATE: Detailed HTML for internal team
    admin: ({ 
        name, 
        email, 
        phone, 
        carType, 
        budget, 
        preferredYear, 
        features, 
        timeline 
    }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Quote Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <h2 style="color: #004d99; border-bottom: 2px solid #004d99; padding-bottom: 10px; margin-top: 0;">
            🚗 NEW QUOTE REQUEST - ${DEALER_NAME}
        </h2>
        
        <p style="color: #333; font-size: 1.1em;">
            A new customer has submitted a request for a quote. Please review and take action immediately.
        </p>

        <h3 style="color: #1a1a1a; margin-top: 25px; padding-bottom: 5px; border-bottom: 1px dashed #ddd;">📋 Customer & Vehicle Details</h3>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px;">
            ${renderTableRow("Name", name)}
            ${renderTableRow("Email", email)}
            ${renderTableRow("Phone", phone)}
            <tr><td colspan="2" style="height: 15px;"></td></tr>
            ${renderTableRow("Car Type", carType)}
            ${renderTableRow("Budget Range", formatBudget(budget))}
            ${renderTableRow("Preferred Year", formatPreferredYear(preferredYear))}
            ${renderTableRow("Purchase Timeline", formatTimeline(timeline))}
        </table>

        ${features ? `
        <h3 style="color: #1a1a1a; margin-top: 25px; padding-bottom: 5px; border-bottom: 1px dashed #ddd;">💡 Customer Notes</h3>
        <p style="white-space: pre-wrap; color: #333; margin: 0; padding: 10px; background-color: #f9f9f9; border-left: 3px solid #004d99;">${features}</p>` : ''}
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e6f0ff; border-radius: 5px; text-align: center;">
            <p style="font-size: 1.1em; font-weight: bold; color: #004d99; margin: 0 0 5px 0;">⏰ ACTION REQUIRED</p>
            <p style="margin: 0; color: #333;">Prepare quote and contact customer within 24 hours.</p>
        </div>

        <p style="font-size: 0.9em; color: #666; margin-top: 25px; text-align: center;">
            Reference: <strong>#QUOTE${Date.now().toString().slice(-6)}</strong> | 
            Received: ${new Date().toLocaleString()} | 
            Support: ${SUPPORT_PHONE}
        </p>
    </div>
</body>
</html>
    `,

    // USER TEMPLATE: Professional confirmation for customer (HTML Version)
    user: ({ 
        name, 
        carType, 
        budget, 
        preferredYear, 
        timeline 
    }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote Request Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-top: 0;">
            🏆 THANK YOU FOR YOUR INTEREST, ${name}!
        </h2>
        
        <p style="color: #333;">
            Your quote request has been successfully received by **${DEALER_NAME} - Premium Auto Marketplace**.
        </p>

        <h3 style="color: #1a1a1a; margin-top: 25px; padding-bottom: 5px; border-bottom: 1px dashed #ddd;">📋 Request Summary</h3>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px;">
            ${renderTableRow("Vehicle Type", carType)}
            ${renderTableRow("Budget Range", formatBudget(budget))}
            ${renderTableRow("Preferred Year", formatPreferredYear(preferredYear))}
            ${renderTableRow("Purchase Timeline", formatTimeline(timeline))}
        </table>
        
        <h3 style="color: #1a1a1a; margin-top: 25px; padding-bottom: 5px; border-bottom: 1px dashed #ddd;">⏰ What Happens Next</h3>
        <ul style="color: #333; padding-left: 20px;">
            <li>Our team will review your requirements</li>
            <li>We'll match you with suitable vehicles from our premium collection</li>
            <li>You'll receive a detailed quote within **24 hours**</li>
            <li>We'll schedule a test drive at your convenience</li>
        </ul>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-radius: 5px;">
            <p style="font-weight: bold; margin-top: 0; color: #007bff;">Need immediate assistance?</p>
            <p style="margin: 5px 0;">📞 Call us: <a href="tel:${SUPPORT_PHONE}" style="color: #004d99; text-decoration: none;">${SUPPORT_PHONE}</a></p>
            <p style="margin: 5px 0;">📧 Email: <a href="mailto:${SUPPORT_EMAIL}" style="color: #004d99; text-decoration: none;">${SUPPORT_EMAIL}</a></p>
            <p style="margin: 5px 0;">📍 Visit Our Showroom: ${SHOWROOM_ADDRESS}</p>
        </div>

        <p style="font-size: 0.9em; color: #666; margin-top: 25px; text-align: center;">
            Reference: <strong>#QUOTE${Date.now().toString().slice(-6)}</strong> | 
            Submitted: ${new Date().toLocaleString()}<br>
            Thank you for choosing ${DEALER_NAME}! *${DEALER_SLOGAN}*
        </p>
    </div>
</body>
</html>
    `
};

// --- Validation Functions ---

const validateQuoteInput = (data) => {
    const { name, email, phone, carType, budget, timeline } = data;
    
    const requiredFields = {
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        carType: 'Car type',
        budget: 'Budget range',
        timeline: 'Purchase timeline'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
        const value = data[field];
        if (!value || (typeof value === 'string' && value.trim() === '') || 
            (typeof value !== 'string' && !value)) {
            return `${label} is required.`;
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address.';
    }

    // Basic phone validation
    if (phone.length < 5) {
        return 'Please provide a valid phone number.';
    }

    return null;
};

const validateEnvironment = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.error('Environment variables EMAIL_USER and EMAIL_PASS are required.');
        return false;
    }

    return true;
};

// --- Email Service ---

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // Or 'smtp' with host/port details
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendQuoteRequestEmails = async (transporter, formData) => {
    const { email, name, carType } = formData;
    
    // The admin/receiving email is typically the same as the sending email
    const adminEmail = process.env.EMAIL_USER;

    const adminMailOptions = {
        from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `🚗 New Quote: ${carType} - ${name} - ${formatBudget(formData.budget)}`,
        html: quoteRequestTemplates.admin(formData), // Sending the HTML template
    };

    const userMailOptions = {
        from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🏆 Your ${DEALER_NAME} Quote Request Confirmation`,
        html: quoteRequestTemplates.user(formData), // Sending the HTML template
    };

    return Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
    ]);
};

// --- Main Handler ---

export async function POST(request) {
    try {
        const formData = await request.json();
        
        console.log('Received quote request data:', formData);

        // 1. Input Validation
        const validationError = validateQuoteInput(formData);
        if (validationError) {
            console.log('Validation error:', validationError);
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }

        // 2. Environment Validation
        if (!validateEnvironment()) {
            return NextResponse.json(
                { error: 'Server configuration error. Please try again later.' },
                { status: 500 }
            );
        }

        // 3. Email Setup and Sending
        const transporter = createTransporter();
        await sendQuoteRequestEmails(transporter, formData);

        // 4. Log the request (Internal Logging)
        console.log('New quote request processed successfully:', {
            customer: formData.name,
            email: formData.email,
            carType: formData.carType,
            budget: formatBudget(formData.budget),
            timestamp: new Date().toISOString()
        });

        // 5. Successful Response
        return NextResponse.json(
            {
                success: true,
                message: 'Thank you! Your quote request has been submitted successfully. We will contact you within 24 hours.',
                reference: `#QUOTE${Date.now().toString().slice(-6)}`,
                summary: {
                    name: formData.name,
                    carType: formData.carType,
                    budget: formatBudget(formData.budget),
                    timeline: formatTimeline(formData.timeline)
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error processing quote request:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process your request. Please try again later or contact us directly.',
            },
            { status: 500 }
        );
    }
}

// --- Optional: GET handler for testing and API documentation ---
export async function GET() {
    return NextResponse.json(
        { 
            message: 'CorporateSellers Quote Request API',
            service: 'Premium Auto Marketplace',
            dealer: DEALER_NAME,
            support_phone: SUPPORT_PHONE,
            currency: 'KSH (Kenyan Shillings)',
            required_fields: [
                'name',
                'email', 
                'phone',
                'carType',
                'budget',
                'timeline'
            ],
            optional_fields: [
                'preferredYear',
                'features'
            ]
        },
        { status: 200 }
    );
}