import { Button } from "@/components/ui/button";
import { Tag,
  Calendar,
  ShoppingCart, } from "lucide-react";

const VoucherCard = ({ voucher }) => {
  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  return (
    <div className="relative bg-sidebar/70 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
      {isExpiringSoon(voucher.expiryDate) && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          Expiring Soon!
        </span>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
        <img
          src={voucher.brand.logo}
          alt={voucher.brand.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-primary"
        />
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-bebas text-xl md:text-2xl text-primary mb-1">
            {voucher.brand.name}
          </h3>
          <p className="text-white font-semibold text-sm md:text-base line-clamp-2">
            {voucher.name}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
            <Tag className="w-3 h-3" />
            {voucher.category.name}
          </span>
          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
            {voucher.discount} OFF
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Min: ₹{voucher.minOrder}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(voucher.expiryDate).toLocaleDateString()}
          </span>
        </div>

        <div className="pt-3 border-t border-white/10">
          <Button
            onClick={() => setSelectedVoucher(voucher)}
            className="w-full "
            variant="brand"
          >
            Get Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
