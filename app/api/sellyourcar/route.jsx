import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("Email configuration error:", error);
  else console.log("✅ Email server ready");
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const fields = {
      carName: formData.get("carName"),
      year: formData.get("year"),
      price: formData.get("price"),
      location: formData.get("location"),
      carType: formData.get("carType"),
      mileage: formData.get("mileage"),
      transmission: formData.get("transmission"),
      fuelType: formData.get("fuelType"),
      features: formData.get("features"),
      description: formData.get("description"),
      sellerName: formData.get("sellerName"),
      sellerPhone: formData.get("sellerPhone"),
      sellerEmail: formData.get("sellerEmail"),
    };

    const reference = "CAR" + Date.now().toString().slice(-6);

    // Save uploaded images to /public/uploads
    const files = formData.getAll("images");
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const savedImages = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      savedImages.push(`/uploads/${fileName}`);
    }

    // Prepare attachments and inline image previews
    const attachments = savedImages.map((url) => ({
      filename: path.basename(url),
      path: path.join(process.cwd(), "public", url),
      cid: path.basename(url),
    }));

    const imageHtml = savedImages
      .map(
        (url) =>
          `<img src="cid:${path.basename(
            url
          )}" alt="Car Image" style="width:100%; max-width:400px; margin-top:10px;">`
      )
      .join("");

    // Clean official email format (no emojis, no fancy styling)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px;">
          <p>Dear ${fields.sellerName},</p>
          <p>Thank you for submitting your car listing to Maina Cars. Below are the details of your submission:</p>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Car Name:</strong> ${fields.carName}</p>
          <p><strong>Year:</strong> ${fields.year}</p>
          <p><strong>Price:</strong> KSh ${fields.price}</p>
          <p><strong>Location:</strong> ${fields.location}</p>
          <p><strong>Car Type:</strong> ${fields.carType}</p>
          <p><strong>Mileage:</strong> ${fields.mileage}</p>
          <p><strong>Transmission:</strong> ${fields.transmission}</p>
          <p><strong>Fuel Type:</strong> ${fields.fuelType}</p>
          <p><strong>Features:</strong> ${fields.features}</p>
          <p><strong>Description:</strong> ${fields.description}</p>
          <p><strong>Seller Name:</strong> ${fields.sellerName}</p>
          <p><strong>Seller Phone:</strong> ${fields.sellerPhone}</p>
          <p><strong>Seller Email:</strong> ${fields.sellerEmail}</p>

          <p>Attached below are the images you uploaded:</p>
          ${imageHtml}

          <p>If any of the above details are incorrect, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>

          <p>Best regards,<br>
          Maina Cars Team</p>
        </body>
      </html>
    `;

    // Send confirmation email to seller
    await transporter.sendMail({
      from: `"Maina Cars" <${process.env.EMAIL_USER}>`,
      to: fields.sellerEmail,
      subject: `Car Listing Confirmation - ${reference}`,
      html: emailHtml,
      attachments,
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: `"Maina Cars" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Car Listing Submitted - ${reference}`,
      html: emailHtml,
      attachments,
    });

    // Return response
    return NextResponse.json({
      success: true,
      message: "Car listing submitted successfully. Confirmation emails sent.",
      data: {
        reference,
        ...fields,
        images: savedImages,
      },
    });
  } catch (error) {
    console.error("Error submitting car listing:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Sell your car API is active.",
  });
}
