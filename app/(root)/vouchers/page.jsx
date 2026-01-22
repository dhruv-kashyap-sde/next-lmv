"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Gift,
} from "lucide-react";
import VoucherCard from "./voucherCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VoucherSidebar from "./vouchersidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoucherGridSkeleton } from "@/components/VoucherCardSkeleton";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    sort: false,
    brands: false,
    categories: false,
    price: false,
  });
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  
  // Claim status state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [claimedVoucherIds, setClaimedVoucherIds] = useState([]);

  const priceRanges = [
    { label: "All Prices", value: "" },
    { label: "Below ₹100", value: "0-100" },
    { label: "₹101 - ₹200", value: "101-200" },
    { label: "₹201 - ₹300", value: "201-300" },
    { label: "₹301 - ₹400", value: "301-400" },
    { label: "₹401 - ₹500", value: "401-500" },
    { label: "Above ₹500", value: "500+" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Expiring Soon", value: "expiring" },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchVouchers();
    fetchClaimStatus();
    // fetchBrands();
    // fetchCategories();
  }, []);

  // Re-filter when filters change
  useEffect(() => {
    filterAndSortVouchers();
  }, [searchTerm, selectedBrand, selectedCategory, priceRange, sortBy, vouchers]);

  const fetchClaimStatus = async () => {
    try {
      const response = await fetch('/api/vouchers/claim', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setIsLoggedIn(data.isLoggedIn);
        setCanClaimToday(data.canClaimToday);
        setClaimedVoucherIds(data.claimedVoucherIds || []);
      }
    } catch (err) {
      console.error('Error fetching claim status:', err);
    }
  };

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/vouchers/active');
      const data = await response.json();

      if (data.success) {
        setVouchers(data.data);
        setFilteredVouchers(data.data);
      } else {
        setError('Failed to load vouchers');
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setError('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands');
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filterAndSortVouchers = () => {
    let filtered = [...vouchers];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (voucher) =>
          voucher.title?.toLowerCase().includes(search) ||
          voucher.description?.toLowerCase().includes(search) ||
          voucher.brand?.name?.toLowerCase().includes(search) ||
          voucher.category?.name?.toLowerCase().includes(search)
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(
        (voucher) => voucher.brand?._id === selectedBrand
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (voucher) => voucher.category?._id === selectedCategory
      );
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter((voucher) => {
        const price = voucher.minOrder || 0;
        if (priceRange === "0-100") return price <= 100;
        if (priceRange === "101-200") return price >= 101 && price <= 200;
        if (priceRange === "201-300") return price >= 201 && price <= 300;
        if (priceRange === "301-400") return price >= 301 && price <= 400;
        if (priceRange === "401-500") return price >= 401 && price <= 500;
        if (priceRange === "500+") return price > 500;
        return true;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-asc":
          return (a.minOrder || 0) - (b.minOrder || 0);
        case "price-desc":
          return (b.minOrder || 0) - (a.minOrder || 0);
        case "expiring":
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        default:
          return 0;
      }
    });

    setFilteredVouchers(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setSelectedCategory("");
    setPriceRange("");
    setSortBy("newest");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedBrand) count++;
    if (selectedCategory) count++;
    if (priceRange) count++;
    if (sortBy !== "newest") count++;
    return count;
  };

  return (
    <div className="min-h-screen w-full p-4">
      {/* Header */}
      <div className="flex sticky top-20 z-10 flex-col md:flex-row md:justify-between w-full gap-2 mb-3">
        {/* Search Bar */}
        <div className="bg-secondary rounded-md relative md:w-1/3">
          <Input
            type="text"
            placeholder="Search Vouchers"
            className="text-primary pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={18}
          />
        </div>
        {/* Filters and Sorting */}
        <div className="flex justify-between gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px] bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-yellow-500/20 hover:border-yellow-500/50">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <VoucherSidebar />
        </div>
      </div>

      {/* Main Voucher Grid */}
      <main className="rounded-md min-h-screen w-full max-w-full">
        {loading ? (
          <VoucherGridSkeleton count={9} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchVouchers} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bebas text-gray-400 mb-2">
              No Vouchers Found
            </h3>
            <p className="text-gray-500 mb-4">
              {vouchers.length > 0
                ? "Try adjusting your filters to find vouchers."
                : "Check back later for new deals!"}
            </p>
            {getActiveFiltersCount() > 0 && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Showing {filteredVouchers.length} of {vouchers.length} vouchers
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVouchers.map((voucher) => (
                <VoucherCard 
                  key={voucher._id} 
                  voucher={voucher}
                  isLoggedIn={isLoggedIn}
                  canClaimToday={canClaimToday}
                  claimedVoucherIds={claimedVoucherIds}
                  onClaimSuccess={fetchClaimStatus}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VoucherPage;
