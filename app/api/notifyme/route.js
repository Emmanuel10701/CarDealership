import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Constants
const DEALER_NAME = 'Corporate Cars';
const SUPPORT_PHONE = '+254700000000';

// Email Templates for NotifyMe
const notifyMeTemplates = {
  admin: ({ name, email, phone, message, interestType, carName, carPrice, dealer, carId }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Car Inquiry - ${DEALER_NAME}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); margin-top: 40px; margin-bottom: 40px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New Car Inquiry</h1>
          <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; margin: 8px 0 0;">${DEALER_NAME} - Vehicle Interest</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <!-- Vehicle Information -->
          <div style="background: #f0f9ff; border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 2px solid #e0f2fe;">
            <h2 style="color: #0369a1; font-size: 20px; font-weight: 600; margin: 0 0 15px; display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
              Vehicle Details
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #64748b; font-size: 14px;">Car Model:</strong>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 4px 0;">${carName}</p>
              </div>
              <div>
                <strong style="color: #64748b; font-size: 14px;">Price:</strong>
                <p style="color: #059669; font-size: 16px; font-weight: 600; margin: 4px 0;">KSh ${carPrice}</p>
              </div>
              <div>
                <strong style="color: #64748b; font-size: 14px;">Dealer:</strong>
                <p style="color: #1e293b; font-size: 14px; margin: 4px 0;">${dealer}</p>
              </div>
              <div>
                <strong style="color: #64748b; font-size: 14px;">Car ID:</strong>
                <p style="color: #1e293b; font-size: 14px; margin: 4px 0;">#${carId}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="background: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 20px;">Customer Information</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Full Name</label>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${name}</p>
              </div>
              <div>
                <label style="display: block; color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Email Address</label>
                <p style="color: #0369a1; font-size: 16px; font-weight: 600; margin: 0;">${email}</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Phone Number</label>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">${phone}</p>
              </div>
              <div>
                <label style="display: block; color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Interest Type</label>
                <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0; text-transform: capitalize;">
                  ${interestType.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            ${message ? `
            <div>
              <label style="display: block; color: #64748b; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Customer Message</label>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; padding: 20px; text-align: center;">
            <h3 style="color: white; font-size: 16px; font-weight: 600; margin: 0 0 8px;">Action Required</h3>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">
              Please contact the customer within 2 hours regarding their interest in this vehicle
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
          <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px;">${DEALER_NAME} - Premium Vehicle Sales</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">Car ID: #${carId} • ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `,

  user: ({ name, email, phone, message, interestType, carName, carPrice, dealer, carId }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Interest - ${DEALER_NAME}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); margin-top: 40px; margin-bottom: 40px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center;">
          <div style="width: 80px; height: 80px; background: white; border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
          </div>
          <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Thank You, ${name}!</h1>
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 8px 0 0;">We've received your interest in the ${carName}</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <!-- Vehicle Summary -->
          <div style="background: #f0fdf4; border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 2px solid #dcfce7;">
            <h2 style="color: #065f46; font-size: 20px; font-weight: 600; margin: 0 0 15px;">Vehicle You're Interested In</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #374151; font-size: 14px;">Model:</strong>
                <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 4px 0;">${carName}</p>
              </div>
              <div>
                <strong style="color: #374151; font-size: 14px;">Price:</strong>
                <p style="color: #059669; font-size: 18px; font-weight: 700; margin: 4px 0;">KSh ${carPrice}</p>
              </div>
              <div>
                <strong style="color: #374151; font-size: 14px;">Dealer:</strong>
                <p style="color: #1f2937; font-size: 14px; margin: 4px 0;">${dealer}</p>
              </div>
              <div>
                <strong style="color: #374151; font-size: 14px;">Reference:</strong>
                <p style="color: #1f2937; font-size: 14px; margin: 4px 0;">#INQ${carId}${Date.now().toString().slice(-4)}</p>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 15px;">What Happens Next</h2>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="width: 24px; height: 24px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span style="color: white; font-size: 12px; font-weight: 600;">1</span>
                </div>
                <div>
                  <p style="color: #1e293b; font-size: 14px; font-weight: 600; margin: 0 0 4px;">Immediate Confirmation</p>
                  <p style="color: #64748b; font-size: 13px; margin: 0;">You'll receive this confirmation email (that's this one!)</p>
                </div>
              </div>
              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="width: 24px; height: 24px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span style="color: white; font-size: 12px; font-weight: 600;">2</span>
                </div>
                <div>
                  <p style="color: #1e293b; font-size: 14px; font-weight: 600; margin: 0 0 4px;">Dealer Contact</p>
                  <p style="color: #64748b; font-size: 13px; margin: 0;">Our specialist will contact you within 2 hours</p>
                </div>
              </div>
              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="width: 24px; height: 24px; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span style="color: white; font-size: 12px; font-weight: 600;">3</span>
                </div>
                <div>
                  <p style="color: #1e293b; font-size: 14px; font-weight: 600; margin: 0 0 4px;">Personalized Service</p>
                  <p style="color: #64748b; font-size: 13px; margin: 0;">We'll assist with test drives, financing, and any questions</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); border-radius: 16px; padding: 25px; text-align: center;">
            <h3 style="color: white; font-size: 16px; font-weight: 600; margin: 0 0 15px;">Need Immediate Assistance?</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <a href="tel:${SUPPORT_PHONE}" style="display: block; background: white; color: #1e40af; text-decoration: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: all 0.3s;">
                Call Us Now
              </a>
              <a href="https://wa.me/${SUPPORT_PHONE.replace('+', '')}" style="display: block; background: #10b981; color: white; text-decoration: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: all 0.3s;">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
          <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 8px;">Thank you for considering ${DEALER_NAME}</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">We look forward to helping you with your vehicle purchase!</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Validation Functions - SIMPLIFIED VERSION
const validateInput = (data) => {
  const { name, email, phone, interestType, carId, carName } = data;
  
  const requiredFields = {
    name: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    interestType: 'Interest type',
    carId: 'Car ID',
    carName: 'Car name'
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    const value = data[field];
    
    // Check if value exists and is not empty
    if (!value || (typeof value === 'string' && value.trim() === '') || 
        (typeof value !== 'string' && !value)) {
      return `${label} is required.`;
    }
  }

  // Email validation only
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }

  // Phone validation removed - accept any phone format
  // Just ensure it's not empty (already checked above)

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

const sendNotifyMeEmails = async (transporter, formData) => {
  const { email, carName } = formData;

  // Use the same EMAIL_USER for both sending and receiving admin notifications
  const adminEmail = process.env.EMAIL_USER;

  const adminMailOptions = {
    from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Car Inquiry: ${carName}`,
    html: notifyMeTemplates.admin(formData),
  };

  const userMailOptions = {
    from: `"${DEALER_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank You for Your Interest in ${carName}`,
    html: notifyMeTemplates.user(formData),
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
    
    console.log('Received form data:', formData); // Debug log

    // Input Validation
    const validationError = validateInput(formData);
    if (validationError) {
      console.log('Validation error:', validationError); // Debug log
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
    await sendNotifyMeEmails(transporter, formData);

    // Log the inquiry (optional)
    console.log('New car inquiry received:', {
      carId: formData.carId,
      carName: formData.carName,
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We have received your interest and will contact you shortly.',
        reference: `#INQ${formData.carId}${Date.now().toString().slice(-4)}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing notify me request:', error);
    
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
      message: 'Notify Me API is working',
      service: 'Corporate Cars Notification Service',
      required_env: ['EMAIL_USER', 'EMAIL_PASS']
    },
    { status: 200 }
  );
}