"use client";
import Link from "next/link";
import { Home } from "lucide-react";

export function UserDashboardNavbar({ title }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-purple-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <h1 className="text-4xl font-bebas text-primary">{title}</h1>
      <Link
        href="/"
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-primary group"
        title="Go to Home"
      >
        <Home className="w-5 h-5" />
      </Link>
    </header>
  );
}
