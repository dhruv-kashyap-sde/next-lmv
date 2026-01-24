import React from "react";
import {
  CheckCircle,
  Info,
  Shield,
  Zap,
  BadgeCheck,
  Heart,
  AlertTriangle,
  Building2,
} from "lucide-react";
import Faqs from "@/components/faqs";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn about Loot My Vouchers - your trusted platform for genuine vouchers and discount codes. We share authentic deals from popular brands to help you save money on every purchase.",
  keywords: [
    "about lmv",
    "voucher platform",
    "discount codes",
    "genuine vouchers",
    "verified deals",
    "money saving",
    "about us",
    "loot my vouchers",
  ],
  openGraph: {
    title: "About Us - Loot My Vouchers",
    description: "Discover how LMV helps you save money with verified vouchers from popular brands. 100% secure and instant access to genuine deals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Loot My Vouchers",
    description: "Learn about LMV - your trusted platform for verified vouchers and discount codes from popular brands.",
  },
  alternates: {
    canonical: "/about",
  },
};

const About = () => {

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "All vouchers are verified and secure",
      color: "text-blue-500",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Get vouchers immediately after signup",
      color: "text-green-500",
    },
    {
      icon: BadgeCheck,
      title: "Verified Deals",
      description: "All deals are genuine and tested",
      color: "text-yellow-500",
    },
  ];

  const voucherInfo = [
    // {
    //   text: "I have ",
    //   chip: { label: "Earned", color: "bg-primary text-black" },
    //   text2: " these vouchers through making transactions on ",
    //   chip2: { label: "Paytm", color: "bg-background text-primary" },
    // },
    {
      text: "These vouchers are ",
      chip: { label: "SHARED", color: "bg-primary text-black" },
      text2: " as they are no use of mine",
    },
    {
      text: "I do not have any ",
      chip: { label: "partnership", color: "bg-primary text-black" },
      text2: " with mentioned companies/brands",
    },
    {
      text: "I do not get any ",
      chip: { label: "benefits", color: "bg-primary text-black" },
      text2: " from mentioned companies/brands",
    },
    {
      text: "These vouchers might be beneficiary for the companies ",
      chip: {
        label: "by increasing their sales",
        color: "bg-primary text-black",
      },
    },
  ];


  return (
    <div className="w-full">
      {/* About Section */}
      <div
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-bebas text-[10vw] md:text-[7vw] mb-4 md:mb-6 text-primary">
            About Us
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-4">
            We're passionate about helping you save money by sharing vouchers
            and deals. Our platform connects users with genuine discounts across
            hundreds of popular brands.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:bg-white/10"
              >
                <IconComponent
                  className={`w-12 h-12 md:w-16 md:h-16 ${feature.color} mx-auto mb-4`}
                  strokeWidth={1.5}
                />
                <h3 className="font-bebas text-2xl md:text-3xl mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How to Get Vouchers */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 mb-12 md:mb-16 shadow-lg">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <Info className="w-7 h-7 md:w-9 md:h-9 text-primary shrink-0" />
            <h3 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-primary">
              Why we provide these vouchers for free?
            </h3>
          </div>

          <div className="space-y-3 md:space-y-4">
            {voucherInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 md:gap-4 bg-white/5 rounded-lg p-4 md:p-5 shadow-sm border border-white/5 hover:bg-white/10 transition-colors duration-200"
              >
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed font-normal flex-1">
                  {item.text}
                  <span
                    className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-md text-xs md:text-sm font-medium mx-1 ${item.chip.color}`}
                  >
                    {item.chip.label}
                  </span>
                  {item.text2}
                  {item.chip2 && (
                    <span
                      className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-md text-xs md:text-sm font-medium mx-1 ${item.chip2.color}`}
                    >
                      {item.chip2.label}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency Section */}
        <div className="bg-linear-to-br from-amber-500/10 via-transparent to-purple-500/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 mb-12 md:mb-16 shadow-lg">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <Heart className="w-7 h-7 md:w-9 md:h-9 text-red-400 shrink-0" />
            <h3 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-primary">
              Our Commitment to Transparency
            </h3>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm md:text-base text-gray-300">
              <span className="text-amber-200 font-medium">Important:</span> Loot My Vouchers is 
              <span className="text-primary font-medium"> NOT sponsored by any brand</span>. We operate 
              completely independently without any commercial partnerships or endorsements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Non-Profit Card */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <h4 className="font-bebas text-xl text-white">Non-Profit Initiative</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is a non-profit platform created solely to help users save money. We don't 
                charge for vouchers and don't receive payments from brands for listings.
              </p>
            </div>

            {/* Solo Developer Card */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="font-bebas text-xl text-white">Solo Developer</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                This entire platform is developed and maintained by a single person with a 
                passion for helping others save money on their purchases.
              </p>
            </div>

            {/* No Brand Affiliation Card */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h4 className="font-bebas text-xl text-white">No Brand Affiliation</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                We have no partnership, sponsorship, or endorsement from any brand. All brand 
                names used are solely for identification purposes.
              </p>
            </div>

            {/* Brand Rights Card */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-bebas text-xl text-white">Brand Rights Respected</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Brands can request removal of their vouchers at any time. We also welcome 
                partnership inquiries from interested brands.
              </p>
            </div>
          </div>

          {/* Link to Disclaimer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link 
              href="/disclaimer" 
              className="inline-flex items-center gap-2 text-primary hover:text-amber-300 transition-colors text-sm"
            >
              Read our full Disclaimer for complete details →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <Faqs />
      </div>
    </div>
  );
};

export default About;
