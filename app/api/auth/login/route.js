import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password, isAdmin } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    let user;
    let role;

    // Check if logging in as admin or user
    if (isAdmin) {
      user = await Admin.findOne({ email }).select('+password');
      role = 'admin';
      
      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } else {
      user = await User.findOne({ email }).select('+password');
      role = user?.role || 'user';
      
      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login for admin
    if (isAdmin) {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: role,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: role,
          emailVerified: user.emailVerified,
          image: user.image,
        },
      },
      { status: 200 }
    );

    // Set auth cookie (6 hours)
    return setAuthCookie(response, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login. Please try again.' },
      { status: 500 }
    );
  }
}
