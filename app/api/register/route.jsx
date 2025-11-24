import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../libs/prisma';

export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      role = 'USER',
      status = 'ACTIVE',
      canManageListings = false,
      canApproveListings = false,
      canManageWebsite = false 
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role,
        status,
        canManageListings,
        canApproveListings,
        canManageWebsite,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        joinDate: true,
        lastActive: true,
        canManageListings: true,
        canApproveListings: true,
        canManageWebsite: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Team member created successfully',
        member: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch all users for team management
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        joinDate: true,
        lastActive: true,
        canManageListings: true,
        canApproveListings: true,
        canManageWebsite: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      {
        success: true,
        members: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}