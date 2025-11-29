import { NextResponse } from 'next/server';
import { prisma } from '../../../../libs/prisma';

export async function GET() {
  try {
    // Generate a unique code
    const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create the review link
    const reviewLink = await prisma.reviewLink.create({
      data: {
        title: 'Customer Feedback - CorporateSellers',
        description: 'Please share your experience with our services',
        uniqueCode: uniqueCode,
        status: 'ACTIVE',
        createdById: 'admin-user'
      }
    });

    const reviewUrl = `http://localhost:3001/review/${uniqueCode}`;

    return NextResponse.json({
      success: true,
      message: 'Review link created successfully!',
      reviewLink: {
        id: reviewLink.id,
        title: reviewLink.title,
        uniqueCode: reviewLink.uniqueCode,
        status: reviewLink.status,
        createdAt: reviewLink.createdAt
      },
      reviewUrl: reviewUrl,
      instructions: `Visit this URL to test: ${reviewUrl}`
    });

  } catch (error) {
    console.error('Create test review link error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test review link',
        details: error.message 
      },
      { status: 500 }
    );
  }
}