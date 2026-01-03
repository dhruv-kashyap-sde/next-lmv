import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { withAuth } from '@/lib/auth';

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

// GET - Fetch all categories (Public endpoint - no auth required)
export async function GET(request) {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('name slug icon isActive createdAt updatedAt');

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

// POST - Create a new category (Admin only)
export const POST = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { name, icon } = await request.json();

      // Validation
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category name is required',
          },
          { status: 400 }
        );
      }

      // Check if category already exists
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            error: 'A category with this name already exists',
          },
          { status: 409 }
        );
      }

      // Generate slug from name
      const slug = generateSlug(name);

      // Create new category
      const category = await Category.create({
        name: name.trim(),
        slug,
        icon,
        isActive: true,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Category created successfully',
          data: category,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to create category',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// PUT - Update a category (Admin only)
export const PUT = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { id, name, icon, isActive } = await request.json();

      // Validation
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category ID is required',
          },
          { status: 400 }
        );
      }

      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category name is required',
          },
          { status: 400 }
        );
      }

      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category not found',
          },
          { status: 404 }
        );
      }

      // Check if another category with the same name exists
      const duplicateCategory = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (duplicateCategory) {
        return NextResponse.json(
          {
            success: false,
            error: 'A category with this name already exists',
          },
          { status: 409 }
        );
      }

      // Update category
      const trimmedName = name.trim();
      if (category.name !== trimmedName) {
        category.name = trimmedName;
        category.slug = generateSlug(trimmedName);
      }
      if (icon !== undefined) category.icon = icon;
      if (isActive !== undefined) category.isActive = isActive;

      await category.save();

      return NextResponse.json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to update category',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);

// DELETE - Delete a category (Admin only)
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
            error: 'Category ID is required',
          },
          { status: 400 }
        );
      }

      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category not found',
          },
          { status: 404 }
        );
      }

      await Category.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to delete category',
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: 'admin' }
);
