import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth } from '@/lib/auth';

// GET - Fetch all users (Admin only)
export const GET = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search');
      const role = searchParams.get('role');
      const status = searchParams.get('status');
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 20;
      const skip = (page - 1) * limit;

      // Build query
      const query = {};

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Role filter
      if (role && role !== 'all') {
        query.role = role;
      }

      // Status filter
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      // Get total count
      const total = await User.countDocuments(query);

      // Fetch users
      const users = await User.find(query)
        .select('-password -verificationToken -verificationTokenExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Calculate voucher count for each user
      const usersWithStats = users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        provider: user.provider,
        image: user.image,
        points: user.points,
        vouchersCount: user.claimedVouchers?.length || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return NextResponse.json({
        success: true,
        data: usersWithStats,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch users',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// POST - Create a new user (Admin only)
export const POST = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { name, email, password, role, isActive } = await request.json();

      // Validation
      if (!name || !email) {
        return NextResponse.json(
          {
            success: false,
            error: 'Name and email are required',
          },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'A user with this email already exists',
          },
          { status: 409 }
        );
      }

      // Create user data
      const userData = {
        name,
        email: email.toLowerCase(),
        role: role || 'user',
        isActive: isActive !== undefined ? isActive : true,
        emailVerified: true, // Admin-created users are pre-verified
        provider: 'credentials',
      };

      // If password is provided, include it
      if (password) {
        userData.password = password;
      }

      // Create new user
      const user = await User.create(userData);

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create user',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// PUT - Update a user (Admin only)
export const PUT = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { id, name, email, role, isActive, points } = await request.json();

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: 'User ID is required',
          },
          { status: 400 }
        );
      }

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'User not found',
          },
          { status: 404 }
        );
      }

      // Check if email is being changed and already exists
      if (email && email.toLowerCase() !== user.email) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              error: 'A user with this email already exists',
            },
            { status: 409 }
          );
        }
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase();
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
      if (points !== undefined) user.points = points;

      await user.save();

      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          points: user.points,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update user',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// DELETE - Delete a user (Admin only)
export const DELETE = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: 'User ID is required',
          },
          { status: 400 }
        );
      }

      // Find user
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'User not found',
          },
          { status: 404 }
        );
      }

      // Prevent deleting the current admin
      if (user._id.toString() === request.user.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete your own account',
          },
          { status: 400 }
        );
      }

      await User.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete user',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);
