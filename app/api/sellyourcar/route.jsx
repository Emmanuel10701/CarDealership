import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { prisma } from "../../../libs/prisma";

// ✅ Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("Email configuration error:", error);
  else console.log("✅ Email server ready");
});

// ✅ CREATE Car Listing
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const fields = {
      carName: formData.get("carName"),
      year: parseInt(formData.get("year")),
      price: parseFloat(formData.get("price")),
      location: formData.get("location"),
      carType: formData.get("carType"),
      mileage: parseInt(formData.get("mileage")),
      transmission: formData.get("transmission"),
      fuelType: formData.get("fuelType"),
      features: formData.get("features")
        ? formData.get("features").split(",").map((f) => f.trim())
        : [],
      description: formData.get("description"),
      sellerName: formData.get("sellerName"),
      sellerPhone: formData.get("sellerPhone"),
      sellerEmail: formData.get("sellerEmail"),
    };

    const reference = "CAR" + Date.now().toString().slice(-6);

    // ✅ Save uploaded images to /public/uploads
    const files = formData.getAll("images");
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const savedImages = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      savedImages.push(`/uploads/${fileName}`);
    }

    // ✅ Save to database using Prisma
    const newCar = await prisma.carListing.create({
      data: {
        reference,
        ...fields,
        images: savedImages,
      },
    });

    // ✅ Email template styles
    const emailStyles = `
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f7f9fc;
      color: #333;
      padding: 20px;
    `;

    const cardStyle = `
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
      max-width: 600px;
      margin: auto;
    `;

    const buttonStyle = `
      display: inline-block;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
    `;

    // ✅ Seller confirmation email
    const sellerEmailHTML = `
      <div style="${emailStyles}">
        <div style="${cardStyle}">
          <h2 style="color:#2563eb;">Car Listing Confirmation</h2>
          <p>Dear <strong>${fields.sellerName}</strong>,</p>
          <p>Your car listing has been successfully created on our platform. Below are the details:</p>

          <table style="width:100%; margin-top:15px; border-collapse:collapse;">
            <tr><td><b>Car Name:</b></td><td>${fields.carName}</td></tr>
            <tr><td><b>Year:</b></td><td>${fields.year}</td></tr>
            <tr><td><b>Price:</b></td><td>$${fields.price.toLocaleString()}</td></tr>
            <tr><td><b>Location:</b></td><td>${fields.location}</td></tr>
            <tr><td><b>Reference:</b></td><td>${reference}</td></tr>
          </table>

          <p style="margin-top:20px;">You can view your listing on your dashboard once it’s reviewed.</p>
          <p style="margin-top:25px;">Thank you for choosing our platform.</p>
        </div>
      </div>
    `;

    // ✅ Admin notification email
    const adminEmailHTML = `
      <div style="${emailStyles}">
        <div style="${cardStyle}">
          <h2 style="color:#2563eb;">New Car Listing Submitted</h2>
          <p>A new car listing has been submitted to the platform. Below are the details:</p>

          <table style="width:100%; margin-top:15px; border-collapse:collapse;">
            <tr><td><b>Seller Name:</b></td><td>${fields.sellerName}</td></tr>
            <tr><td><b>Email:</b></td><td>${fields.sellerEmail}</td></tr>
            <tr><td><b>Phone:</b></td><td>${fields.sellerPhone}</td></tr>
            <tr><td><b>Car:</b></td><td>${fields.carName}</td></tr>
            <tr><td><b>Year:</b></td><td>${fields.year}</td></tr>
            <tr><td><b>Price:</b></td><td>$${fields.price.toLocaleString()}</td></tr>
            <tr><td><b>Location:</b></td><td>${fields.location}</td></tr>
            <tr><td><b>Reference:</b></td><td>${reference}</td></tr>
          </table>

          <p style="margin-top:20px;">You can review or approve this listing from the admin dashboard.</p>
          <a href="https://your-admin-dashboard.com" style="${buttonStyle}">Go to Dashboard</a>
        </div>
      </div>
    `;

    // ✅ Send confirmation to seller
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: fields.sellerEmail,
      subject: "Your Car Listing was Successfully Submitted",
      html: sellerEmailHTML,
    });

    // ✅ Send notification to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "youremail@example.com", // <-- Replace with your admin email
      subject: "New Car Listing Submitted",
      html: adminEmailHTML,
    });

    // ✅ Return response
    return NextResponse.json({
      success: true,
      message: "Car listing created successfully and emails sent.",
      data: newCar,
    });
  } catch (error) {
    console.error("Error submitting car listing:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET all car listings
export async function GET() {
  try {
    const cars = await prisma.carListing.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "All cars fetched successfully.",
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
