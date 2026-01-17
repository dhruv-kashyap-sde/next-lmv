import { Button } from "@/components/ui/button";
import { Tag, Calendar, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";

const VoucherCard = ({ voucher }) => {
  const [showDetails, setShowDetails] = useState(false);

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
            {voucher.termsAndConditions && (
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  Terms & Conditions
                </h4>
                <p className="text-gray-300 text-sm">
                  {voucher.termsAndConditions}
                </p>
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
            >
              Claim for today
            </Button>
            <p className="text-xs text-muted-foreground text-center">By proceeding, you agree to the <Link href="/terms-and-conditions" className="text-primary">Terms and Conditions</Link>.</p>
          </div></div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherCard;
