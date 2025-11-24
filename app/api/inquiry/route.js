import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET - Fetch all car inquiries
export async function GET() {
  try {
    const inquiries = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching car inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

// POST - Approve or Reject car inquiry
export async function POST(request) {
  try {
    const { id, action, adminNotes, rejectionReason } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "ID and action are required" },
        { status: 400 }
      );
    }

    // Find the car
    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    let updatedCar;
    let statusMessage = '';

    if (action === 'approve') {
      // Mark as approved
      updatedCar = await prisma.car.update({
        where: { id },
        data: {
          status: 'approved',
          adminNotes: adminNotes,
          reviewedAt: new Date(),
          reviewedBy: 'Admin',
        },
      });
      statusMessage = 'approved';
      
      // Send approval email
      await sendApprovalEmail(car);
      
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { success: false, error: "Rejection reason is required" },
          { status: 400 }
        );
      }

      // Mark as rejected
      updatedCar = await prisma.car.update({
        where: { id },
        data: {
          status: 'rejected',
          adminNotes: adminNotes,
          rejectionReason: rejectionReason,
          reviewedAt: new Date(),
          reviewedBy: 'Admin',
        },
      });
      statusMessage = 'rejected';
      
      // Send rejection email
      await sendRejectionEmail(car, rejectionReason);
      
    } else if (action === 'publish') {
      // Mark as published and send to car deal API
      updatedCar = await prisma.car.update({
        where: { id },
        data: {
          status: 'published',
          adminNotes: adminNotes,
          reviewedAt: new Date(),
          reviewedBy: 'Admin',
        },
      });
      statusMessage = 'published';
      
      // Send publish email and publish to car deal
      await sendPublishEmail(car);
      await publishToCarDeal(car);
      
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Car ${statusMessage} successfully`,
      data: updatedCar,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// Publish to car deal API
async function publishToCarDeal(car) {
  try {
    const carData = {
      carName: car.carName,
      year: car.year,
      price: car.price,
      location: car.location,
      carType: car.carType,
      mileage: car.mileage,
      transmission: car.transmission,
      fuelType: car.fuelType,
      description: car.description,
      sellerName: car.sellerName,
      sellerPhone: car.sellerPhone,
      sellerEmail: car.sellerEmail,
      features: car.features,
      file: car.file,
      files: car.files
    };

    const response = await fetch(`${process.env.APP_URL}/api/cardeal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    if (!response.ok) {
      throw new Error('Failed to publish to car deal');
    }

    console.log('Car published to car deal successfully');
  } catch (error) {
    console.error('Error publishing to car deal:', error);
    throw error;
  }
}

// Email functions
async function sendApprovalEmail(car) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Your Car Has Been Approved!</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear <strong>${car.sellerName}</strong>,</p>
        <p>Great news! Your vehicle listing for <strong>${car.carName}</strong> has been approved by our team.</p>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Next Steps:</h3>
          <ul>
            <li>Your car is now ready to be published</li>
            <li>It will be visible to thousands of potential buyers</li>
            <li>You'll start receiving inquiries shortly</li>
          </ul>
        </div>

        <p><strong>Listing Reference:</strong> ${car.reference}</p>
        <p><strong>Vehicle:</strong> ${car.carName}</p>
        <p><strong>Price:</strong> KSh ${car.price?.toLocaleString()}</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 12px;">
            Thank you for choosing our platform!<br>
            Car Platform Team
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Car Platform" <${process.env.EMAIL_USER}>`,
    to: car.sellerEmail,
    subject: `✅ Car Listing Approved - ${car.reference}`,
    html: html,
  });
}

async function sendRejectionEmail(car, reason) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Update on Your Car Listing</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear <strong>${car.sellerName}</strong>,</p>
        <p>Thank you for submitting your vehicle listing for <strong>${car.carName}</strong>.</p>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Listing Status: Requires Resubmission</h3>
          <p><strong>Reason for rejection:</strong> ${reason}</p>
          <p>Please review the feedback below and resubmit your listing with the necessary changes.</p>
        </div>

        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d97706; margin-top: 0;">How to Resubmit:</h3>
          <ul>
            <li>Review the rejection reason above</li>
            <li>Update your listing with the required information</li>
            <li>Submit a new car listing through our platform</li>
            <li>Contact support if you need help: support@carplatform.com</li>
          </ul>
        </div>

        <p><strong>Need Assistance?</strong><br>
        Email: support@carplatform.com<br>
        Phone: +254 700 000 000</p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.APP_URL}/sell-your-car" 
             style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            📝 Resubmit Your Listing
          </a>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Car Platform" <${process.env.EMAIL_USER}>`,
    to: car.sellerEmail,
    subject: `📝 Car Listing Requires Updates - ${car.reference}`,
    html: html,
  });
}

async function sendPublishEmail(car) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🚀 Your Car is Now Live!</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Dear <strong>${car.sellerName}</strong>,</p>
        <p>Excellent news! Your vehicle <strong>${car.carName}</strong> is now published and visible to buyers.</p>
        
        <div style="background: #faf5ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #7c3aed; margin-top: 0;">What Happens Now?</h3>
          <ul>
            <li>Your listing is now live on our platform</li>
            <li>It's visible to thousands of potential buyers</li>
            <li>You should start receiving inquiries soon</li>
            <li>We'll notify you of any serious buyers</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.APP_URL}/cars/${car.reference}" 
             style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            👀 View Your Live Listing
          </a>
        </div>

        <p><strong>Listing Details:</strong><br>
        Reference: ${car.reference}<br>
        Vehicle: ${car.carName}<br>
        Price: KSh ${car.price?.toLocaleString()}<br>
        Published: ${new Date().toLocaleDateString()}</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #6b7280; font-size: 12px;">
            Happy selling! 🎉<br>
            Car Platform Team
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Car Platform" <${process.env.EMAIL_USER}>`,
    to: car.sellerEmail,
    subject: `🚀 Your Car is Now Live! - ${car.reference}`,
    html: html,
  });
}