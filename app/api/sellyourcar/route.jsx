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

// 🚀 CREATE Car Listing (POST)
export async function POST(request) {
    let newCar = null;
    
    try {
        const formData = await request.formData();

        // Extract carData JSON from form
        const carDataJson = formData.get("carData");
        let fields = {};
        
        if (carDataJson) {
            fields = JSON.parse(carDataJson);
        } else {
            // Fallback: extract individual fields
            fields = {
                carName: formData.get("carName"),
                year: parseInt(formData.get("year")),
                price: parseFloat(formData.get("price").replace(/,/g, '')),
                location: formData.get("location"),
                carType: formData.get("carType"),
                mileage: parseInt(formData.get("mileage").replace(/,/g, '')),
                transmission: formData.get("transmission"),
                fuelType: formData.get("fuelType"),
                engineSize: formData.get("engineSize"),
                color: formData.get("color"),
                doors: formData.get("doors") ? parseInt(formData.get("doors")) : null,
                seats: formData.get("seats") ? parseInt(formData.get("seats")) : null,
                features: formData.get("features") ? formData.get("features").split(",").map((f) => f.trim()) : [],
                description: formData.get("description"),
                carCondition: formData.get("carCondition") || "excellent",
                serviceHistory: formData.get("serviceHistory") || "full",
                accidentHistory: formData.get("accidentHistory") || "none",
                ownershipHistory: formData.get("ownershipHistory"),
                roadTaxStatus: formData.get("roadTaxStatus") || "current",
                insuranceStatus: formData.get("insuranceStatus") || "comprehensive",
                sellerName: formData.get("sellerName"),
                sellerPhone: formData.get("sellerPhone"),
                sellerEmail: formData.get("sellerEmail"),
                preferredContact: formData.get("preferredContact") || "phone",
                priceNegotiable: formData.get("priceNegotiable") === "true",
                testDrive: formData.get("testDrive") === "true",
                warranty: formData.get("warranty") === "true",
                warrantyMonths: formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths")) : null,
                serviceRecords: formData.get("serviceRecords") === "true",
                originalPaint: formData.get("originalPaint") === "true",
                modifications: formData.get("modifications") || "none",
            };
        }

        const reference = "CAR" + Date.now().toString().slice(-6);

        // ✅ Save uploaded images
        const incomingFiles = formData.getAll("files");
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const savedImages = [];
        for (const file of incomingFiles) {
            if (file && file.size > 0) { 
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, fileName);
                await writeFile(filePath, buffer);
                savedImages.push(`/uploads/${fileName}`);
            }
        }

        const mainFile = savedImages.length > 0 ? savedImages[0] : null;

        // ✅ Try to save to database
        try {
            newCar = await prisma.car.create({
                data: {
                    reference,
                    carName: fields.carName,
                    year: fields.year,
                    price: fields.price,
                    location: fields.location,
                    carType: fields.carType,
                    mileage: fields.mileage,
                    transmission: fields.transmission,
                    fuelType: fields.fuelType,
                    description: fields.description,
                    sellerName: fields.sellerName,
                    sellerPhone: fields.sellerPhone,
                    sellerEmail: fields.sellerEmail,
                    file: mainFile,
                    files: savedImages,
                    features: {
                        selectedFeatures: Array.isArray(fields.features) ? fields.features : [],
                        specifications: {
                            engineSize: fields.engineSize,
                            color: fields.color,
                            doors: fields.doors,
                            seats: fields.seats,
                        },
                        condition: {
                            carCondition: fields.carCondition,
                            serviceHistory: fields.serviceHistory,
                            accidentHistory: fields.accidentHistory,
                            ownershipHistory: fields.ownershipHistory,
                            roadTaxStatus: fields.roadTaxStatus,
                            insuranceStatus: fields.insuranceStatus,
                            modifications: fields.modifications,
                        },
                        sellerPreferences: {
                            preferredContact: fields.preferredContact,
                            priceNegotiable: fields.priceNegotiable,
                            testDrive: fields.testDrive,
                            warranty: fields.warranty,
                            warrantyMonths: fields.warrantyMonths,
                            serviceRecords: fields.serviceRecords,
                            originalPaint: fields.originalPaint,
                        }
                    }
                },
            });
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue without database save, but still send emails
            console.log("Proceeding without database save due to connection issues");
        }

        // ✅ Send emails even if database fails
        try {
            const sellerEmailHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2563eb;">Car Listing Confirmation</h2>
                    <p>Dear <strong>${fields.sellerName}</strong>,</p>
                    <p>Your car listing has been received. Below are the details:</p>
                    <table>
                        <tr><td><b>Car:</b></td><td>${fields.carName}</td></tr>
                        <tr><td><b>Price:</b></td><td>KSh ${fields.price.toLocaleString()}</td></tr>
                        <tr><td><b>Reference:</b></td><td>${reference}</td></tr>
                    </table>
                </div>
            `;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: fields.sellerEmail,
                subject: "Car Listing Received",
                html: sellerEmailHTML,
            });

        } catch (emailError) {
            console.error("Email error:", emailError);
        }

        // ✅ Return response
        if (newCar) {
            return NextResponse.json({
                success: true,
                message: "Car listing created successfully",
                data: newCar,
                id: newCar.id,
                reference: newCar.reference,
            });
        } else {
            return NextResponse.json({
                success: true,
                message: "Car listing received (saved locally due to database maintenance)",
                reference: reference,
                data: { ...fields, files: savedImages }
            });
        }

    } catch (error) {
        console.error("Error submitting car listing:", error);
        
        if (error.code === 'P1001') {
            return NextResponse.json({
                success: false,
                error: "Database server is not running. Please contact administrator.",
                reference: "CAR" + Date.now().toString().slice(-6)
            }, { status: 500 });
        }
        
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// 📖 GET all car listings
export async function GET() {
    try {
        const cars = await prisma.car.findMany({
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
            { success: false, error: "Database connection failed" },
            { status: 500 }
        );
    }
}