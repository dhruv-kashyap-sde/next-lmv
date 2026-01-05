"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { UserDashboardNavbar } from '@/components/dashboard/UserDashboardNavbar';
import { 
  Ticket, 
  Calendar,
  LogOut,
  Gift,
  TrendingUp,
  Clock,
  Star,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export default function UserDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [canClaimToday, setCanClaimToday] = useState(true);

  useEffect(() => {
    console.log('User Dashboard - Auth state:', { user, loading });
    
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log('No user found, redirecting to login...');
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  // If no user after loading, show nothing (will redirect)
  if (!user) {
    return null;
  }

  const claimedVouchers = [];

  return (
    <>
      <UserDashboardNavbar title="My Dashboard" />
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-300">Welcome back!</p>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-primary/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Gift className="w-8 h-8 text-primary" />
            <Badge className="bg-primary text-black">Active</Badge>
          </div>
          <h3 className="text-gray-300 text-sm mb-1">Total Vouchers Claimed</h3>
          <p className="text-4xl font-bebas text-primary">0</p>
        </div>

          <div className="bg-white/10 backdrop-blur-md border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                Earned
              </Badge>
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Points Balance</h3>
            <p className="text-4xl font-bebas text-green-400">0</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
              <Badge 
                className={`${
                  canClaimToday 
                    ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                    : 'bg-red-500/20 text-red-400 border-red-500/50'
                }`}
              >
                {canClaimToday ? 'Available' : 'Used'}
              </Badge>
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Today's Claim</h3>
            <p className="text-4xl font-bebas text-blue-400">
              {canClaimToday ? 'Ready' : 'Tomorrow'}
            </p>
          </div>
        </div>

        {/* Claim Voucher CTA */}
        {canClaimToday && (
          <div className="bg-linear-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bebas text-primary mb-2">
                  You can claim a voucher today!
                </h2>
                <p className="text-gray-300">
                  Browse available vouchers and claim your daily deal
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-6 text-lg"
                onClick={() => router.push('/vouchers')}
              >
                <Ticket className="w-5 h-5 mr-2" />
                Browse Vouchers
              </Button>
            </div>
          </div>
        )}

        {/* Claimed Vouchers */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bebas text-primary">My Claimed Vouchers</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => router.push('/vouchers')}
            >
              View All Vouchers
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {claimedVouchers.length > 0 ? (
            <div className="space-y-4">
              {claimedVouchers.map((voucher, index) => (
                <div
                  key={index}
                  className={`bg-white/5 border ${
                    voucher.status === 'expiring' 
                      ? 'border-yellow-500/50' 
                      : 'border-white/10'
                  } rounded-lg p-4 hover:bg-white/10 transition-colors`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-primary font-bebas text-xl">{voucher.brand}</h3>
                          <p className="text-white text-sm">{voucher.voucher}</p>
                        </div>
                        {voucher.status === 'expiring' && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Claimed: {new Date(voucher.claimedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="bg-primary/20 border border-primary/50 rounded-lg px-4 py-2">
                        <p className="text-xs text-gray-400 mb-1">Voucher Code</p>
                        <p className="font-mono text-primary font-bold text-lg">{voucher.code}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-primary/50 text-primary hover:bg-primary/10"
                        onClick={() => {
                          navigator.clipboard.writeText(voucher.code);
                          alert('Code copied!');
                        }}
                      >
                        Copy Code
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="font-bebas text-2xl text-gray-400 mb-2">No Vouchers Yet</h3>
              <p className="text-gray-500 mb-6">Start claiming vouchers to see them here</p>
              <Button
                className="bg-primary hover:bg-primary/90 text-black font-bold"
                onClick={() => router.push('/vouchers')}
              >
                Browse Vouchers
              </Button>
            </div>
          )}
        </div>
      </main>
      </>
  );
}
