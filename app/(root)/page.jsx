import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Testing from "@/components/testing";
import { OrganizationSchema, WebsiteSchema } from "@/components/JsonLd";

export const metadata = {
  title: 'Loot My Vouchers - Claim Free Vouchers Daily | Best Deals & Promo Codes',
  description: 'Claim free vouchers daily from top brands like Amazon, Flipkart, Swiggy & more. Get exclusive discount codes, promo codes, and special offers. Save money on every purchase!',
  keywords: [
    'free vouchers',
    'discount codes',
    'promo codes',
    'coupon codes',
    'daily deals',
    'amazon vouchers',
    'flipkart vouchers',
    'swiggy vouchers',
    'online shopping deals',
    'free coupons india',
  ],
  alternates: {
    canonical: '/',
  },
};

const page = () => {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <div className="flex items-center justify-center flex-col h-[90vh] w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-yellow-500/20 text-primary text-[12px] md:text-sm font-medium mb-4 backdrop-blur-sm">
          <Star size={14} fill="currentColor" />
          <span>Over 10,000+ Vouchers Claimed Today</span>
        </div>
        <h1 className="text-8xl md:text-9xl font-bebas font-extrabold text-center ">
          Loot My Vouchers
        </h1>
        <p className="text-center font-raleway my-4 md:text-lg max-w-xl px-4  dark:text-neutral-300  ">
          Visit us before buying anything online. <br /> We might save you some
          money!
        </p>
        <div className="mt-2 relative md:w-full max-w-md px-4">
          <Input
            type="text"
            placeholder="Search Vouchers"
            className="pr-10 focus-visible:ring-primary focus-visible:border-primary"
          />
          <Search
            className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={18}
          />
        </div>

        <div className="flex gap-2 md:gap-10 mt-5">
          <Link  href="/vouchers">
            <Button variant="brand" className={`group cursor-pointer`} size="lg">

                View All Vouchers
                <ChevronRight
                  className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
            </Button>
          </Link>
        </div>

        <p className="text-sm text-zinc-500 pt-8 text-center">
          Trusted by savvy shoppers worldwide
          <br />
          No credit card required
        </p>
      </div>
      <Testing />
    </>
  );
};

export default page;
