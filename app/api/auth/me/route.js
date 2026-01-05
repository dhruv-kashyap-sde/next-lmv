import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';

async function handler(request) {
  try {
    await connectDB();

    const { userId, role } = request.user;
    console.log("userID and role", userId, role);
    

    let user;
    if (role === 'admin') {
      user = await Admin.findById(userId).select('-password');
    } else {
      // Default to User model for any non-admin role
      user = await User.findById(userId).select('-password');
    }
    
    console.log("fetched user", user);

    if (!user) {
      console.error('User not found with ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          image: user.image,
          points: user.points,
          lastVoucherClaim: user.lastVoucherClaim,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
