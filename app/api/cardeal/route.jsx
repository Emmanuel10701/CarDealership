import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

// app/api/cardeal/route.jsx
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields from FormData
    const carName = formData.get("carName")?.toString().trim() || "";
    const price = parseFloat(formData.get("price") || "0");
    const location = formData.get("location")?.toString().trim() || "";
    const year = parseInt(formData.get("year") || "0");
    const carType = formData.get("carType")?.toString().trim() || "";
    const mileage = parseInt(formData.get("mileage") || "0");
    const transmission = formData.get("transmission")?.toString().trim() || "";
    const fuelType = formData.get("fuelType")?.toString().trim() || "";
    
    // ✅ REMOVED TRUNCATION: Use full description
    const description = formData.get("description")?.toString().trim() || "";
    
    const sellerName = formData.get("sellerName")?.toString().trim() || "";
    const sellerPhone = formData.get("sellerPhone")?.toString().trim() || "";
    const sellerEmail = formData.get("sellerEmail")?.toString().trim() || "";
    
    // Extract features and convert to JSON array
    const featuresArray = formData.getAll("features")
      .filter(f => f && f.toString().trim() !== "")
      .map(f => f.toString().trim());
    
    const features = featuresArray.length > 0 ? featuresArray : [];

    // Handle images upload
    const uploadDir = path.join(process.cwd(), "public/carimages");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = formData.getAll("files");
    const savedImages = [];

    for (const file of files) {
      if (file && file.name && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          // Use shorter filename to avoid length issues
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          savedImages.push(`/carimages/${fileName}`);
        } catch (fileError) {
          // Continue with other files even if one fails
        }
      }
    }

    // Use first image for single file field - generate short filename
    const singleFile = savedImages.length > 0 ? `/carimages/${Date.now()}-img.jpg` : null;

    // Generate unique reference
    const reference = `CAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ✅ Create the car listing in Prisma
    const carListing = await prisma.carListing.create({
      data: {
        reference,
        carName,
        price,
        location,
        year,
        carType,
        mileage,
        transmission,
        fuelType,
        description, // ✅ Full description without truncation
        sellerName,
        sellerPhone,
        sellerEmail,
        file: singleFile, // short filename for database compatibility
        files: savedImages, // JSON array of file paths
        features: features, // JSON array of features
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Car listing added successfully", 
        carListing 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: "Failed to create car listing",
        details: error.code
      },
      { status: 500 }
    );
  }
}

// 🔹 GET — Fetch all car listings
export async function GET() {
  try {
    const carListings = await prisma.carListing.findMany({
      orderBy: { createdAt: "desc" },
    });

    // MySQL returns JSON as objects/arrays directly, no need to parse
    const parsedCarListings = carListings.map(car => ({
      ...car,
      features: Array.isArray(car.features) ? car.features : [],
      files: Array.isArray(car.files) ? car.files : [],
    }));

    return NextResponse.json({ 
      success: true, 
      carListings: parsedCarListings 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: "Failed to fetch car listings" 
      },
      { status: 500 }
    );
  }
}