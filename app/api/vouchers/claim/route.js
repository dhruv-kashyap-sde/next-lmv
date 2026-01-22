import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Voucher from "@/models/Voucher";
import Redemption from "@/models/Redemption";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// Check if user can claim today (hasn't claimed in the last 24 hours)
function canClaimToday(lastClaimDate) {
  if (!lastClaimDate) return true;

  const lastClaim = new Date(lastClaimDate);
  const now = new Date();

  // Reset at midnight - compare dates only
  const lastClaimDay = new Date(
    lastClaim.getFullYear(),
    lastClaim.getMonth(),
    lastClaim.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return today > lastClaimDay;
}

// POST - Claim a voucher
export async function POST(request) {
  try {
    await connectDB();

    // Get auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Please login to claim voucher", code: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid session. Please login again.", code: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // Get voucher ID from request
    const { voucherId } = await request.json();

    if (!voucherId) {
      return NextResponse.json(
        { success: false, error: "Voucher ID is required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Your account has been deactivated", code: "ACCOUNT_INACTIVE" },
        { status: 403 }
      );
    }

    // Check if user can claim today
    if (!canClaimToday(user.lastVoucherClaim)) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily limit exceeded. Come back tomorrow!",
          code: "LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // Check if user already claimed this voucher
    const alreadyClaimed = user.claimedVouchers?.some(
      (cv) => cv.voucherId.toString() === voucherId
    );

    if (alreadyClaimed) {
      return NextResponse.json(
        { success: false, error: "You have already claimed this voucher", code: "ALREADY_CLAIMED" },
        { status: 400 }
      );
    }

    // Get voucher with code
    const voucher = await Voucher.findById(voucherId)
      .select("+code")
      .populate("brand", "name logo website");

    if (!voucher) {
      return NextResponse.json(
        { success: false, error: "Voucher not found" },
        { status: 404 }
      );
    }

    if (!voucher.isActive) {
      return NextResponse.json(
        { success: false, error: "This voucher is no longer available" },
        { status: 400 }
      );
    }

    // Check if voucher is already claimed by someone else
    if (voucher.claimedBy) {
      return NextResponse.json(
        { success: false, error: "This voucher has already been claimed", code: "VOUCHER_TAKEN" },
        { status: 400 }
      );
    }

    // Check if voucher is expired
    if (voucher.expiryDate && new Date(voucher.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, error: "This voucher has expired" },
        { status: 400 }
      );
    }

    // Mark voucher as claimed (so it won't show to other users)
    voucher.claimedBy = user._id;
    voucher.claimedAt = new Date();
    await voucher.save();

    // Claim the voucher - add to user's claimed vouchers
    user.claimedVouchers.push({
      voucherId: voucher._id,
      claimedAt: new Date(),
      code: voucher.code,
      expiresAt: voucher.expiryDate,
    });
    user.lastVoucherClaim = new Date();
    user.points = (user.points || 0) + 10; // Award points for claiming
    await user.save();

    // Also create a redemption record for analytics
    await Redemption.create({
      userId: user._id,
      voucherId: voucher._id,
      ClaimedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Voucher claimed successfully!",
      data: {
        code: voucher.code,
        voucherTitle: voucher.title,
        brandName: voucher.brand?.name,
        brandLogo: voucher.brand?.logo,
        brandWebsite: voucher.brand?.website,
        expiresAt: voucher.expiryDate,
        pointsEarned: 10,
      },
    });
  } catch (error) {
    console.error("Claim voucher error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to claim voucher" },
      { status: 500 }
    );
  }
}

// GET - Check claim status for a voucher
export async function GET(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        canClaimToday: false,
        claimedVoucherIds: [],
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        canClaimToday: false,
        claimedVoucherIds: [],
      });
    }

    const user = await User.findById(decoded.userId).select(
      "lastVoucherClaim claimedVouchers isActive"
    );

    if (!user || !user.isActive) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        canClaimToday: false,
        claimedVoucherIds: [],
      });
    }

    const claimedVoucherIds = user.claimedVouchers?.map((cv) =>
      cv.voucherId.toString()
    ) || [];

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      canClaimToday: canClaimToday(user.lastVoucherClaim),
      claimedVoucherIds,
    });
  } catch (error) {
    console.error("Check claim status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check claim status" },
      { status: 500 }
    );
  }
}
