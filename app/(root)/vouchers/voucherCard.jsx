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
      <div className="relative bg-sidebar/70 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
        {isExpiringSoon(voucher.expiryDate) && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            Expiring Soon!
          </span>
        )}

        {voucher.isFeatured && (
          <span className="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
          <img
            src={brandLogo}
            alt={brandName}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bebas text-xl md:text-2xl text-primary mb-1">
              {brandName}
            </h3>
            <p className="text-white font-semibold text-sm md:text-base line-clamp-2">
              {voucherTitle}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              {categoryName}
            </span>
          </div>

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
              className="w-full"
              variant="brand"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Voucher Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md bg-sidebar border-white/10">
          <DialogHeader>
            <DialogTitle className="text-primary font-bebas text-2xl">
              {voucherTitle}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {brandName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {voucher.description && (
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">
                  Description
                </h4>
                <p className="text-gray-300 text-sm">{voucher.description}</p>
              </div>
            )}
            {voucher.termsAndConditions && (
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">
                  Terms & Conditions
                </h4>
                <p className="text-gray-300 text-sm">
                  {voucher.termsAndConditions}
                </p>
              </div>
            )}
            {voucher.stepsToUse && voucher.stepsToUse.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">
                  How to Use
                </h4>
                <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
                  {voucher.stepsToUse.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex items-center justify-between text-sm border-t border-white/10 pt-4">
              <span className="text-gray-400">
                Min Order: ₹{voucher.minOrder || 0}
              </span>
              <span className="text-gray-400">
                Expires:{" "}
                {voucher.expiryDate
                  ? new Date(voucher.expiryDate).toLocaleDateString()
                  : "No Expiry"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherCard;
