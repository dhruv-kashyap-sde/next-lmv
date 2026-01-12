'use client'
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ShoppingBag, 
  Gift, 
  Clock, 
  ChevronRight, 
  Star,
  Search,
  User,
} from 'lucide-react';
import Tutorial from '@/components/Tutorial';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import Faqs from '@/components/faqs';

// --- Components ---


const VoucherCard = ({ brand, discount, code, category, color }) => (
  <div className="group relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-black ${color}`}>
          {brand.charAt(0)}
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          {category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold   mb-1">{brand}</h3>
      <div className="text-3xl font-black text-yellow-500 mb-4">{discount} OFF</div>
      
      <div className="flex gap-2">
        <div className="flex-1 bg-black/50 rounded-lg p-2 font-mono text-center text-zinc-400 border border-zinc-800 border-dashed group-hover:  transition-colors">
          {code}
        </div>
        <button className="bg-white text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors font-semibold">
          Copy
        </button>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
        <Clock size={12} />
        <span>Expires in 12h 30m</span>
      </div>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
    <div className="w-12 h-12 rounded-md gradient flex items-center justify-center mb-4 text-black shadow-lg shadow-yellow-500/20">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-bold   mb-2">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Spotlight = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Main Spotlight */}
    <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[140%] h-full bg-linear-to-b from-yellow-500/10 via-yellow-500/5 to-transparent blur-[80px] rounded-[100%]" />
    {/* Secondary Glows */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/10 blur-[100px] rounded-full mix-blend-screen" />
    <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen" />
    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
  </div>
);

export default function Testing() {

  const vouchers = [
    { id: 1, brand: "Amazon", discount: "20%", code: "AMZ-2024-X", category: "Retail", color: "bg-orange-400" },
    { id: 2, brand: "Uber", discount: "$15", code: "RIDE-SAFE", category: "Travel", color: "bg-white" },
    { id: 3, brand: "Netflix", discount: "1 Month", code: "BINGE-ON", category: "Entertainment", color: "bg-red-600  " },
    { id: 4, brand: "Nike", discount: "30%", code: "JUST-DO-IT", category: "Fashion", color: "bg-zinc-200" },
    { id: 5, brand: "Starbucks", discount: "50%", code: "COFFEE-LVR", category: "Food", color: "bg-green-600  " },
    { id: 6, brand: "Spotify", discount: "3 Months", code: "LISTEN-FREE", category: "Music", color: "bg-green-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950  font-raleway selection:bg-yellow-500/30 selection:text-yellow-200 ">

      {/* --- Stats / Trust --- */}
      <div className="border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Users", value: "50K+" },
            { label: "Daily Vouchers", value: "2,000+" },
            { label: "Money Saved", value: "$1.2M+" },
            { label: "Partner Brands", value: "150+" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Features --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-8xl font-bebas font-bold mb-4">Why Choose LMV?</h2>
            <p className="text-zinc-400">Simple, fast, and completely free.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Feature 
              icon={Gift} 
              title="Daily Refreshes" 
              desc="Our voucher pool refreshes every 24 hours. Check back daily for new deals from top global brands."
            />
            <Feature 
              icon={User} 
              title="Per User Limits" 
              desc="Fair distribution ensures everyone gets a chance to save. Verified users get priority access."
            />
            <Feature 
              icon={ShoppingBag} 
              title="Instant Redemption" 
              desc="No waiting periods. Copy the code and apply it to your cart instantly. It works like magic."
            />
          </div>
        </div>
      </section>

      {/* --- Vouchers Grid --- */}
      <section id="vouchers" className="py-24 bg-zinc-900/20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Trending Vouchers</h2>
              <p className="text-zinc-400 max-w-md">
                Grab these hot deals before they run out. Limited quantities available for today.
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:flex-initial">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                 <input 
                  type="text" 
                  placeholder="Search brands..." 
                  className="w-full md:w-64 bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                 />
               </div>
               <Button variant="outline" className="px-4!">Filter</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => (
              <VoucherCard key={voucher.id} {...voucher} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="secondary" className="group">
              View All Vouchers
              <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </div>
        </div>
      </section>

        {/* --- Tutorial Section --- */}
        <Tutorial/>
        {/* --- FAQs Section --- */}
      <Faqs />

      {/* --- CTA Section --- */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl bg-linear-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bebas tracking-wide font-bold mb-6 relative">Ready to start saving?</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto relative">
            Join thousands of smart shoppers who are saving big every single day. It's free and takes seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Button asChild variant="brand" className="">
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      

      {/* Floating Background Elements */}
      <div className="fixed top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse pointer-events-none" />
      <div className="fixed bottom-40 right-10 w-3 h-3 bg-yellow-500/20 rounded-full animate-bounce pointer-events-none delay-700" />
    </div>
  );
}