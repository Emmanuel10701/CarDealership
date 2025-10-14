import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/carimages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔹 GET — Get a single car by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params; // ✅ await params

    const car = await prisma.car.findUnique({
      where: { id }, // ✅ id is string
    });

    if (!car) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, car }, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 PUT — Update a car
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const updatedData = {
      name: formData.get("name") || undefined,
      price: formData.get("price") || undefined,
      location: formData.get("location") || undefined,
      year: formData.get("year") || undefined,
      type: formData.get("type") || undefined,
      mileage: formData.get("mileage") || undefined,
      transmission: formData.get("transmission") || undefined,
      fuel: formData.get("fuel") || undefined,
      description: formData.get("description") || undefined,
      dealer: formData.get("dealer") || undefined,
      phone: formData.get("phone") || undefined,
      features: formData.getAll("features") || undefined,
    };

    const files = formData.getAll("files");
    if (files && files.length > 0 && files[0].name) {
      const savedImages = [];
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        savedImages.push(`/carimages/${fileName}`);
      }

      updatedData.file = savedImages[0];
      updatedData.files = savedImages;
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, car: updatedCar }, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔹 DELETE — Delete a car
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    if (existingCar.files && Array.isArray(existingCar.files)) {
      for (const imagePath of existingCar.files) {
        const fullPath = path.join(process.cwd(), "public", imagePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Car deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
