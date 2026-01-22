"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Calendar,
  Gift,
  Clock,
  Star,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [points, setPoints] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchUserVouchers();
  }, []);

  const fetchUserVouchers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/vouchers', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?redirect=/user/dashboard&message=login_required');
          return;
        }
        throw new Error('Failed to fetch vouchers');
      }

      const data = await response.json();
      
      if (data.success) {
        setClaimedVouchers(data.data.vouchers);
        setTotalClaimed(data.data.totalClaimed);
        setPoints(data.data.points);
        setCanClaimToday(data.data.canClaimToday);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Failed to load your vouchers');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <main className="p-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gray-300">Welcome back!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 mb-8">
          <div className="bg-primary/10 flex flex-col justify-between relative border border-primary/30 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-4 h-4 md:w-8 md:h-8 text-primary" />
              <Badge className=" bg-primary text-black">Active</Badge>
            </div>
            <h3 className="text-gray-300 text-xs md:text-sm mb-1">
              Total Vouchers Claimed
            </h3>

            <p className="text-xl md:text-4xl font-bebas text-primary">{totalClaimed}</p>
          </div>

          <div className="bg-green-500/10 flex flex-col justify-between relative border border-green-500/30 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-4 h-4 md:w-8 md:h-8 text-green-400" />
              <Badge className=" bg-green-500/20 text-green-400 border-green-500/50">
                Earned
              </Badge>
            </div>
            <h3 className="text-gray-300 text-xs md:text-sm mb-1">
              Points Balance
            </h3>
            <p className="text-xl md:text-4xl font-bebas text-green-400">{points}</p>
          </div>

          <div
            className={`border flex flex-col justify-between relative ${
              canClaimToday
                ? "border-blue-500/30 bg-blue-500/10 "
                : "border-red-500/30 bg-red-500/10"
            } rounded-lg p-3 md:p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <Clock
                className={`w-4 h-4 md:w-8 md:h-8 ${
                  canClaimToday ? "text-blue-400" : "text-red-400/80"
                }`}
              />
              <Badge
                className={`${
                  canClaimToday
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    : "bg-red-500/20 text-red-400/80 border-red-500/50"
                }`}
              >
                {canClaimToday ? "Available" : "Used"}
              </Badge>
            </div>
            <h3 className="text-gray-300 text-xs md:text-sm mb-1">
              Today's Claim
            </h3>
            <p
              className={`text-xl md:text-4xl font-bebas ${
                canClaimToday ? "text-blue-400" : "text-red-400/80"
              }`}
            >
              {canClaimToday ? "Ready" : "Tomorrow"}
            </p>
          </div>
        </div>

        {/* Claim Voucher CTA */}
        {canClaimToday && (
          <div className=" bg-linear-to-t  md:bg-linear-to-l from-primary/20 to-background border border-primary/30 rounded-lg p-3 md:p-6 mb-8">
            <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bebas text-primary md:mb-2">
                  You can claim a voucher today!
                </h2>
                <p className="text-gray-300 text-xs md:text-sm">
                  Browse available vouchers and claim your daily deal
                </p>
              </div>
              <Button
                className="border-primary/50 font-bebas text-primary px-6 py-4 text-lg"
                onClick={() => router.push("/vouchers")}
                variant="secondary"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Browse Vouchers
              </Button>
            </div>
          </div>
        )}

        {/* Claimed Vouchers */}
        <div className="bg-white/5 border border-primary/50 rounded-lg p-3 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl my-2 md:my-0 font-bebas text-primary">
              My Claimed Vouchers
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary text-xs md:text-sm hover:text-primary/80"
              onClick={() => router.push("/vouchers")}
            >
              Browse Vouchers
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : claimedVouchers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {claimedVouchers.map((voucher, index) => (
                <div
                  key={voucher._id || index}
                  className={`bg-white/5 border ${
                    voucher.status === "expiring"
                      ? "border-yellow-500/50"
                      : voucher.status === "expired"
                      ? "border-red-600/50 opacity-60"
                      : "border-white/10"
                  } rounded-lg p-4 transition-colors`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {voucher.brand?.logo && (
                            <img
                              src={voucher.brand.logo}
                              alt={voucher.brand.name}
                              className="w-10 h-10 rounded-lg object-cover border border-primary/30"
                            />
                          )}
                          <div>
                            <h3 className="text-primary font-bebas text-xl">
                              {voucher.brand?.name || "Unknown Brand"}
                            </h3>
                            <p className="text-white text-sm">
                              {voucher.title}
                            </p>
                          </div>
                        </div>
                        {voucher.status === "expiring" && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                            Expiring Soon
                          </Badge>
                        )}
                        {voucher.status === "expired" && (
                          <Badge className="bg-red-500/20 text-red-400/80 border-red-500/50">
                            Expired
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 md:gap-6 text-sm text-muted-foreground mt-3">
                        <span className="flex text-xs items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Claimed:{" "}
                          {new Date(voucher.claimedAt).toLocaleDateString()}
                        </span>
                        <span className="flex text-xs items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Expires:{" "}
                          {voucher.expiresAt 
                            ? new Date(voucher.expiresAt).toLocaleDateString()
                            : "No Expiry"}
                        </span>
                      </div>
                    </div>

                    <div className="flex bg-background rounded-md border border-dashed border-primary flex-col justify-between">
                      <div className="border-b px-4 py-2">
                        <p className="text-xs text-gray-400 mb-1">
                          Voucher Code
                        </p>
                        <p className="font-mono text-primary font-bold text-lg">
                          {voucher.code}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10"
                        onClick={() => copyCode(voucher.code)}
                        disabled={voucher.status === "expired"}
                      >
                        {copiedCode === voucher.code ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Visit Website Button */}
                  {voucher.brand?.website && voucher.status !== "expired" && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => window.open(voucher.brand.website, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit {voucher.brand.name}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="font-bebas text-2xl text-gray-400 mb-2">
                No Vouchers Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start claiming vouchers to see them here
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 text-black font-bold"
                onClick={() => router.push("/vouchers")}
              >
                Browse Vouchers
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
