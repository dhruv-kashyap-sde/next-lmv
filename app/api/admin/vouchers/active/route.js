import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

// GET - Fetch all active vouchers (Public endpoint - no auth, no code)
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
      .sort({ isFeatured: -1, createdAt: -1 }); // Featured first, then newest

    return NextResponse.json({
      success: true,
      data: vouchers,
      count: vouchers.length,
    });
  } catch (error) {
    console.error('Error fetching active vouchers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vouchers',
      },
      { status: 500 }
    );
  }
}
