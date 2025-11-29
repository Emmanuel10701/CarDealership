import { NextResponse } from 'next/server';
import { prisma } from '../../../../../libs/prisma';

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    console.log('🔍 Searching for review link with code:', code);

    // First find by unique code
    const reviewLink = await prisma.reviewLink.findUnique({
      where: { 
        uniqueCode: code
      },
      select: {
        id: true,
        title: true,
        description: true,
        uniqueCode: true,
        status: true,
        createdAt: true,
        createdById: true
      }
    });

    console.log('📋 Found review link:', reviewLink);

    if (!reviewLink) {
      return NextResponse.json(
        { 
          error: 'Review link not found',
          debug: {
            searchedCode: code
          }
        },
        { status: 404 }
      );
    }

    // Then check if it's active
    if (reviewLink.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          error: 'Review link is not active',
          debug: {
            code: code,
            status: reviewLink.status
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reviewLink
    });

  } catch (error) {
    console.error('Get review link error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review link' },
      { status: 500 }
    );
  }
}