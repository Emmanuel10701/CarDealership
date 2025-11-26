import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 🔹 GET — Get a single car by ID
export async function GET(_, { params }) {
    try {
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
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 🔹 PUT — Update a car listing (Regular user updates)
export async function PUT(request, { params }) {
    try {
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

        // 🚫 BLOCK ADMIN FIELD UPDATES - These should only be updated via PATCH
        const adminFields = ['status', 'adminNotes', 'rejectionReason', 'reviewedAt', 'reviewedBy'];
        adminFields.forEach(field => {
            if (fields[field] !== undefined) {
                delete fields[field];
            }
        });

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
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// 🔹 PATCH — Update car status (Admin only - with email notifications)
export async function PATCH(request, { params }) {
    try {
        const awaitedParams = await params;
        const { id } = awaitedParams;

        const { status, adminNotes, rejectionReason, reviewedBy } = await request.json();

        // Validate required fields
        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status is required" },
                { status: 400 }
            );
        }

        const validStatuses = ['pending', 'approved', 'rejected', 'published'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: "Invalid status. Must be: pending, approved, rejected, or published" },
                { status: 400 }
            );
        }

        // Check if car exists
        const existingCar = await prisma.car.findUnique({ 
            where: { id } 
        });

        if (!existingCar) {
            return NextResponse.json(
                { success: false, error: "Car not found" },
                { status: 404 }
            );
        }

        // Handle rejection reason validation
        if (status === 'rejected') {
            if (!rejectionReason) {
                return NextResponse.json(
                    { success: false, error: "Rejection reason is required when rejecting a car" },
                    { status: 400 }
                );
            }
        }

        // Prepare update data - Update the actual status field
        const updateData = {
            status: status,
            reviewedAt: new Date(),
            reviewedBy: reviewedBy || 'Admin',
        };

        // Also store admin data in features for historical tracking
        const currentFeatures = existingCar.features || {};
        
        const adminData = {
            status: status,
            adminNotes: adminNotes || '',
            rejectionReason: status === 'rejected' ? rejectionReason : '',
            reviewedAt: new Date().toISOString(),
            reviewedBy: reviewedBy || 'Admin',
            ...(currentFeatures.adminData || {})
        };

        // Update both the main status field and features.adminData
        updateData.features = {
            ...currentFeatures,
            adminData: adminData
        };

        // Add rejection reason to main update if rejected
        if (status === 'rejected') {
            updateData.rejectionReason = rejectionReason;
        }

        // Update car in database
        const updatedCar = await prisma.car.update({
            where: { id },
            data: updateData
        });

        // ✅ Send email notification to seller
        try {
            await sendStatusEmail(updatedCar, status, adminNotes, rejectionReason);
        } catch (emailError) {
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            message: `Car ${status} successfully`,
            data: updatedCar
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// 🔹 DELETE — Delete a car
export async function DELETE(_, { params }) {
    try {
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
                    }
                }
            }
        }

        const deletedCar = await prisma.car.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Car deleted successfully", car: deletedCar }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ✅ Email sending function for status updates
async function sendStatusEmail(car, status, adminNotes, rejectionReason) {
    let subject = "";
    let emailHTML = "";

    const carDetails = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2563eb; margin-top: 0;">Vehicle Details:</h3>
            <table style="width: 100%;">
                <tr>
                    <td style="padding: 5px 0; width: 120px;"><strong>Vehicle:</strong></td>
                    <td style="padding: 5px 0;">${car.carName}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0;"><strong>Price:</strong></td>
                    <td style="padding: 5px 0;">KSh ${car.price?.toLocaleString() || '0'}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0;"><strong>Reference ID:</strong></td>
                    <td style="padding: 5px 0;"><code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${car.reference}</code></td>
                </tr>
                <tr>
                    <td style="padding: 5px 0;"><strong>Year:</strong></td>
                    <td style="padding: 5px 0;">${car.year}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0;"><strong>Mileage:</strong></td>
                    <td style="padding: 5px 0;">${car.mileage?.toLocaleString() || '0'} km</td>
                </tr>
            </table>
        </div>
    `;

    switch (status) {
        case 'approved':
            subject = `✅ Your Car Listing Has Been Approved - ${car.reference}`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">✅ Listing Approved!</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear <strong>${car.sellerName}</strong>,</p>
                        
                        <p>Great news! Your car listing has been <strong>approved</strong> and is now live on our platform.</p>
                        
                        ${carDetails}

                        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #059669; margin-top: 0;">🎉 What's Next?</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Your listing is now visible to potential buyers</li>
                                <li>You may start receiving inquiries immediately</li>
                                <li>Be prepared to respond to buyer questions</li>
                                <li>Keep your contact information up to date</li>
                            </ul>
                        </div>

                        ${adminNotes ? `
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #d97706; margin-top: 0;">📝 Admin Notes:</h3>
                            <p style="margin: 0; font-style: italic;">"${adminNotes}"</p>
                        </div>
                        ` : ''}

                        <p><strong>Need to make changes?</strong><br>
                        You can still update your listing details through your seller dashboard.</p>

                        <p>Happy selling!<br>
                        <strong>The Car Platform Team</strong></p>
                    </div>
                </div>
            `;
            break;

        case 'rejected':
            subject = `❌ Your Car Listing Needs Changes - ${car.reference}`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">❌ Listing Requires Changes</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear <strong>${car.sellerName}</strong>,</p>
                        
                        <p>After reviewing your car listing, we've found some issues that need to be addressed before it can be published.</p>
                        
                        ${carDetails}

                        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #dc2626; margin-top: 0;">📋 Required Changes:</h3>
                            <p style="margin: 10px 0; font-weight: bold;">${rejectionReason}</p>
                        </div>

                        ${adminNotes ? `
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #d97706; margin-top: 0;">💡 Additional Notes:</h3>
                            <p style="margin: 0; font-style: italic;">"${adminNotes}"</p>
                        </div>
                        ` : ''}

                        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #0369a1; margin-top: 0;">🔧 How to Fix:</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Review the issues mentioned above</li>
                                <li>Update your listing with the required changes</li>
                                <li>Resubmit for review</li>
                                <li>Our team will review it again within 24 hours</li>
                            </ul>
                        </div>

                        <p><strong>Need Help?</strong><br>
                        Contact our support team at <a href="mailto:support@carplatform.com">support@carplatform.com</a></p>
                    </div>
                </div>
            `;
            break;

        case 'published':
            subject = `🚀 Your Car is Now Live! - ${car.reference}`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🚀 Your Car is Live!</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear <strong>${car.sellerName}</strong>,</p>
                        
                        <p>Excellent! Your car listing has been published and is now actively promoted to potential buyers.</p>
                        
                        ${carDetails}

                        <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #4f46e5; margin-top: 0;">📈 Premium Visibility:</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Featured in search results</li>
                                <li>Included in email campaigns</li>
                                <li>Promoted on social media</li>
                                <li>Priority placement on the platform</li>
                            </ul>
                        </div>

                        ${adminNotes ? `
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #d97706; margin-top: 0;">📝 Admin Notes:</h3>
                            <p style="margin: 0; font-style: italic;">"${adminNotes}"</p>
                        </div>
                        ` : ''}

                        <p><strong>Get Ready for Inquiries!</strong><br>
                        Keep your phone and email handy for buyer contacts.</p>

                        <p>Best regards,<br>
                        <strong>The Car Platform Team</strong></p>
                    </div>
                </div>
            `;
            break;

        default:
            return; // No email for pending status
    }

    await transporter.sendMail({
        from: `"Car Platform Admin" <${process.env.EMAIL_USER}>`,
        to: car.sellerEmail,
        subject: subject,
        html: emailHTML,
    });
}