import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Constants
const DEALER_NAME = 'CorporateSellers';
const SUPPORT_PHONE = '+254700000000';

// Helper function to format the budget for readability
const formatBudget = (budget) => {
    return budget
        .replace(/-/g, ' - ')
        .replace('under-10k', 'Under $10,000')
        .replace('over-75k', 'Over $75,000');
};

// Email Templates for Quote Requests
const quoteRequestTemplates = {
    // ADMIN TEMPLATE: Simple text for internal team
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
NEW QUOTE REQUEST - ${DEALER_NAME}

Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Vehicle Preferences:
- Car Type: ${carType}
- Budget: ${formatBudget(budget)}
- Preferred Year: ${preferredYear ? preferredYear.replace(/-/g, ' - ') : 'Any'}
- Timeline: ${timeline.replace(/-/g, ' ')}

${features ? `Features/Notes: ${features}` : ''}

ACTION REQUIRED: Please prepare quote and contact customer.

Reference: #QUOTE${Date.now().toString().slice(-6)}
    `,

    // USER TEMPLATE: Simple confirmation for customer
    user: ({ 
        name, 
        email, 
        phone, 
        carType, 
        budget, 
        preferredYear, 
        features, 
        timeline 
    }) => `
REQUEST CONFIRMED, ${name}!

Thank you for your interest in ${DEALER_NAME}. We have received your quote request.

Your Request Summary:
- Vehicle Type: ${carType}
- Budget: ${formatBudget(budget)}
- Preferred Year: ${preferredYear ? preferredYear.replace(/-/g, ' - ') : 'Any'}
- Timeline: ${timeline.replace(/-/g, ' ')}

${features ? `Your Notes: ${features}` : ''}

We will contact you within 24 hours with your quote.

Need immediate help? Call us: ${SUPPORT_PHONE}

Reference: #QUOTE${Date.now().toString().slice(-6)}
    `
};

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

  // Email validation
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
    console.error('Environment variables EMAIL_USER and EMAIL_PASS are required.');
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

const sendQuoteRequestEmails = async (transporter, formData) => {
  const { email, name, carType } = formData;

  // Use the same EMAIL_USER for both sending and receiving admin notifications
  const adminEmail = process.env.EMAIL_USER;

  const adminMailOptions = {
    from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Quote Request: ${carType} - ${name}`,
    text: quoteRequestTemplates.admin(formData),
  };

  const userMailOptions = {
    from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your ${DEALER_NAME} Quote Request Confirmation`,
    text: quoteRequestTemplates.user(formData),
  };

  return Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(userMailOptions),
  ]);
};

// Main Handler for Quote Requests
export async function POST(request) {
  try {
    const formData = await request.json();
    
    console.log('Received quote request data:', formData);

    // Input Validation
    const validationError = validateQuoteInput(formData);
    if (validationError) {
      console.log('Validation error:', validationError);
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Environment Validation
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }

    // Email Setup and Sending
    const transporter = createTransporter();
    await sendQuoteRequestEmails(transporter, formData);

    // Log the quote request
    console.log('New quote request received:', {
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      carType: formData.carType,
      budget: formData.budget,
      timeline: formData.timeline,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your quote request has been submitted successfully. We will contact you shortly.',
        reference: `#QUOTE${Date.now().toString().slice(-6)}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing quote request:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Optional: GET handler for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Quote Request API is working',
      service: 'CorporateSellers Quote Request Service',
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