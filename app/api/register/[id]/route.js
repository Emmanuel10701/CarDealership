import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../libs/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        member: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    const { 
      name, 
      email, 
      phone, 
      role, 
      status,
      canManageListings, 
      canApproveListings, 
      canManageWebsite,
      password // Optional password update
    } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Check if email is taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already taken by another user' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      phone,
      role,
      status,
      canManageListings,
      canApproveListings,
      canManageWebsite,
    };

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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
        message: 'Team member updated successfully',
        member: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Team member deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}