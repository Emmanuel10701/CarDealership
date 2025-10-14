import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import {prisma} from "../../../libs/prisma"; // ✅ Prisma client

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

    // Save uploaded images to /public/uploads
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

    // ✅ Return response
    return NextResponse.json({
      success: true,
      message: "Car listing created successfully.",
      data: newCar, // includes `id`
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
