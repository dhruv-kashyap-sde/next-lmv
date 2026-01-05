import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * This endpoint syncs NextAuth session with our custom JWT auth cookie
 * Called after successful Google OAuth to create auth_token cookie
 */
export async function POST(request) {
  try {
    // Get NextAuth session from the request
    const session = await getServerSession();

    console.log('Sync session - NextAuth session:', session);

    if (!session || !session.user) {
      console.error('No active NextAuth session found');
      return NextResponse.json(
        { success: false, error: 'No active session found' },
        { status: 401 }
      );
    }

    // Get user from database to ensure we have the latest data including role
    await connectDB();
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser) {
      console.error('User not found in database:', session.user.email);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Database user found:', dbUser._id, dbUser.role);

    // Generate our custom JWT token with database user data
    const token = generateToken({
      userId: dbUser._id.toString(),
      email: dbUser.email,
      role: dbUser.role || 'user',
    });

    // Create response and set auth cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image,
        emailVerified: dbUser.emailVerified,
      },
    });

    // Set the auth cookie
    setAuthCookie(response, token);

    console.log('Session synced successfully, auth cookie set');

    return response;
  } catch (error) {
    console.error('Sync session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync session', details: error.message },
      { status: 500 }
    );
  }
}
