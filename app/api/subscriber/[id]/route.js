import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";

// ✅ Get single subscriber
export async function GET(request, context) {
  try {
    const { id } = await context.params; // ✅ must await params

    const subscriber = await prisma.subscriber.findUnique({
      where: { id }, // ✅ if your Prisma schema uses `id String`
    });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subscriber }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Update subscriber
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const updatedSubscriber = await prisma.subscriber.update({
      where: { id },
      data: { email },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber updated successfully",
        subscriber: updatedSubscriber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Delete subscriber
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Subscriber deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
