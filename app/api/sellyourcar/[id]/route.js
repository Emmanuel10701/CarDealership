import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔹 GET — Get a single car by ID
export async function GET(_, { params }) {
  try {
    const { id } = await params;

    const car = await prisma.carListing.findUnique({
      where: { id },
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

// 🔹 PUT — Update a car listing
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const contentType = request.headers.get("content-type") || "";
    let fields = {};
    let savedImages = [];

    // 🟩 multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extract text fields
      fields = {
        carName: formData.get("carName") || undefined,
        year: formData.get("year") ? parseInt(formData.get("year")) : undefined,
        price: formData.get("price") ? parseFloat(formData.get("price")) : undefined,
        location: formData.get("location") || undefined,
        carType: formData.get("carType") || undefined,
        mileage: formData.get("mileage") ? parseInt(formData.get("mileage")) : undefined,
        transmission: formData.get("transmission") || undefined,
        fuelType: formData.get("fuelType") || undefined,
        features: formData.get("features")
          ? formData.get("features").split(",").map(f => f.trim())
          : undefined,
        description: formData.get("description") || undefined,
        sellerName: formData.get("sellerName") || undefined,
        sellerPhone: formData.get("sellerPhone") || undefined,
        sellerEmail: formData.get("sellerEmail") || undefined,
      };

      // 🖼️ Handle images (optional)
      const files = formData.getAll("images");
      for (const file of files) {
        if (file && file.name) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          savedImages.push(`/uploads/${fileName}`);
        }
      }
    }
    // 🟩 JSON input
    else if (contentType.includes("application/json")) {
      fields = await request.json();
    }

    // 🧠 Get existing record first
    const existingCar = await prisma.carListing.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ success: false, message: `No car found with id ${id}` }, { status: 404 });
    }

    // 🧩 Merge with existing data (preserve old fields)
    const mergedData = {
      ...existingCar,
      ...fields,
      images: savedImages.length > 0 ? savedImages : existingCar.images,
      features: fields.features || existingCar.features,
    };

    // 🧹 Clean up undefined or empty fields
    Object.keys(mergedData).forEach(key => {
      if (mergedData[key] === undefined || mergedData[key] === "") delete mergedData[key];
    });

    // ✅ Update the car
    const updatedCar = await prisma.carListing.update({
      where: { id },
      data: mergedData,
    });

    return NextResponse.json({
      success: true,
      message: "Car listing updated successfully.",
      data: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Delete a car
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;

    const existingCar = await prisma.carListing.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
    }

    // Delete uploaded images
    if (existingCar.images && Array.isArray(existingCar.images)) {
      for (const imagePath of existingCar.images) {
        const fullPath = path.join(process.cwd(), "public", imagePath.replace("/", ""));
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    const deletedCar = await prisma.carListing.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Car deleted successfully", car: deletedCar }, { status: 200 });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
