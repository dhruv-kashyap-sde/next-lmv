import React from "react";
import {
  CheckCircle,
  Info,
  Shield,
  Zap,
  BadgeCheck,
} from "lucide-react";
import Faqs from "@/components/faqs";

export const metadata = {
  title: "About Us - LMV | Loot My Vouchers",
  description: "Learn about LMV - your trusted platform for genuine vouchers and discount codes. We share authentic deals from popular brands to help you save money on every purchase.",
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
    title: "About LMV - Loot My Vouchers Platform",
    description: "Discover how LMV helps you save money with verified vouchers from popular brands. 100% secure and instant access to genuine deals.",
    type: "website",
    url: "https://lootmyvouchers.com/about",
    siteName: "LMV - Loot My Vouchers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LMV - Loot My Vouchers About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About LMV - Loot My Vouchers",
    description: "Learn about LMV - your trusted platform for verified vouchers and discount codes from popular brands.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lootmyvouchers.com/about",
  },
  robots: {
    index: true,
    follow: true,
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
      description: "Get vouchers immediately after watching ads",
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
    {
      text: "I have ",
      chip: { label: "Earned", color: "bg-primary text-black" },
      text2: " these vouchers through making transactions on ",
      chip2: { label: "Paytm", color: "bg-background text-primary" },
    },
    {
      text: "These vouchers are ",
      chip: { label: "SHARED", color: "bg-primary text-black" },
      text2: " as they are no use of mine",
    },
    {
      text: "I do not have any ",
      chip: { label: "partnership", color: "bg-primary text-black" },
      text2: " with above mentioned companies",
    },
    {
      text: "I do not get any ",
      chip: { label: "benefits", color: "bg-primary text-black" },
      text2: " from the above mentioned companies",
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
              How do I get these vouchers?
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

        {/* FAQ Section */}
        <Faqs />
      </div>
    </div>
  );
};

export default About;
