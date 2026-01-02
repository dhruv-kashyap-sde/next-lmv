"use client";
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { ShoppingBag, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddNewBrand } from './AddNewBrand';

export default function AdminBrandsPage() {
  const router = useRouter();

  const brands = [
    { id: 1, name: 'Amazon', category: 'E-commerce', vouchers: 15, active: true },
    { id: 2, name: 'Flipkart', category: 'E-commerce', vouchers: 12, active: true },
    { id: 3, name: 'Zomato', category: 'Food Delivery', vouchers: 8, active: true },
    { id: 4, name: 'Myntra', category: 'Fashion', vouchers: 10, active: true },
    { id: 5, name: 'Swiggy', category: 'Food Delivery', vouchers: 6, active: false },
  ];

  return (
    <>
      <DashboardNavbar title="Brands Management" />
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-400">Manage all brands and categories</p>
        <AddNewBrand/>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search brands..."
            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
          />
        </div>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-all hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <Badge
                variant={brand.active ? 'default' : 'secondary'}
                className={brand.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
              >
                {brand.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <h3 className="text-xl font-bebas text-primary mb-2">{brand.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{brand.category}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">
                {brand.vouchers} vouchers
              </span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
      </main>
    </>
  );
}
