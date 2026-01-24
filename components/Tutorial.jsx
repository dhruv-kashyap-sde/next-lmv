import React from "react";
import { Badge } from "./ui/badge";

const Tutorial = () => {
  // Tutorial slides data
  const tutorialSlides = [
    {
      id: 1,
      title: "1. Select your Voucher",
      description: "Search your desired voucher and click on ",
      chipText: "claim",
      descriptionEnd: " to copy the discount code",
    },
    {
      id: 2,
      title: "2. Claim one per day",
      description: "You can claim one ",
      chipText: "Voucher",
      descriptionEnd: " once every 24 hours",
    },
    {
      id: 3,
      title: "3. Get Rewarded",
      description: "You can ",
      chipText: "copy the code",
      descriptionEnd:
        " and use it before it gets expired for maximum savings",
    },
  ];

  return (
    <section id="how-it-works" className="my-0 md:my-[30vh] flex flex-col md:flex-row relative items-start py-12 md:py-[50px] min-h-screen">
      {/* Left Side - Sticky Title */}
      <div className="w-full md:w-1/2 md:sticky md:top-[30%] left-0 flex items-center justify-center bg-background z-7 md:bg-transparent sticky top-0 h-[20vh] md:h-auto md:items-center pt-10 md:mb-0">
        <h1
          className="text-[12vw] md:text-[10vw] leading-[0.9] text-center font-bebas text-primary underline"
        >
          How this works
        </h1>
      </div>

      {/* Right Side - Scrollable Slides */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="space-y-8">
          {tutorialSlides.map((slide) => (
            <div
              key={slide.id}
              className="h-[40vh] md:h-[80vh] w-full max-w-[90vw] md:max-w-[40vw] flex items-center justify-center rounded-2xl backdrop-blur-[10px] border border-white/20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
              }}
            >
              <div className="flex flex-col gap-4 md:gap-8 p-6 md:p-12 h-full justify-center">
                {/* Slide Title */}
                <h2
                  className="text-[8vw] md:text-[3vw] text-center font-bebas text-primary underline leading-0"
                >
                  {slide.title}
                </h2>

                {/* Slide Description with Chip */}
                <p className="mt-2 md:mt-4 text-center leading-relaxed text-base md:text-xl">
                  {slide.description}
                  
                  <Badge className="font-bebas text-xl">{slide.chipText}</Badge>
                  {slide.descriptionEnd}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tutorial;
