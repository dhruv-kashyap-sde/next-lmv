import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { generateToken } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOtp = otp.trim();

    // Find OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: 'signup',
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Verification code expired or not found. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await otpRecord.verifyOtp(normalizedOtp);

    if (!isValid) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = otpRecord.maxAttempts - otpRecord.attempts;
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          remainingAttempts,
        },
        { status: 400 }
      );
    }

    // Check if user already exists (edge case: concurrent signup)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Create user with stored data
    const user = await User.create({
      name: otpRecord.userData.name,
      email: normalizedEmail,
      password: otpRecord.userData.password,
      provider: 'credentials',
      emailVerified: true, // Email is verified via OTP
      isActive: true,
    });

    // Delete OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set auth cookie
    return setAuthCookie(response, token);
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
