import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../libs/prisma';
import { generateToken, sanitizeUser } from '../../../libs/auth';

// Constants
const SCHOOL_NAME = 'Tokatwanyaa Highschool';

// Helpers
const validateEnvironment = () => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set.');
    return false;
  }
  return true;
};

const validateInput = (name, email, password, role) => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  const validRoles = ['USER', 'TEACHER', 'PRINCIPAL', 'ADMIN'];
  if (role && !validRoles.includes(role)) {
    errors.push('Invalid user role');
  }

  return errors;
};

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

    // Validate environment
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate input format
    const validationErrors = validateInput(name, email, password, role);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
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
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
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

    // Generate JWT token
    const token = generateToken(user);

    return NextResponse.json(
      {
        success: true,
        message: 'Team member created successfully',
        member: user,
        token, // Added JWT token
        user: sanitizeUser(user), // Added sanitized user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create team member error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

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