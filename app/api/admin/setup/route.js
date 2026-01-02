import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

// This route should be protected in production or disabled after initial setup
export async function POST(request) {
  try {
    console.log('🔧 Admin setup started...');
    
    // Check environment variables first
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return NextResponse.json(
        { error: 'Database configuration missing. Please set MONGODB_URI in .env.local' },
        { status: 500 }
      );
    }

    if (!process.env.ADMIN_SETUP_SECRET) {
      console.error('❌ ADMIN_SETUP_SECRET not found in environment variables');
      return NextResponse.json(
        { error: 'Setup secret missing. Please set ADMIN_SETUP_SECRET in .env.local' },
        { status: 500 }
      );
    }

    console.log('✅ Environment variables loaded');
    
    await connectDB();
    console.log('✅ Database connected');

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      return NextResponse.json(
        { error: 'Admin already exists. This route is disabled.' },
        { status: 403 }
      );
    }
    console.log('✅ No existing admin found');

    const { name, email, password, secretKey } = await request.json();
    console.log('📝 Received data:', { name, email, hasPassword: !!password, hasSecretKey: !!secretKey });

    // Simple secret key check (you should use an environment variable)
    if (secretKey !== process.env.ADMIN_SETUP_SECRET) {
      console.error('❌ Invalid secret key provided');
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 }
      );
    }
    console.log('✅ Secret key validated');

    // Validate input
    if (!name || !email || !password) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    console.log('✅ All fields validated');

    // Create first admin with super_admin permission
    console.log('🔨 Creating admin...');
    const admin = await Admin.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
      permissions: ['super_admin', 'manage_users', 'manage_vouchers', 'manage_brands', 'manage_categories', 'view_analytics'],
      isActive: true,
    });
    console.log('✅ Admin created successfully:', admin._id);

    return NextResponse.json(
      {
        success: true,
        message: 'Initial admin created successfully',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          permissions: admin.permissions,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Admin setup error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin', details: error.toString() },
      { status: 500 }
    );
  }
}
