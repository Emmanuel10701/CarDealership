import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma';

// PATCH - Update review status
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a review
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}