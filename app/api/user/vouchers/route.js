import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Voucher from "@/models/Voucher";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// GET - Get user's claimed vouchers
export async function GET(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Please login to view your vouchers" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId)
      .select("claimedVouchers lastVoucherClaim points")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get detailed voucher info for each claimed voucher
    const claimedVouchersWithDetails = await Promise.all(
      (user.claimedVouchers || []).map(async (claimed) => {
        const voucher = await Voucher.findById(claimed.voucherId)
          .populate("brand", "name logo website")
          .populate("category", "name")
          .lean();

        if (!voucher) return null;

        // Determine status
        const now = new Date();
        const expiresAt = new Date(claimed.expiresAt);
        const daysUntilExpiry = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
        
        let status = "active";
        if (expiresAt < now) {
          status = "expired";
        } else if (daysUntilExpiry <= 3) {
          status = "expiring";
        }

        return {
          _id: claimed.voucherId,
          title: voucher.title,
          description: voucher.description,
          code: claimed.code,
          claimedAt: claimed.claimedAt,
          expiresAt: claimed.expiresAt,
          status,
          brand: voucher.brand,
          category: voucher.category,
          minOrder: voucher.minOrder,
        };
      })
    );

    // Filter out null values (deleted vouchers)
    const validVouchers = claimedVouchersWithDetails.filter(Boolean);

    // Sort by claimed date (newest first)
    validVouchers.sort((a, b) => new Date(b.claimedAt) - new Date(a.claimedAt));

    // Check if user can claim today
    const canClaimToday = checkCanClaimToday(user.lastVoucherClaim);

    return NextResponse.json({
      success: true,
      data: {
        vouchers: validVouchers,
        totalClaimed: validVouchers.length,
        points: user.points || 0,
        canClaimToday,
      },
    });
  } catch (error) {
    console.error("Get user vouchers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get vouchers" },
      { status: 500 }
    );
  }
}

function checkCanClaimToday(lastClaimDate) {
  if (!lastClaimDate) return true;

  const lastClaim = new Date(lastClaimDate);
  const now = new Date();

  const lastClaimDay = new Date(
    lastClaim.getFullYear(),
    lastClaim.getMonth(),
    lastClaim.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return today > lastClaimDay;
}
