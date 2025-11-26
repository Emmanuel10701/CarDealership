// app/api/cardeal/[id]/route.jsx - UPDATED TO REMOVE DESCRIPTION TRUNCATION
import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import path from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/carimages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🔹 GET — Get a single car listing by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const carListing = await prisma.carListing.findUnique({
      where: { id },
    });

    if (!carListing) {
      return NextResponse.json(
        { success: false, error: "Car listing not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, carListing }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update a car listing
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Extract and parse update data according to schema
    const carName = formData.get("carName")?.toString().trim();
    const price = formData.get("price") ? parseFloat(formData.get("price")) : undefined;
    const location = formData.get("location")?.toString().trim();
    const year = formData.get("year") ? parseInt(formData.get("year")) : undefined;
    const carType = formData.get("carType")?.toString().trim();
    const mileage = formData.get("mileage") ? parseInt(formData.get("mileage")) : undefined;
    const transmission = formData.get("transmission")?.toString().trim();
    const fuelType = formData.get("fuelType")?.toString().trim();
    
    // ✅ REMOVED TRUNCATION: Use full description
    const description = formData.get("description")?.toString().trim();
    
    const sellerName = formData.get("sellerName")?.toString().trim();
    const sellerPhone = formData.get("sellerPhone")?.toString().trim();
    const sellerEmail = formData.get("sellerEmail")?.toString().trim();

    // Handle features update - store as JSON array
    const featuresArray = formData.getAll("features")
      .filter(f => f && f.toString().trim() !== "")
      .map(f => f.toString().trim());

    const updatedData = {};

    // Only add fields that have values
    if (carName) updatedData.carName = carName;
    if (price !== undefined) updatedData.price = price;
    if (location) updatedData.location = location;
    if (year !== undefined) updatedData.year = year;
    if (carType) updatedData.carType = carType;
    if (mileage !== undefined) updatedData.mileage = mileage;
    if (transmission) updatedData.transmission = transmission;
    if (fuelType) updatedData.fuelType = fuelType;
    if (description) updatedData.description = description; // ✅ Full description
    if (sellerName) updatedData.sellerName = sellerName;
    if (sellerPhone) updatedData.sellerPhone = sellerPhone;
    if (sellerEmail) updatedData.sellerEmail = sellerEmail;

    // Handle features - store as JSON for MySQL
    if (featuresArray.length > 0) {
      updatedData.features = featuresArray;
    }

    // Get current car data to handle image updates
    const currentCar = await prisma.carListing.findUnique({
      where: { id },
      select: { files: true, file: true }
    });

    if (!currentCar) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Car listing not found",
          message: "Cannot update - car listing not found"
        }, 
        { status: 404 }
      );
    }

    // Handle existing images to keep
    const existingImagesToKeep = formData.getAll("existingImagesToKeep");
    let finalFiles = [];

    // Handle existing images - parse current files from JSON
    const currentFilesArray = Array.isArray(currentCar.files) 
      ? currentCar.files 
      : (currentCar.files ? JSON.parse(currentCar.files) : []);

    if (existingImagesToKeep.length > 0) {
      // User specified which images to keep
      finalFiles = existingImagesToKeep.map(img => img.toString());
      
      // Delete images that were removed
      if (currentFilesArray.length > 0) {
        const imagesToDelete = currentFilesArray.filter(
          img => !existingImagesToKeep.includes(img)
        );
        
        // Delete removed images from filesystem
        for (const imagePath of imagesToDelete) {
          try {
            const fullPath = path.join(process.cwd(), "public", imagePath);
            if (fs.existsSync(fullPath)) {
              await unlink(fullPath);
            }
          } catch (fileError) {
            // Continue if one image fails to delete
          }
        }
      }
    } else {
      // If no existingImagesToKeep provided, check if user wants to keep all or none
      const hasNewFiles = formData.getAll("files").some(file => file && file.name && file.size > 0);
      
      if (hasNewFiles) {
        // User uploaded new files but didn't specify existing images to keep
        // This means they want to replace all images
        
        // Delete all existing images
        if (currentFilesArray.length > 0) {
          for (const imagePath of currentFilesArray) {
            try {
              const fullPath = path.join(process.cwd(), "public", imagePath);
              if (fs.existsSync(fullPath)) {
                await unlink(fullPath);
              }
            } catch (fileError) {
              // Continue if one image fails to delete
            }
          }
        }
      } else {
        // No new files and no existingImagesToKeep - keep current images
        finalFiles = currentFilesArray;
      }
    }

    // Handle new file uploads with SHORT filenames
    const files = formData.getAll("files");
    const savedImages = [];

    // Process new file uploads - generate SHORT filenames for database compatibility
    for (const file of files) {
      if (file && file.name && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          
          // Generate SHORT filename for database compatibility
          const fileExt = file.name.split('.').pop() || 'jpg';
          // Use only timestamp + short random string
          const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          savedImages.push(`/carimages/${fileName}`);
        } catch (fileError) {
          // Continue with other files even if one fails
        }
      }
    }

    // Add new uploaded images to final files
    finalFiles = [...finalFiles, ...savedImages];

    // Update file fields if we have images
    if (finalFiles.length > 0) {
      // For the 'file' field (single string), use a SHORT filename
      updatedData.file = `/carimages/${Date.now()}-img.jpg`; // Short consistent filename
      
      // For 'files' field (JSON), store the actual file paths
      updatedData.files = finalFiles;
    } else {
      // If no images left, set to empty
      updatedData.file = null;
      updatedData.files = [];
    }

    const updatedCarListing = await prisma.carListing.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Car listing updated successfully",
        carListing: updatedCarListing 
      }, 
      { status: 200 }
    );
  } catch (error) {
    // More detailed error information
    let errorMessage = error.message;
    if (error.code === 'P2025') {
      errorMessage = "Car listing not found - it may have been deleted";
    } else if (error.code === 'P2002') {
      errorMessage = "A car with similar details already exists";
    } else if (error.code === 'P2000') {
      errorMessage = "Database column too small. Please update your database schema to use TEXT for the 'file' and 'description' fields.";
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: "Failed to update car listing",
        errorCode: error.code
      }, 
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Delete a car listing
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if car listing exists
    const existingCarListing = await prisma.carListing.findUnique({ 
      where: { id } 
    });
    
    if (!existingCarListing) {
      return NextResponse.json(
        { success: false, error: "Car listing not found" }, 
        { status: 404 }
      );
    }

    // Delete associated images from filesystem - parse files from JSON
    let filesArray = [];
    if (existingCarListing.files) {
      filesArray = Array.isArray(existingCarListing.files) 
        ? existingCarListing.files 
        : JSON.parse(existingCarListing.files);
    }

    if (filesArray.length > 0) {
      for (const imagePath of filesArray) {
        try {
          const fullPath = path.join(process.cwd(), "public", imagePath);
          if (fs.existsSync(fullPath)) {
            await unlink(fullPath);
          }
        } catch (fileError) {
          // Continue if one image fails to delete
        }
      }
    }

    // Also delete the main file if it exists and is different from files array
    if (existingCarListing.file && !filesArray.includes(existingCarListing.file)) {
      try {
        const mainFilePath = path.join(process.cwd(), "public", existingCarListing.file);
        if (fs.existsSync(mainFilePath)) {
          await unlink(mainFilePath);
        }
      } catch (fileError) {
        // Continue if main file fails to delete
      }
    }

    // Delete from database
    await prisma.carListing.delete({ 
      where: { id } 
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Car listing deleted successfully" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: "Failed to delete car listing"
      }, 
      { status: 500 }
    );
  }
}