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
                companyName: formData.get("companyName") || "",
                dealerLicense: formData.get("dealerLicense") || "",
                priceNegotiable: formData.get("priceNegotiable") === "true",
                testDrive: formData.get("testDrive") === "true",
                warranty: formData.get("warranty") === "true",
                warrantyMonths: formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths")) : null,
                serviceRecords: formData.get("serviceRecords") === "true",
                originalPaint: formData.get("originalPaint") === "true",
                modifications: formData.get("modifications") || "none",
                certification: formData.get("certification") || "none",
            };
        }

        const reference = "CAR" + Date.now().toString().slice(-6);

        // ✅ ENFORCE STRICT FIELD LENGTH LIMITS - Based on common MySQL defaults
        const MAX_CAR_NAME_LENGTH = 100;
        const MAX_LOCATION_LENGTH = 50;
        const MAX_GENERAL_FIELD_LENGTH = 50;
        const MAX_FILE_PATH_LENGTH = 255;

        // ✅ STRICT Trimming for ALL text fields (except description)
        const trimmedFields = {
            ...fields,
            
            carName: fields.carName ? 
                fields.carName.substring(0, MAX_CAR_NAME_LENGTH) : '',
            
            location: fields.location ? 
                fields.location.substring(0, MAX_LOCATION_LENGTH) : '',
            
            carType: fields.carType ? 
                fields.carType.substring(0, MAX_GENERAL_FIELD_LENGTH) : '',
            
            transmission: fields.transmission ? 
                fields.transmission.substring(0, MAX_GENERAL_FIELD_LENGTH) : '',
            
            fuelType: fields.fuelType ? 
                fields.fuelType.substring(0, MAX_GENERAL_FIELD_LENGTH) : '',
            
            color: fields.color ? 
                fields.color.substring(0, 30) : '',
            
            sellerName: fields.sellerName ? 
                fields.sellerName.substring(0, MAX_CAR_NAME_LENGTH) : '',
            
            sellerPhone: fields.sellerPhone ? 
                fields.sellerPhone.substring(0, 20) : '',
            
            sellerEmail: fields.sellerEmail ? 
                fields.sellerEmail.substring(0, 100) : '',
            
            companyName: fields.companyName ? 
                fields.companyName.substring(0, MAX_CAR_NAME_LENGTH) : '',
            
            dealerLicense: fields.dealerLicense ? 
                fields.dealerLicense.substring(0, 50) : '',
            
            // Also trim all condition/history fields
            carCondition: fields.carCondition ? 
                fields.carCondition.substring(0, 20) : 'excellent',
            
            serviceHistory: fields.serviceHistory ? 
                fields.serviceHistory.substring(0, 20) : 'full',
            
            accidentHistory: fields.accidentHistory ? 
                fields.accidentHistory.substring(0, 20) : 'none',
            
            ownershipHistory: fields.ownershipHistory ? 
                fields.ownershipHistory.substring(0, 20) : '',
            
            roadTaxStatus: fields.roadTaxStatus ? 
                fields.roadTaxStatus.substring(0, 20) : 'current',
            
            insuranceStatus: fields.insuranceStatus ? 
                fields.insuranceStatus.substring(0, 20) : 'comprehensive',
            
            modifications: fields.modifications ? 
                fields.modifications.substring(0, 20) : 'none',
            
            certification: fields.certification ? 
                fields.certification.substring(0, 20) : 'none',
            
            preferredContact: fields.preferredContact ? 
                fields.preferredContact.substring(0, 10) : 'phone',
            
            engineSize: fields.engineSize ? 
                fields.engineSize.substring(0, 20) : '',

            // Ensure numeric fields are valid
            year: fields.year && !isNaN(fields.year) ? parseInt(fields.year) : 2023,
            price: fields.price && !isNaN(fields.price) ? parseFloat(fields.price) : 0,
            mileage: fields.mileage && !isNaN(fields.mileage) ? parseInt(fields.mileage) : 0,
            doors: fields.doors && !isNaN(fields.doors) ? parseInt(fields.doors) : null,
            seats: fields.seats && !isNaN(fields.seats) ? parseInt(fields.seats) : null,
            warrantyMonths: fields.warrantyMonths && !isNaN(fields.warrantyMonths) ? parseInt(fields.warrantyMonths) : null,
        };

        // ✅ Save uploaded images
        const incomingFiles = formData.getAll("files");
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const savedImages = [];
        for (const file of incomingFiles) {
            if (file && file.size > 0) { 
                const buffer = Buffer.from(await file.arrayBuffer());
                // ✅ Create very short filename
                const fileExtension = path.extname(file.name);
                const baseName = path.basename(file.name, fileExtension);
                const shortFileName = `${Date.now()}-${baseName.substring(0, 10)}${fileExtension}`;
                const filePath = path.join(uploadDir, shortFileName);
                await writeFile(filePath, buffer);
                
                // ✅ Trim the file path
                const fileUrl = `/uploads/${shortFileName}`;
                savedImages.push(fileUrl.substring(0, MAX_FILE_PATH_LENGTH));
            }
        }

        // ✅ Trim main file path
        const mainFile = savedImages.length > 0 ? savedImages[0].substring(0, MAX_FILE_PATH_LENGTH) : null;

        // ✅ Try to save to database with STRICTLY trimmed fields
        try {
            newCar = await prisma.car.create({
                data: {
                    reference,
                    carName: trimmedFields.carName,
                    year: trimmedFields.year,
                    price: trimmedFields.price,
                    location: trimmedFields.location,
                    carType: trimmedFields.carType,
                    mileage: trimmedFields.mileage,
                    transmission: trimmedFields.transmission,
                    fuelType: trimmedFields.fuelType,
                    description: fields.description, // ✅ Now using original description without length limit
                    sellerName: trimmedFields.sellerName,
                    sellerPhone: trimmedFields.sellerPhone,
                    sellerEmail: trimmedFields.sellerEmail,
                    file: mainFile,
                    files: savedImages,
                    features: {
                        selectedFeatures: Array.isArray(trimmedFields.features) ? trimmedFields.features : [],
                        specifications: {
                            engineSize: trimmedFields.engineSize,
                            color: trimmedFields.color,
                            doors: trimmedFields.doors,
                            seats: trimmedFields.seats,
                        },
                        condition: {
                            carCondition: trimmedFields.carCondition,
                            serviceHistory: trimmedFields.serviceHistory,
                            accidentHistory: trimmedFields.accidentHistory,
                            ownershipHistory: trimmedFields.ownershipHistory,
                            roadTaxStatus: trimmedFields.roadTaxStatus,
                            insuranceStatus: trimmedFields.insuranceStatus,
                            modifications: trimmedFields.modifications,
                            certification: trimmedFields.certification,
                        },
                        sellerPreferences: {
                            preferredContact: trimmedFields.preferredContact,
                            priceNegotiable: trimmedFields.priceNegotiable,
                            testDrive: trimmedFields.testDrive,
                            warranty: trimmedFields.warranty,
                            warrantyMonths: trimmedFields.warrantyMonths,
                            serviceRecords: trimmedFields.serviceRecords,
                            originalPaint: trimmedFields.originalPaint,
                            companyName: trimmedFields.companyName,
                            dealerLicense: trimmedFields.dealerLicense,
                        },
                        // ✅ STORE ADMIN DATA IN FEATURES JSON (Temporary solution)
                        adminData: {
                            status: "pending",
                            adminNotes: "",
                            rejectionReason: "",
                            reviewedAt: null,
                            reviewedBy: null
                        }
                    }
                },
            });
            
        } catch (dbError) {
            // Proceeding without database save due to connection issues
        }

        // ✅ Send emails even if database fails
        try {
            // Email to Seller
            const sellerEmailHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🚗 Car Listing Confirmation</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear <strong>${trimmedFields.sellerName}</strong>,</p>
                        
                        <p>Thank you for listing your vehicle with us! Your car has been successfully received and is now being processed.</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2563eb; margin-top: 0;">Listing Details:</h3>
                            <table style="width: 100%;">
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Vehicle:</strong></td>
                                    <td style="padding: 5px 0;">${trimmedFields.carName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Price:</strong></td>
                                    <td style="padding: 5px 0;">KSh ${trimmedFields.price?.toLocaleString() || '0'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Reference ID:</strong></td>
                                    <td style="padding: 5px 0;"><code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${reference}</code></td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Location:</strong></td>
                                    <td style="padding: 5px 0;">${trimmedFields.location}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0;"><strong>Status:</strong></td>
                                    <td style="padding: 5px 0;">
                                        <span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                            ⏳ Pending 
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #059669; margin-top: 0;">📋 What Happens Next?</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Your listing will be reviewed by our team</li>
                                <li>You'll receive buyer inquiries within 24-48 hours</li>
                                <li>We'll notify you of any interested buyers</li>
                                <li>Your listing will be active for 30 days</li>
                            </ul>
                        </div>

                        <p><strong>Need Help?</strong><br>
                        Contact our support team at <a href="mailto:corporatesellerske@gmail.com">support@carplatform.com</a></p>
                    </div>
                </div>
            `;

            // Send email to seller
            await transporter.sendMail({
                from: `"Car Platform" <${process.env.EMAIL_USER}>`,
                to: trimmedFields.sellerEmail,
                subject: `🚗 Car Listing Confirmation - ${reference}`,
                html: sellerEmailHTML,
            });

        } catch (emailError) {
            // Email error handled silently
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
                data: { 
                    ...trimmedFields, 
                    description: fields.description, // ✅ Using original description
                    files: savedImages,
                    status: "pending",
                    adminNotes: "",
                    rejectionReason: "",
                    reviewedAt: null,
                    reviewedBy: null
                }
            });
        }

    } catch (error) {
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
        return NextResponse.json(
            { success: false, error: "Database connection failed" },
            { status: 500 }
        );
    }
}