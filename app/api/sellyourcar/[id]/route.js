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

        const car = await prisma.car.findUnique({
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

            // Check if carData JSON is provided
            const carDataJson = formData.get("carData");
            if (carDataJson) {
                // Parse the JSON data from frontend
                fields = JSON.parse(carDataJson);
            } else {
                // Fallback: extract individual fields
                fields = {
                    carName: formData.get("carName") || undefined,
                    year: formData.get("year") ? parseInt(formData.get("year")) : undefined,
                    price: formData.get("price") ? parseFloat(formData.get("price").replace(/,/g, '')) : undefined,
                    location: formData.get("location") || undefined,
                    carType: formData.get("carType") || undefined,
                    mileage: formData.get("mileage") ? parseInt(formData.get("mileage").replace(/,/g, '')) : undefined,
                    transmission: formData.get("transmission") || undefined,
                    fuelType: formData.get("fuelType") || undefined,
                    engineSize: formData.get("engineSize") || undefined,
                    color: formData.get("color") || undefined,
                    doors: formData.get("doors") ? parseInt(formData.get("doors")) : undefined,
                    seats: formData.get("seats") ? parseInt(formData.get("seats")) : undefined,
                    features: formData.get("features")
                        ? formData.get("features").split(",").map(f => f.trim())
                        : undefined,
                    description: formData.get("description") || undefined,
                    carCondition: formData.get("carCondition") || undefined,
                    serviceHistory: formData.get("serviceHistory") || undefined,
                    accidentHistory: formData.get("accidentHistory") || undefined,
                    ownershipHistory: formData.get("ownershipHistory") || undefined,
                    roadTaxStatus: formData.get("roadTaxStatus") || undefined,
                    insuranceStatus: formData.get("insuranceStatus") || undefined,
                    sellerName: formData.get("sellerName") || undefined,
                    sellerPhone: formData.get("sellerPhone") || undefined,
                    sellerEmail: formData.get("sellerEmail") || undefined,
                    preferredContact: formData.get("preferredContact") || undefined,
                    priceNegotiable: formData.get("priceNegotiable") === "true",
                    testDrive: formData.get("testDrive") === "true",
                    warranty: formData.get("warranty") === "true",
                    warrantyMonths: formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths")) : undefined,
                    serviceRecords: formData.get("serviceRecords") === "true",
                    originalPaint: formData.get("originalPaint") === "true",
                    modifications: formData.get("modifications") || undefined,
                };
            }

            // 🖼️ Handle existing images to keep
            const existingImagesString = formData.get("existingImagesToKeep");
            if (existingImagesString) {
                existingImagesToKeep = existingImagesString
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // 🖼️ Handle new uploaded images
            const files = formData.getAll("files");
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

        const existingCar = await prisma.car.findUnique({ where: { id } });
        if (!existingCar) {
            return NextResponse.json({ success: false, message: `No car found with id ${id}` }, { status: 404 });
        }

        let finalImages = existingImagesToKeep.length > 0 || savedImages.length > 0
            ? existingImagesToKeep.concat(savedImages)
            : existingCar.files;

        // Set main file (first image) if available
        const mainFile = finalImages.length > 0 ? finalImages[0] : existingCar.file;

        // Prepare data for update - only use fields that exist in schema
        const dataToUpdate = {};
        
        // Basic fields that exist in schema
        const basicFields = [
            'carName', 'year', 'price', 'location', 'carType', 'mileage',
            'transmission', 'fuelType', 'description', 'sellerName', 
            'sellerPhone', 'sellerEmail'
        ];
        
        basicFields.forEach(key => {
            if (fields[key] !== undefined && fields[key] !== "") {
                dataToUpdate[key] = fields[key];
            }
        });
        
        // Handle features JSON - merge with existing data
        let updatedFeatures = existingCar.features || {};
        
        // Update selected features if provided
        if (fields.features !== undefined) {
            updatedFeatures.selectedFeatures = Array.isArray(fields.features) ? fields.features : [];
        }
        
        // Update specifications if any specification fields are provided
        if (fields.engineSize !== undefined || fields.color !== undefined || 
            fields.doors !== undefined || fields.seats !== undefined) {
            updatedFeatures.specifications = {
                ...(updatedFeatures.specifications || {}),
                ...(fields.engineSize !== undefined && { engineSize: fields.engineSize }),
                ...(fields.color !== undefined && { color: fields.color }),
                ...(fields.doors !== undefined && { doors: fields.doors }),
                ...(fields.seats !== undefined && { seats: fields.seats })
            };
        }
        
        // Update condition if any condition fields are provided
        if (fields.carCondition !== undefined || fields.serviceHistory !== undefined || 
            fields.accidentHistory !== undefined || fields.ownershipHistory !== undefined ||
            fields.roadTaxStatus !== undefined || fields.insuranceStatus !== undefined ||
            fields.modifications !== undefined) {
            updatedFeatures.condition = {
                ...(updatedFeatures.condition || {}),
                ...(fields.carCondition !== undefined && { carCondition: fields.carCondition }),
                ...(fields.serviceHistory !== undefined && { serviceHistory: fields.serviceHistory }),
                ...(fields.accidentHistory !== undefined && { accidentHistory: fields.accidentHistory }),
                ...(fields.ownershipHistory !== undefined && { ownershipHistory: fields.ownershipHistory }),
                ...(fields.roadTaxStatus !== undefined && { roadTaxStatus: fields.roadTaxStatus }),
                ...(fields.insuranceStatus !== undefined && { insuranceStatus: fields.insuranceStatus }),
                ...(fields.modifications !== undefined && { modifications: fields.modifications })
            };
        }
        
        // Update seller preferences if any preference fields are provided
        if (fields.preferredContact !== undefined || fields.priceNegotiable !== undefined || 
            fields.testDrive !== undefined || fields.warranty !== undefined ||
            fields.warrantyMonths !== undefined || fields.serviceRecords !== undefined ||
            fields.originalPaint !== undefined) {
            updatedFeatures.sellerPreferences = {
                ...(updatedFeatures.sellerPreferences || {}),
                ...(fields.preferredContact !== undefined && { preferredContact: fields.preferredContact }),
                ...(fields.priceNegotiable !== undefined && { priceNegotiable: fields.priceNegotiable }),
                ...(fields.testDrive !== undefined && { testDrive: fields.testDrive }),
                ...(fields.warranty !== undefined && { warranty: fields.warranty }),
                ...(fields.warrantyMonths !== undefined && { warrantyMonths: fields.warrantyMonths }),
                ...(fields.serviceRecords !== undefined && { serviceRecords: fields.serviceRecords }),
                ...(fields.originalPaint !== undefined && { originalPaint: fields.originalPaint })
            };
        }
        
        dataToUpdate.features = updatedFeatures;
        dataToUpdate.files = finalImages;
        dataToUpdate.file = mainFile;

        const updatedCar = await prisma.car.update({
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

        const existingCar = await prisma.car.findUnique({ where: { id } });
        if (!existingCar) {
            return NextResponse.json({ success: false, error: "Car not found" }, { status: 404 });
        }

        // Delete uploaded images
        if (existingCar.files && Array.isArray(existingCar.files)) {
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

        const deletedCar = await prisma.car.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Car deleted successfully", car: deletedCar }, { status: 200 });
    } catch (error) {
        console.error("Error deleting car:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}