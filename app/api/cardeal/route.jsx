import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

// 🔹 POST — Add a new car
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract fields from FormData
    const name = formData.get("name") || "";
    const price = formData.get("price") || "";
    const location = formData.get("location") || "";
    const year = formData.get("year") || "";
    const type = formData.get("type") || "";
    const mileage = formData.get("mileage") || "";
    const transmission = formData.get("transmission") || "";
    const fuel = formData.get("fuel") || "";
    const description = formData.get("description") || "";
    const dealer = formData.get("dealer") || "";
    const phone = formData.get("phone") || "";
    const features = formData.getAll("features") || [];
    const userId = formData.get("userId") || null;

    // Handle images upload
    const uploadDir = path.join(process.cwd(), "public/carimages");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const files = formData.getAll("files"); // multiple images
    const savedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      savedImages.push(`/carimages/${fileName}`);
    }

    // Main image (first one)
    const file = savedImages.length > 0 ? savedImages[0] : null;

    // ✅ Create the car in Prisma
    const car = await prisma.car.create({
      data: {
        name,
        price,
        location,
        year,
        type,
        mileage,
        transmission,
        fuel,
        description,
        dealer,
        phone,
        file,
        files: savedImages,
        features,
        userId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Car added successfully", car },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 GET — Fetch all cars
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, cars }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
