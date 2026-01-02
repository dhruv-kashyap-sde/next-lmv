import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Testing from "@/components/testing";

const page = () => {

  return (
    <>
      <div className="flex items-center justify-center flex-col h-screen w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-yellow-500/20 text-primary text-[12px] md:text-sm font-medium mb-4 backdrop-blur-sm">
          <Star size={14} fill="currentColor" />
          <span>Over 10,000+ Vouchers Claimed Today</span>
        </div>
        <h1 className="text-8xl md:text-9xl font-bebas font-extrabold text-center ">
          Loot My Vouchers
        </h1>
        <p className="text-center font-raleway my-4 md:text-lg max-w-xl px-4  dark:text-neutral-300  ">
          Visit us before buying anything online. <br /> We might save you some money!
        </p>
        <div className="mt-2 relative md:w-full max-w-md px-4">
          <Input 
            type="text" 
            placeholder="Search Vouchers" 
            className="pr-10 focus-visible:ring-primary focus-visible:border-primary"
          />
          <Search className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18}/>
        </div>

        <div className="flex gap-2 md:gap-10 mt-5">
          <Button asChild variant="brand" size="lg">
            <Link href="/vouchers">Explore </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
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
