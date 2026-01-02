"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import {
  Users,
  Ticket,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  BarChart3,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVouchers: 0,
    totalClaims: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    // TODO: Replace with actual API call
    setStats({
      totalUsers: 1234,
      totalVouchers: 56,
      totalClaims: 890,
      totalRevenue: 45678,
    });
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      change: "+12%",
    },
    {
      title: "Active Vouchers",
      value: stats.totalVouchers,
      icon: Ticket,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      change: "+5%",
    },
    {
      title: "Total Claims",
      value: stats.totalClaims.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      change: "+23%",
    },
    {
      title: "Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      change: "+8%",
    },
  ];

  const quickActions = [
    {
      label: "Add Voucher",
      icon: Package,
      href: "/admin/dashboard/vouchers/new",
      color: "primary",
    },
    {
      label: "Manage Users",
      icon: Users,
      href: "/admin/dashboard/users",
      color: "secondary",
    },
    {
      label: "Add Brand",
      icon: ShoppingBag,
      href: "/admin/dashboard/brands/new",
      color: "primary",
    },
    {
      label: "View Analytics",
      icon: BarChart3,
      href: "/admin/dashboard/analytics",
      color: "secondary",
    },
  ];

  const recentActivity = [
    {
      user: "John Doe",
      action: "claimed voucher",
      voucher: "Amazon 20% OFF",
      time: "2 mins ago",
    },
    {
      user: "Jane Smith",
      action: "signed up",
      voucher: null,
      time: "15 mins ago",
    },
    {
      user: "Mike Johnson",
      action: "claimed voucher",
      voucher: "Flipkart ₹150 OFF",
      time: "1 hour ago",
    },
    {
      user: "Sarah Williams",
      action: "claimed voucher",
      voucher: "Zomato 50% OFF",
      time: "2 hours ago",
    },
  ];

  return (
    <>
      <DashboardNavbar title="Overview" />
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-400">Welcome back, Admin!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm rounded-lg p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <Badge variant="secondary" className="bg-white/10">
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bebas ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bebas text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant={action.color}
                className="h-auto py-6 flex flex-col items-center gap-3"
                onClick={() => router.push(action.href)}
              >
                <action.icon className="w-8 h-8" />
                <span className="font-semibold">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bebas text-primary">
                Recent Activity
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-gray-400">{activity.action}</span>
                      {activity.voucher && (
                        <>
                          {" "}
                          <span className="text-primary">
                            {activity.voucher}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Vouchers */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bebas text-primary">
                Popular Vouchers
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {[
                {
                  brand: "Amazon",
                  voucher: "20% OFF Electronics",
                  claims: 245,
                },
                { brand: "Flipkart", voucher: "Flat ₹150 OFF", claims: 198 },
                {
                  brand: "Zomato",
                  voucher: "50% OFF First Order",
                  claims: 167,
                },
                {
                  brand: "Myntra",
                  voucher: "Fashion Sale 40% OFF",
                  claims: 143,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {item.brand}
                    </p>
                    <p className="text-gray-400 text-xs">{item.voucher}</p>
                  </div>
                  <Badge className="bg-primary text-black font-bold">
                    {item.claims} claims
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
