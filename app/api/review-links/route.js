import { NextResponse } from 'next/server';
import { prisma } from '../../../libs/prisma';

// GET - Fetch all review links
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const reviewLinks = await prisma.reviewLink.findMany({
      where: userId ? { createdById: userId } : {},
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            status: true,
            createdAt: true,
            serviceType: true,
            customerName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      reviewLinks
    });

  } catch (error) {
    console.error('Get review links error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review links' },
      { status: 500 }
    );
  }
}

// POST - Create a new review link
export async function POST(request) {
  try {
    const { title, description, createdById } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate unique code
    const uniqueCode = generateUniqueCode();
    
    const reviewLink = await prisma.reviewLink.create({
      data: {
        title,
        description,
        uniqueCode,
        status: 'ACTIVE',
        createdById: createdById || 'admin-user'
      },
      include: {
        reviews: true
      }
    });

    const publicUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/review/${uniqueCode}`;

    return NextResponse.json({
      success: true,
      reviewLink,
      publicUrl
    });

  } catch (error) {
    console.error('Create review link error:', error);
    return NextResponse.json(
      { error: 'Failed to create review link' },
      { status: 500 }
    );
  }
}

function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}