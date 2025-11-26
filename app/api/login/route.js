import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../libs/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
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

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Your account has been deactivated. Please contact administrator.' 
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN 
      }
    );

    // Calculate token expiration time
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}