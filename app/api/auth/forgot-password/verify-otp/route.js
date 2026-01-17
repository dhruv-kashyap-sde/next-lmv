import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Otp from '@/models/Otp';

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

    // Find OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: 'password-reset',
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await otpRecord.verifyOtp(otp);

    if (!isValid) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remainingAttempts = otpRecord.maxAttempts - otpRecord.attempts;
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.` 
        },
        { status: 400 }
      );
    }

    // Mark OTP as verified (don't delete yet, will be used in reset-password)
    otpRecord.verified = true;
    await otpRecord.save();

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully. You can now reset your password.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
