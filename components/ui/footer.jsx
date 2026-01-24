import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { toast } from "sonner";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter flex items-center gap-2"
            >
              <img src="/icon.png" alt="Loot My Vouchers Logo" className="h-8 w-8" />
              <span className="font-bebas tracking-wide text-2xl text-foreground">Loot My Vouchers</span>
                
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The premier destination for verifying and claiming daily shopping
              vouchers. Save more, spend less.
            </p>
          </div>

          <div>
            <h4 className="font-bold   mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <Link href="/vouchers" className="hover:text-yellow-500 transition-colors">
                  Browse Vouchers
                </Link>
              </li>
              <li>
                <Link  href="/#how-it-works" className="hover:text-yellow-500 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold   mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <Link href="/about#faqs" className="hover:text-yellow-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-yellow-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-yellow-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-yellow-500 transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold   mb-6">Subscribe</h4>
            <p className="text-zinc-500 text-sm mb-4">
              Get the best deals delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <Button 
              
              // className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-xs font-bold  ">
              LMV
            </div>
            <span className="text-zinc-600 text-sm">
              © 2024 Loot My Vouchers. All rights reserved.
            </span>
          </div>

          <div className="flex gap-6">
            {
              [{title: "Github", link: "https://github.com/dhruv-kashyap-sde/"}, {title: "LinkedIn", link: "https://www.linkedin.com/in/dhruv-kashyap-a5a006250"}, {title: "Instagram", link: "https://www.instagram.com/_dhruv.kashyap_?igsh=N213ZjRxMDNwbW02"}]
            .map((social) => (
              <Link
                key={social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:  text-sm transition-colors"
              >
                {social.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
