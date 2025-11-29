import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';

// POST - Submit a new review
export async function POST(request) {
  try {
    const { reviewLinkCode, customerName, customerEmail, rating, serviceType, comments } = await request.json();
    
    console.log('📝 Received review submission for code:', reviewLinkCode);

    // Validate required fields
    if (!reviewLinkCode || !rating) {
      return NextResponse.json(
        { error: 'Review link code and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Use findFirst instead of findUnique to allow status filter
    const reviewLink = await prisma.reviewLink.findFirst({
      where: { 
        uniqueCode: reviewLinkCode,
        status: 'ACTIVE'
      }
    });

    console.log('🔍 Found review link:', reviewLink ? 'Yes' : 'No');

    if (!reviewLink) {
      return NextResponse.json(
        { error: 'Invalid or inactive review link' },
        { status: 404 }
      );
    }

    // Check if this customer has already submitted a review for this link
    if (customerEmail) {
      const existingReview = await prisma.review.findFirst({
        where: {
          reviewLinkId: reviewLink.id,
          customerEmail: customerEmail.trim().toLowerCase()
        }
      });

      if (existingReview) {
        return NextResponse.json(
          { error: 'You have already submitted a review for this link' },
          { status: 409 }
        );
      }
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        reviewLinkId: reviewLink.id,
        customerName: customerName?.trim() || null,
        customerEmail: customerEmail?.trim().toLowerCase() || null,
        rating: parseInt(rating),
        serviceType: serviceType || 'OTHER',
        comments: comments?.trim() || null,
        status: 'PENDING'
      },
      include: {
        reviewLink: {
          select: {
            title: true,
            uniqueCode: true
          }
        }
      }
    });

    console.log('✅ Review created successfully:', review.id);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! Your review has been submitted successfully.',
      review: {
        id: review.id,
        rating: review.rating,
        serviceType: review.serviceType,
        comments: review.comments,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Submit review error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate review submission detected' },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Review link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Fetch all reviews
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewLinkId = searchParams.get('reviewLinkId');

    const where = reviewLinkId ? { reviewLinkId } : {};

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewLink: {
          select: {
            title: true,
            uniqueCode: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}