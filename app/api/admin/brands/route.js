import { withAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const brands = await Brand.find({}).select(
      "name logo website isActive isFeatured createdAt updatedAt"
    );
    return NextResponse.json(
      {
        success: true,
        data: brands,
        count: brands.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch brands",
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { name, logo, website } = await request.json();

      // Validation
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand name is required",
          },
          { status: 400 }
        );
      }

      const existingBrand = await Brand.findOne({ name: name.trim() });

      if (existingBrand) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand with this name already exists",
          },
          { status: 400 }
        );
      }

      // Create new brand
      const newBrand = new Brand({
        name: name.trim(),
        logo,
        website,
        isActive: true,
        isFeatured: false,
      });
      await newBrand.save();

      return NextResponse.json(
        {
          success: true,
          message: "Brand created successfully",
          data: newBrand,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating brand:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to create brand",
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: "admin" }
);

// PUT - Update a brand (Admin only)
export const PUT = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { id, name, logo, website, isActive, isFeatured } =
        await request.json();

      // Validation
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand ID is required",
          },
          { status: 400 }
        );
      }

      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand name is required",
          },
          { status: 400 }
        );
      }

      // Check if brand exists
      const brand = await Brand.findById(id);
      if (!brand) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand not found",
          },
          { status: 404 }
        );
      }

      // Check if another brand with the same name exists
      const duplicateBrand = await Brand.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      });

      if (duplicateBrand) {
        return NextResponse.json(
          {
            success: false,
            error: "A brand with this name already exists",
          },
          { status: 409 }
        );
      }

      // Update brand
      brand.name = name.trim();
      if (logo !== undefined) brand.logo = logo;
      if (website !== undefined) brand.website = website;
      if (isActive !== undefined) brand.isActive = isActive;
      if (isFeatured !== undefined) brand.isFeatured = isFeatured;

      await brand.save();

      return NextResponse.json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to update brand",
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: "admin" }
);

// DELETE - Delete a brand (Admin only)
export const DELETE = withAuth(
  async (request) => {
    try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      // Validation
      if (!id) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand ID is required",
          },
          { status: 400 }
        );
      }

      // Check if brand exists
      const brand = await Brand.findById(id);
      if (!brand) {
        return NextResponse.json(
          {
            success: false,
            error: "Brand not found",
          },
          { status: 404 }
        );
      }

      // Hard delete - permanently remove the brand
      await Brand.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: "Brand deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to delete brand",
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: "admin" }
);
