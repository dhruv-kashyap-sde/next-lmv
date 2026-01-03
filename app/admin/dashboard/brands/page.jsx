"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { ShoppingBag, Plus, Search, Filter, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { AddNewBrand } from './AddNewBrand';
import { EditBrand } from './EditBrand';
import { CategorySheet } from './CategorySheet';
import { toast } from 'sonner';

export default function AdminBrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/brands");
      const result = await response.json();

      if (result.success) {
        setBrands(result.data);
      } else {
        toast.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("An error occurred while fetching brands");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/brands?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Brand deleted successfully");
        fetchBrands();
      } else {
        toast.error(result.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("An error occurred while deleting the brand");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DashboardNavbar title="Brands Management" />
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-400">Manage all brands and categories</p>
          <div className="flex gap-4">
            <AddNewBrand onSuccess={fetchBrands} />
            <CategorySheet />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-primary"
            />
          </div>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 text-lg mb-2">
              {searchQuery ? "No brands found" : "No brands yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery ? "Try a different search term" : "Add your first brand to get started"}
            </p>
          </div>
        ) : (
          /* Brands Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand._id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden p-2">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`;
                        }}
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={brand.isActive ? 'default' : 'secondary'}
                      className={brand.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                    >
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {brand.isFeatured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bebas text-primary mb-2">{brand.name}</h3>
                
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-4"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-2">
                  <span className="text-sm text-gray-400">
                    {brand.vouchers?.length || 0} vouchers
                  </span>
                  <div className="flex gap-2">
                    <EditBrand brand={brand} onSuccess={fetchBrands} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(brand._id, brand.name)}
                      disabled={deletingId === brand._id}
                    >
                      {deletingId === brand._id ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
