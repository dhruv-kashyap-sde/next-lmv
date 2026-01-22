import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import { withAuth } from '@/lib/auth';

// GET - Fetch all vouchers (Admin only - includes codes)
export const GET = withAuth(
  async (request) => {
    try {
      await connectDB();

      const vouchers = await Voucher.find()
        .populate('brand', 'name logo')
        .populate('category', 'name icon')
        .populate('claimedBy', 'name email') // Include who claimed it
        .select('+code') // Include code field for admin
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: vouchers,
        count: vouchers.length,
      });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch vouchers',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// POST - Create a new voucher (Admin only)
export const POST = withAuth(
  async (request) => {
    try {
      await connectDB();

      const {
        title,
        description,
        code,
        brand,
        category,
        minOrderAmount,
        expiryDate,
        termsAndConditions,
        howToUse,
        image,
      } = await request.json();

      // Validation
      if (!title || !code || !brand || !category || !expiryDate) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
          },
          { status: 400 }
        );
      }

      if (!termsAndConditions || termsAndConditions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'At least one term or condition is required',
          },
          { status: 400 }
        );
      }

      if (!howToUse || howToUse.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'At least one step for how to use is required',
          },
          { status: 400 }
        );
      }

      // Check if voucher code already exists
      const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() }).select('+code');
      if (existingVoucher) {
        return NextResponse.json(
          {
            success: false,
            error: 'A voucher with this code already exists',
          },
          { status: 409 }
        );
      }

      // Create new voucher
      const voucher = await Voucher.create({
        title: title.trim(),
        description: description?.trim() || title.trim(),
        code: code.toUpperCase().trim(),
        brand,
        category,
        minOrder: minOrderAmount || 0,
        expiryDate: new Date(expiryDate),
        termsAndConditions,
        stepsToUse: howToUse,
        image,
        isActive: true,
        isFeatured: false,
      });

      // Populate brand and category
      await voucher.populate('brand', 'name logo');
      await voucher.populate('category', 'name icon');

      return NextResponse.json(
        {
          success: true,
          message: 'Voucher created successfully',
          data: voucher,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating voucher:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to create voucher',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// PUT - Update a voucher (Admin only)
export const PUT = withAuth(
  async (request) => {
    try {
      await connectDB();

      const {
        id,
        title,
        description,
        code,
        brand,
        category,
        minOrderAmount,
        expiryDate,
        termsAndConditions,
        howToUse,
        image,
        isActive,
        isFeatured,
      } = await request.json();

      // Validation
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voucher ID is required',
          },
          { status: 400 }
        );
      }

      // Check if voucher exists
      const voucher = await Voucher.findById(id);
      if (!voucher) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voucher not found',
          },
          { status: 404 }
        );
      }

      // Check if code is being changed and if it already exists
      if (code && code !== voucher.code) {
        const existingVoucher = await Voucher.findOne({
          _id: { $ne: id },
          code: code.toUpperCase(),
        }).select('+code');

        if (existingVoucher) {
          return NextResponse.json(
            {
              success: false,
              error: 'A voucher with this code already exists',
            },
            { status: 409 }
          );
        }
      }

      // Update voucher
      if (title) voucher.title = title.trim();
      if (description !== undefined) voucher.description = description.trim();
      if (code) voucher.code = code.toUpperCase().trim();
      if (brand) voucher.brand = brand;
      if (category) voucher.category = category;
      if (minOrderAmount !== undefined) voucher.minOrder = minOrderAmount;
      if (expiryDate) voucher.expiryDate = new Date(expiryDate);
      if (termsAndConditions) voucher.termsAndConditions = termsAndConditions;
      if (howToUse) voucher.stepsToUse = howToUse;
      if (image !== undefined) voucher.image = image;
      if (isActive !== undefined) voucher.isActive = isActive;
      if (isFeatured !== undefined) voucher.isFeatured = isFeatured;

      await voucher.save();

      // Populate brand and category
      await voucher.populate('brand', 'name logo');
      await voucher.populate('category', 'name icon');

      return NextResponse.json({
        success: true,
        message: 'Voucher updated successfully',
        data: voucher,
      });
    } catch (error) {
      console.error('Error updating voucher:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to update voucher',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// DELETE - Delete a voucher (Admin only)
export const DELETE = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      // Validation
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voucher ID is required',
          },
          { status: 400 }
        );
      }

      // Check if voucher exists
      const voucher = await Voucher.findById(id);
      if (!voucher) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voucher not found',
          },
          { status: 404 }
        );
      }

      // Hard delete
      await Voucher.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'Voucher deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting voucher:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to delete voucher',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);