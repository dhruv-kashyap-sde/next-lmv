import { Button } from "@/components/ui/button";
import { Tag, Calendar, ShoppingCart, Lock, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const VoucherCard = ({ voucher, isLoggedIn, canClaimToday, claimedVoucherIds = [], onClaimSuccess }) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [claimLoading, setClamLoading] = useState(false);
  const [claimedData, setClaimedData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false); // Track if just claimed in this session

  // Check if this voucher is already claimed
  const isAlreadyClaimed = claimedVoucherIds.includes(voucher._id) || justClaimed;

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  // Handle cases where brand or category might not be populated
  const brandName = voucher.brand?.name || "Unknown Brand";
  const brandLogo = voucher.brand?.logo || "/placeholder-brand.png";
  const categoryName = voucher.category?.name || "General";
  const voucherTitle = voucher.title || voucher.name || "Special Offer";

  const handleClaimForToday = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please login to claim voucher");
      setShowDetails(false);
      router.push("/login?redirect=/vouchers&message=login_required");
      return;
    }

    // Check if user can claim today
    if (!canClaimToday) {
      toast.error("Daily limit exceeded. Come back tomorrow!");
      return;
    }

    // Check if already claimed
    if (isAlreadyClaimed) {
      toast.info("You have already claimed this voucher");
      return;
    }

    setClamLoading(true);
    try {
      const response = await fetch("/api/vouchers/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId: voucher._id }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === "NOT_AUTHENTICATED" || data.code === "INVALID_TOKEN") {
          toast.error("Please login to claim voucher");
          setShowDetails(false);
          router.push("/login?redirect=/vouchers&message=login_required");
          return;
        }
        if (data.code === "LIMIT_EXCEEDED") {
          toast.error("Daily limit exceeded. Come back tomorrow!");
          return;
        }
        if (data.code === "ALREADY_CLAIMED") {
          toast.info("You have already claimed this voucher");
          return;
        }
        if (data.code === "VOUCHER_TAKEN") {
          toast.error("Sorry, this voucher was just claimed by another user");
          setShowDetails(false);
          // Refresh the page to get updated voucher list
          if (onClaimSuccess) onClaimSuccess();
          return;
        }
        throw new Error(data.error || "Failed to claim voucher");
      }

      // Success - show the code dialog
      setClaimedData(data.data);
      setJustClaimed(true); // Mark as claimed locally
      setShowDetails(false);
      setShowSuccessDialog(true);
      toast.success("Voucher claimed successfully! +10 points");
      
      // Call the callback to refresh parent state
      if (onClaimSuccess) {
        onClaimSuccess();
      }
    } catch (error) {
      console.error("Claim error:", error);
      toast.error(error.message || "Failed to claim voucher");
    } finally {
      setClamLoading(false);
    }
  };

  const copyCode = async () => {
    if (claimedData?.code) {
      await navigator.clipboard.writeText(claimedData.code);
      setIsCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Get button text and state for "Claim for today" button
  const getClaimButtonContent = () => {
    if (claimLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Claiming...
        </>
      );
    }
    if (isAlreadyClaimed) {
      return (
        <>
          <Check className="w-4 h-4 mr-2" />
          Already Claimed
        </>
      );
    }
    if (isLoggedIn && !canClaimToday) {
      return (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Limit Exceeded
        </>
      );
    }
    return "Claim for today";
  };

  const isClaimDisabled = claimLoading || isAlreadyClaimed || (isLoggedIn && !canClaimToday);

  return (
    <>
      <div className="relative bg-sidebar/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
        {isExpiringSoon(voucher.expiryDate) && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10">
            Expiring Soon!
          </span>
        )}

        {voucher.isFeatured && (
          <span className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full z-10">
            Featured
          </span>
        )}

        {isAlreadyClaimed && (
          <span className="absolute top-2 left-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
            <Check className="w-3 h-3 inline mr-1" />
            Claimed
          </span>
        )}

        {/* Mobile Card Rectangle */}
        <div className="md:hidden p-4 space-y-3">
          {/* Logo + Title */}
          <div className="flex relative items-center gap-3">
            <img
              src={brandLogo}
              alt={brandName}
              className="w-12 h-12 rounded-lg object-cover border border-primary/50 shrink-0"
            />
            <div>
              <h3 className="font-bebas text-lg text-primary line-clamp-2 flex-1">
                {voucherTitle}
              </h3>
              <p className="text-xs text-gray-400">{brandName}</p>
            </div>
            <span className="inline-flex absolute top-0 right-0 items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              {categoryName}
            </span>
          </div>

          {/* Date/Min Order + Button */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="flex flex-col gap-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {voucher.expiryDate
                  ? new Date(voucher.expiryDate).toLocaleDateString()
                  : "No Expiry"}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                Min: ₹{voucher.minOrder || 0}
              </span>
            </div>
            <Button
              onClick={() => setShowDetails(true)}
              size="sm"
              variant="secondary"
              className="shrink-0 text-xs border border-primary/50"
            >
              Claim
            </Button>
          </div>
        </div>

        {/* Desktop Card Square */}
        <div className="hidden md:block p-4">
          <div className="flex relative flex-row items-start gap-4 mb-4">
            <img
              src={brandLogo}
              alt={brandName}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div className="text-left">
              <h3 className="font-bebas text-2xl text-primary">
                {voucherTitle}
              </h3>
              <p className="text-foreground font-semibold text-base line-clamp-2">
                {brandName}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center absolute top-2 right-2 gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                Min: ₹{voucher.minOrder || 0}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {voucher.expiryDate
                  ? new Date(voucher.expiryDate).toLocaleDateString()
                  : "No Expiry"}
              </span>
            </div>

            <div className="pt-3 border-t border-white/10">
              <Button
                onClick={() => setShowDetails(true)}
                className="w-full "
                variant="secondary"
              >
                Claim
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md bg-sidebar border">
          <DialogHeader className={"text-left border-b"}>
            <DialogTitle className="text-primary font-bebas text-2xl">
              {voucherTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {voucher.description && (
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  Description
                </h4>
                <p className="text-gray-300 text-sm">{voucher.description}</p>
              </div>
            )}
            {voucher.termsAndConditions && voucher.termsAndConditions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  Terms & Conditions
                </h4>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  {Array.isArray(voucher.termsAndConditions) 
                    ? voucher.termsAndConditions.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))
                    : <li>{voucher.termsAndConditions}</li>
                  }
                </ul>
              </div>
            )}
            {voucher.stepsToUse && voucher.stepsToUse.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  How to Use
                </h4>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                  {voucher.stepsToUse.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex items-center border-b pb-2 justify-between text-sm ">
              <span className="">Min Order: ₹{voucher.minOrder || 0}</span>
              <span className="">
                Expires:{" "}
                {voucher.expiryDate
                  ? new Date(voucher.expiryDate).toLocaleDateString()
                  : "No Expiry"}
              </span>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full cursor-pointer"
                variant="secondary"
                onClick={handleClaimForToday}
                disabled={isClaimDisabled}
              >
                {getClaimButtonContent()}
              </Button>
              {isLoggedIn && !canClaimToday && !isAlreadyClaimed && (
                <p className="text-xs text-red-400 text-center">
                  Daily limit exceeded. Come back tomorrow!
                </p>
              )}
              <p className="text-xs text-muted-foreground text-center">
                By proceeding, you agree to the{" "}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms and Conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog - Shows the claimed code */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md bg-sidebar border border-green-500/30">
          <DialogHeader className="text-center border-b pb-4">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <DialogTitle className="text-green-500 font-bebas text-2xl">
              Voucher Claimed!
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You earned +10 points for claiming this voucher
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Brand Info */}
            <div className="flex items-center gap-3">
              {claimedData?.brandLogo && (
                <img
                  src={claimedData.brandLogo}
                  alt={claimedData.brandName}
                  className="w-12 h-12 rounded-lg object-cover border border-primary/50"
                />
              )}
              <div>
                <h3 className="font-bebas text-lg text-primary">
                  {claimedData?.voucherTitle}
                </h3>
                <p className="text-sm text-gray-400">{claimedData?.brandName}</p>
              </div>
            </div>

            {/* Voucher Code */}
            <div className="bg-zinc-900 border border-dashed border-primary rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2 text-center">Your Voucher Code</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-2xl text-primary font-bold tracking-wider flex-1 text-center">
                  {claimedData?.code}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10"
                  onClick={copyCode}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Expiry Info */}
            {claimedData?.expiresAt && (
              <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                Expires: {new Date(claimedData.expiresAt).toLocaleDateString()}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {claimedData?.brandWebsite && (
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => window.open(claimedData.brandWebsite, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to {claimedData.brandName}
                </Button>
              )}
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push("/user/dashboard");
                }}
              >
                View My Vouchers
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherCard;
