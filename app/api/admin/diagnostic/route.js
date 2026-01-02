import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {},
      database: {},
      errors: [],
    };

    // Check environment variables
    diagnostics.environment = {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      ADMIN_SETUP_SECRET: process.env.ADMIN_SETUP_SECRET ? '✅ Set' : '❌ Missing',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    };

    // Test database connection
    try {
      await connectDB();
      diagnostics.database.connection = '✅ Connected';
      
      // Try to access Admin model
      const Admin = (await import('@/models/Admin')).default;
      diagnostics.database.adminModel = '✅ Loaded';
      
      // Check if admin exists
      const adminCount = await Admin.countDocuments();
      diagnostics.database.adminCount = adminCount;
      diagnostics.database.adminExists = adminCount > 0 ? '⚠️ Admin already exists' : '✅ No admin exists';
      
    } catch (dbError) {
      diagnostics.database.connection = '❌ Failed';
      diagnostics.database.error = dbError.message;
      diagnostics.errors.push(`Database Error: ${dbError.message}`);
    }

    // Check for common issues
    if (!process.env.MONGODB_URI) {
      diagnostics.errors.push('MONGODB_URI is not set in .env.local');
    }
    if (!process.env.ADMIN_SETUP_SECRET) {
      diagnostics.errors.push('ADMIN_SETUP_SECRET is not set in .env.local');
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Diagnostic failed',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
