import { Skeleton } from "@/components/ui/skeleton";

export function VoucherCardSkeleton() {
  return (
    <div className="relative bg-sidebar/70 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
      {/* Brand logo and name */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 text-center md:text-left space-y-2">
          <Skeleton className="h-6 w-24 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-48 mx-auto md:mx-0" />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Min order and expiry */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Button */}
        <div className="pt-3 border-t border-white/10">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function VoucherGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <VoucherCardSkeleton key={index} />
      ))}
    </div>
  );
}
