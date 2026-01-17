import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import Brand from '@/models/Brand';
import Category from '@/models/Category';

// GET - Fetch latest 9 active vouchers (Public endpoint - no auth, no code)
export async function GET(request) {
  try {
    await connectDB();

    const currentDate = new Date();

    const vouchers = await Voucher.find({
      isActive: true,
      expiryDate: { $gte: currentDate }, // Only non-expired vouchers
    })
      .populate('brand', 'name logo website')
      .populate('category', 'name icon slug')
      .select('-code') // Exclude code field
      .sort({ createdAt: -1 }) // Latest first
      .limit(9); // Only 9 vouchers

    return NextResponse.json({
      success: true,
      data: vouchers,
      count: vouchers.length,
    });
  } catch (error) {
    console.error('Error fetching latest vouchers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vouchers',
      },
      { status: 500 }
    );
  }
}
