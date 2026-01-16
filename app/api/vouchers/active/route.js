import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

// GET - Fetch all active vouchers (Public endpoint - no auth, no code)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';

    const currentDate = new Date();

    // Build query
    const query = {
      isActive: true,
      expiryDate: { $gte: currentDate },
    };

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add brand filter
    if (brand && brand !== 'all') {
      query.brand = brand;
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'expiring':
        sortOptions = { expiryDate: 1 }; // Expiring soon first
        break;
      case 'featured':
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'latest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    let vouchers = await Voucher.find(query)
      .populate('brand', 'name logo website')
      .populate('category', 'name icon slug')
      .select('-code')
      .sort(sortOptions);

    // Apply search filter (on populated fields)
    if (search) {
      const searchLower = search.toLowerCase();
      vouchers = vouchers.filter(
        (v) =>
          v.title?.toLowerCase().includes(searchLower) ||
          v.description?.toLowerCase().includes(searchLower) ||
          v.brand?.name?.toLowerCase().includes(searchLower) ||
          v.category?.name?.toLowerCase().includes(searchLower)
      );
    }

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
