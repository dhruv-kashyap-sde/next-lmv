import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { sendOtpEmail } from '@/lib/otp-email';

const OTP_COOLDOWN_MS = 60 * 1000; // 1 minute between requests
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes validity

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Please provide your email address' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a verification code',
        expiresIn: OTP_EXPIRY_MS / 1000,
      });
    }

    // Check if user signed up with OAuth (no password)
    if (existingUser.provider && existingUser.provider !== 'credentials') {
      return NextResponse.json(
        { success: false, error: `This account uses ${existingUser.provider} sign-in. Please use that method to login.` },
        { status: 400 }
      );
    }

    // Check for recent OTP request (rate limiting)
    const recentOtp = await Otp.findOne({
      email: normalizedEmail,
      purpose: 'password-reset',
      createdAt: { $gte: new Date(Date.now() - OTP_COOLDOWN_MS) },
    });

    if (recentOtp) {
      const waitTime = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - recentOtp.createdAt)) / 1000);
      return NextResponse.json(
        { 
          success: false, 
          error: `Please wait ${waitTime} seconds before requesting a new code`,
          retryAfter: waitTime,
        },
        { status: 429 }
      );
    }

    // Delete any existing OTP for this email
    await Otp.deleteMany({ email: normalizedEmail, purpose: 'password-reset' });

    // Generate new OTP
    const otpCode = Otp.generateOtp();

    // Create OTP record
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
      purpose: 'password-reset',
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    // Send OTP email
    const emailResult = await sendOtpEmail(
      normalizedEmail, 
      otpCode, 
      existingUser.name,
      'Reset Your Password'
    );

    if (!emailResult.success) {
      await Otp.deleteMany({ email: normalizedEmail, purpose: 'password-reset' });
      return NextResponse.json(
        { success: false, error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: OTP_EXPIRY_MS / 1000,
    });
  } catch (error) {
    console.error('Forgot password send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
