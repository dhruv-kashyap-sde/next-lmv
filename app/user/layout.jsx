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
  Home,
  LogOut,
  UserCog,
  ChevronLeft,
  ChevronRight,
  TagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDashboardLayout({ children }) {
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
        router.push('/login');
      } else if (user.role === 'admin') {
        // Admin trying to access user routes, redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only allow regular users (not admins)
  if (!user || user.role === 'admin') {
    return null;
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

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
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-black">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-linear-to-b from-purple-900/95 via-blue-900/95 to-black/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!isCollapsed && (
            <Link href="/user/dashboard" className="text-2xl font-bebas text-primary flex items-center gap-2">
              <TagIcon className="w-6 h-6" />
              <span>LMV</span>
            </Link>
          )}
          {isCollapsed && (
            <TagIcon className="w-6 h-6 text-primary mx-auto" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-primary"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {userNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-gray-300 hover:bg-white/5 hover:text-primary border border-transparent"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0")} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/10">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section at Bottom */}
        <div className="p-3 border-t border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-primary/30",
                  isCollapsed && "justify-center"
                )}
              >
                <Avatar className="size-9 border-2 border-primary/50">
                  <AvatarImage src={user?.image || user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user/dashboard/profile" className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
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
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        {children}
      </div>
    </div>
  );
}
