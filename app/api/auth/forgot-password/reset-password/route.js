import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find verified OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: 'password-reset',
      verified: true,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Please verify your email first' },
        { status: 400 }
      );
    }

    // Check if OTP verification is still valid (within 5 minutes of verification)
    const verificationWindow = 5 * 60 * 1000; // 5 minutes
    if (otpRecord.expiresAt < new Date(Date.now() - verificationWindow)) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'Session expired. Please start the process again.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
