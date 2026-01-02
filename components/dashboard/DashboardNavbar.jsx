"use client";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardNavbar({ title }) {
  return (
    <header className="sticky top-0 z-30 h-20 bg-background backdrop-blur-xl border-b flex items-center justify-between px-6">
      <h1 className="text-4xl font-bebas text-primary">{title}</h1>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-primary group"
            title="Go to Home"
          >
            <Home className="w-5 h-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to Home</p>
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
