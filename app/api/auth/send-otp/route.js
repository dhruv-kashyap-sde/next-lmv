import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { sendOtpEmail } from '@/lib/otp-email';

// Rate limiting: max 3 OTP requests per email per 15 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 1 minute between requests
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes validity

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
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

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check for recent OTP request (rate limiting)
    const recentOtp = await Otp.findOne({
      email: normalizedEmail,
      purpose: 'signup',
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
    await Otp.deleteMany({ email: normalizedEmail, purpose: 'signup' });

    // Generate new OTP
    const otpCode = Otp.generateOtp();

    // Create OTP record with pending user data
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
      purpose: 'signup',
      userData: {
        name: name.trim(),
        password, // Will be hashed when user is created
      },
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    // Send OTP email
    const emailResult = await sendOtpEmail(normalizedEmail, otpCode, name);

    if (!emailResult.success) {
      // Clean up OTP if email failed
      await Otp.deleteMany({ email: normalizedEmail, purpose: 'signup' });
      return NextResponse.json(
        { success: false, error: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: OTP_EXPIRY_MS / 1000, // seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
