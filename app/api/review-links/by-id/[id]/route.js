import { NextResponse } from 'next/server';
import { prisma } from '../../../../../libs/prisma';

// GET - Get review link by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const reviewLink = await prisma.reviewLink.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!reviewLink) {
      return NextResponse.json(
        { error: 'Review link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reviewLink
    });

  } catch (error) {
    console.error('Get review link by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review link' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review link by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.review.deleteMany({
      where: { reviewLinkId: id }
    });

    await prisma.reviewLink.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Review link deleted successfully'
    });

  } catch (error) {
    console.error('Delete review link error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review link' },
      { status: 500 }
    );
  }
}

// PATCH - Update review link by ID
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { title, description, status } = await request.json();

    const reviewLink = await prisma.reviewLink.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status })
      }
    });

    return NextResponse.json({
      success: true,
      reviewLink
    });

  } catch (error) {
    console.error('Update review link error:', error);
    return NextResponse.json(
      { error: 'Failed to update review link' },
      { status: 500 }
    );
  }
}