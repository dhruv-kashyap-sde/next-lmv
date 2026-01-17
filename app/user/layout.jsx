"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Ticket,
  LogOut,
  UserCog,
  TagIcon,
  Menu,
  Home,
  FileQuestionMark,
  Tag,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function UserDashboardLayout({ children }) {
  const { checkAuth, user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
        toast.error('Please log in.');
      } else if (user.role === 'admin') {
        // Admin trying to access user routes, redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only allow regular users (not admins)
  if (!user || user.role === 'admin') {
    return null;
  }

  const userNavItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: `/user/dashboard`,
    },
    {
      label: "My Vouchers",
      icon: Ticket,
      href: `/user/dashboard/vouchers`,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-black to-background">
      {/* Top Header with Hamburger */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Hamburger Menu */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-primary hover:bg-white/5">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-linear-to-b from-background/95 via-black to-background backdrop-blur-xl border-white/10">
                {/* Logo in Sheet */}
                <div className="h-16 flex items-center px-4 border-b border-white/10">
                  <Link 
                    href="/user/dashboard" 
                    className="text-2xl font-bebas text-primary flex items-center gap-2"
                    onClick={() => setSheetOpen(false)}
                  >
                    <TagIcon className="w-6 h-6" />
                    <span>LMV</span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-6 space-y-2">
                  {userNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/50"
                            : "text-gray-300 hover:bg-white/5 hover:text-primary border border-transparent"
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

              </SheetContent>
            </Sheet>

            <h1 className="text-2xl font-bebas text-primary">
              Dashboard
            </h1>
          </div>

          {/* User Profile in Header */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all">
                  <Avatar className="size-8 border-2 border-primary/50">
                    <AvatarImage src={user?.image || user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold text-xs">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  {/* <span className="hidden md:inline text-sm font-medium text-white">{user?.name}</span> */}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-primary/50">
                      <AvatarImage src={user?.image || user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user?.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard/profile" className="cursor-pointer">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Homepage</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/vouchers" className="cursor-pointer">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Vouchers Page</span>
                  </Link>
                </DropdownMenuItem>

                {/* <DropdownMenuSeparator /> */}

                <DropdownMenuItem asChild>
                  <Link href={`/help`}>
                  <FileQuestionMark className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}