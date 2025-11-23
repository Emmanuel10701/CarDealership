import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔹 GET — Get a single car by ID (GET /api/sellyourcar/:id)
export async function GET(_, { params }) {
    try {
        // 🎯 FIX: Await params to satisfy Next.js compiler warning
        const awaitedParams = await params;
        const { id } = awaitedParams;

        const car = await prisma.car.findUnique({ // Corrected model
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

// 🔹 PUT — Update a car listing (PUT /api/sellyourcar/:id)
export async function PUT(request, { params }) {
    try {
        // 🎯 FIX: Await params to satisfy Next.js compiler warning
        const awaitedParams = await params;
        const { id } = awaitedParams;

        const contentType = request.headers.get("content-type") || "";
        let fields = {};
        let savedImages = [];
        let existingImagesToKeep = [];

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

            // 🖼️ Handle existing images to keep (FIXED: Comma-split logic)
            const existingImagesString = formData.get("existingImagesToKeep");
            if (existingImagesString) {
                existingImagesToKeep = existingImagesString
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // 🖼️ Handle new uploaded images
            const files = formData.getAll("files"); // Corrected field name
            for (const file of files) {
                if (file && file.size > 0) {
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
            if (fields.files) {
                existingImagesToKeep = fields.files;
                delete fields.files;
            }
        }

        const existingCar = await prisma.car.findUnique({ where: { id } }); // Corrected model
        if (!existingCar) {
            return NextResponse.json({ success: false, message: `No car found with id ${id}` }, { status: 404 });
        }

        let finalImages = existingImagesToKeep.length > 0 || savedImages.length > 0
            ? existingImagesToKeep.concat(savedImages)
            : existingCar.files;
        
        const dataToUpdate = {};
        Object.keys(fields).forEach(key => {
            if (fields[key] !== undefined && fields[key] !== "") {
                dataToUpdate[key] = fields[key];
            }
        });
        
        dataToUpdate.files = finalImages; // Corrected field name

        const updatedCar = await prisma.car.update({ // Corrected model
            where: { id },
            data: dataToUpdate,
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

// 🔹 DELETE — Delete a car (DELETE /api/sellyourcar/:id)
export async function DELETE(_, { params }) {
    try {
        // 🎯 FIX: Await params to satisfy Next.js compiler warning
        const awaitedParams = await params;
        const { id } = awaitedParams;

        const existingCar = await prisma.car.findUnique({ where: { id } }); // Corrected model
        if (!existingCar) {
            return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
        }

        // Delete uploaded images
        if (existingCar.files && Array.isArray(existingCar.files)) { // Corrected field name
            for (const imagePath of existingCar.files) {
                if (typeof imagePath === 'string') {
                    const fullPath = path.join(process.cwd(), "public", imagePath.replace("/uploads/", "uploads/"));
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    } else {
                        console.warn(`File not found at: ${fullPath}`);
                    }
                }
            }
        }

        const deletedCar = await prisma.car.delete({ where: { id } }); // Corrected model

        return NextResponse.json({ success: true, message: "Car deleted successfully", car: deletedCar }, { status: 200 });
    } catch (error) {
        console.error("Error deleting car:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}