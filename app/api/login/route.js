import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../libs/prisma';
import { generateToken, sanitizeUser } from '../../../libs/auth';

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateLoginInput = (email, password) => {
  const errors = [];
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 1) {
    errors.push('Password is required');
  }

  return errors;
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate environment
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate input format
    const validationErrors = validateLoginInput(email, password);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase().trim()
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    // Generate JWT token
    const token = generateToken(user);

    // Prepare user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      joinDate: user.joinDate,
      lastActive: user.lastActive,
      canManageListings: user.canManageListings,
      canApproveListings: user.canApproveListings,
      canManageWebsite: user.canManageWebsite,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: sanitizeUser(userData),
        token,
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

// Optional: Get current user profile
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // You would verify the token here using your auth library
    // const decoded = verifyToken(token);
    
    // For now, this is a placeholder - implement token verification
    return NextResponse.json(
      { error: 'Token verification not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}