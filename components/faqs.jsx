"use client";
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Faqs = () => {
  const faqs = [
    {
      question: "why are these vouchers free?",
      answer:
        "Since these vouchers are no longer needed by me, I have decided to share them for free.",
    },
    {
      question: "How do I get vouchers on this platform?",
      answer:
        "Simply login to unlock vouchers. A valid account is necessary for you to access exclusive deals from top brands.",
    },
    {
      question: "Are these vouchers really free?",
      answer:
        "Yes! All vouchers are completely free. You can claim one voucher per day. There are no hidden charges or subscription fees.",
    },
    {
      question: "How long are the vouchers valid?",
      answer:
        "Voucher validity varies by brand and offer. Most vouchers are valid for 30-90 days. Check the expiry date on each voucher before using.",
    },
    {
      question: "Can I use multiple vouchers together?",
      answer:
        "This depends on the brand's terms and conditions. Some brands allow stacking vouchers while others don't. Always check the terms before using.",
    },
    {
      question: "What if a voucher doesn't work?",
      answer:
        "It might happen if the company/brand might have removed the voucher or no longer supports it.",
    },
  ];

  return (
    <div id="faqs" className="mb-12 md:mb-16">
      <h3 className="font-bebas text-[10vw] md:text-[7vw] text-center mb-8 md:mb-12 text-primary">
        FAQs
      </h3>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index}
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md overflow-hidden transition-all duration-300 hover:border-primary/50 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="w-full flex items-center justify-between p-4 md:px-6 md:py-2 bg-primary text-black hover:bg-primary/90 transition-colors duration-200 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <h4 className="font-bebas text-lg md:text-xl lg:text-2xl text-left pr-4">
                  {faq.question}
                </h4>
              </AccordionTrigger>
              <AccordionContent className="p-4 md:p-6 bg-white/5 border-t border-white/10">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Faqs