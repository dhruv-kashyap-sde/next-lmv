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
  ShoppingBag,
  Users,
  Home,
  LogOut,
  UserCog,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  TagIcon,
  Mail,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboardLayout({ children }) {
  const { checkAuth, user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push("/login?admin=true");
      } else if (user.role !== "admin") {
        // Logged in but not admin, redirect to user dashboard
        router.push("/user/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only allow admins
  if (!user || user.role !== "admin") {
    return null;
  }

  const adminNavItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: `/admin/dashboard`,
    },
    {
      label: "Vouchers",
      icon: Ticket,
      href: `/admin/dashboard/vouchers`,
    },
    {
      label: "Brands",
      icon: ShoppingBag,
      href: `/admin/dashboard/brands`,
    },
    {
      label: "Users",
      icon: Users,
      href: `/admin/dashboard/users`,
    },
    {
      label: "Messages",
      icon: Mail,
      href: `/admin/dashboard/messages`,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-black to-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background  border-r transition-all duration-300 flex flex-col",
          isCollapsed ? "w-18" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bebas text-primary flex items-center gap-2"
            >
              <TagIcon className="w-6 h-6" />
              <span>LMV</span>
            </Link>
          )}
          {/* {isCollapsed && <TagIcon className="w-6 h-6 text-primary mx-auto" />} */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-primary"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-gray-400 hover:bg-white/5 hover:text-primary border border-transparent"
                )}
              >
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <item.icon className={cn("w-5 h-5 shrink-0")} />
                    </TooltipTrigger>
                    <TooltipContent sideOffset={15} side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <item.icon className={cn("w-5 h-5 shrink-0")} />
                )}
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section at Bottom */}
        <div className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-primary/30",
                  isCollapsed && "justify-center"
                )}
              >
                <Avatar className="size-9 border-2 border-primary/50">
                  <AvatarImage
                    src={user?.image || user?.avatar}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border-2 border-primary/50">
                    <AvatarImage
                      src={user?.image || user?.avatar}
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/profile"
                  className="cursor-pointer"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/dashboard" className="cursor-pointer">
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Switch to User View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-18" : "ml-64"
        )}
      >
        {children}
      </div>
    </div>
  );
}
