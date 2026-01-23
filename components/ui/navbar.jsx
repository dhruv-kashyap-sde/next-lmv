"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { Separator } from "./separator";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { LoggedInUser } from "../LoggedInUser";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/vouchers", label: "Vouchers" },
  ];

  return (
    <>
      <nav
        className={`sticky z-10 top-0 w-full px-4 md:px-10 border-b backdrop-filter backdrop-blur-sm bg-[rgba(21,21,21,0.17)] text-neutral-300 transition-transform duration-300       }`}
      >
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-primary">
            <Link href="/">
            <img
                src="/favicon.ico"
                alt="Loot My Vouchers Logo"
            />
            </Link>
          </div>

          {/* Mobile Auth & Menu */}
          <div className="md:hidden flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <LoggedInUser user={user} logout={logout} />
                ) : (
                  <Button asChild variant="link" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </>
            )}
            <button
              onClick={toggleMenu}
              className="text-neutral-300 hover:text-primary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex justify-center gap-6 items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    className={cn(
                      "p-2 rounded-t-md border-b-2 transition-all",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent hover:bg-primary/5 hover:text-primary hover:border-primary"
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="mx-4 h-8">
              <Separator orientation="vertical" />
            </div>

            {!loading && (
              <>
                {user ? (
                  <LoggedInUser user={user} logout={logout} />
                ) : (
                  <>
                    <Button asChild variant="link" size="sm">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className={cn(
                        "bg-transparent text-primary hover:bg-primary/10 hover:text-foreground"
                      )}
                      size="sm"
                    >
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[rgba(21,21,21,0.95)] backdrop-blur-md border-l border-white/10 shadow-xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="text-2xl font-bold text-primary">LMV</div>
              <button
                onClick={closeMenu}
                className="text-neutral-300 hover:text-primary transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col space-y-2 px-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "p-3 rounded-md transition-all border",
                        isActive
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "text-neutral-300 border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
