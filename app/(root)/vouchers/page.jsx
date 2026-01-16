"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Gift,
} from "lucide-react";
import VoucherCard from "./voucherCard";
import { Separator } from "@/components/ui/separator";
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
    fetchBrands();
    fetchCategories();
  }, []);

  // Re-filter when filters change
  useEffect(() => {
    filterAndSortVouchers();
  }, [searchTerm, selectedBrand, selectedCategory, priceRange, sortBy, vouchers]);

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Sidebar Filter Component
  const SidebarContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="font-bebas text-primary text-4xl text-center mb-0">
        All Vouchers
      </h1>
      <Separator className="bg-border" orientation="horizontal" />
      <div className="relative">
        <Input
          placeholder="Search vouchers, brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        {/* Active Filters */}
        {(searchTerm ||
          selectedBrand ||
          selectedCategory ||
          priceRange ||
          sortBy !== "newest") && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary text-primary px-3 py-1 rounded-full text-sm">
                Search: &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500 text-blue-400 px-3 py-1 rounded-full text-sm">
                Brand: {getBrandName(selectedBrand)}
                <button onClick={() => setSelectedBrand("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500 text-purple-400 px-3 py-1 rounded-full text-sm">
                Category: {getCategoryName(selectedCategory)}
                <button onClick={() => setSelectedCategory("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange && (
              <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-sm">
                {priceRanges.find((p) => p.value === priceRange)?.label}
                <button onClick={() => setPriceRange("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-bebas text-xl text-primary">Filters</h3>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[70vh] space-y-2 pr-2 overflow-auto scrollbar">
        {/* Sort By */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("sort")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-sm text-primary">Sort By</span>
            <ChevronDown
              className={`w-4 h-4 text-primary transition-transform ${
                expandedSections.sort ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.sort && (
            <div className="p-3 space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === option.value
                      ? "bg-primary text-black font-semibold"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("brands")}
            className="w-full flex border-b items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-sm text-primary">Brands</span>
            <ChevronDown
              className={`w-4 h-4 text-primary transition-transform ${
                expandedSections.brands ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.brands && (
            <div className="p-3 space-y-2 max-h-64 scrollbar overflow-y-auto">
              <button
                onClick={() => setSelectedBrand("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedBrand === ""
                    ? "bg-primary text-black font-semibold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand._id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedBrand === brand._id
                      ? "bg-primary text-black font-semibold"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  {brand.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex border-b items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-sm text-primary">
              Categories
            </span>
            <ChevronDown
              className={`w-4 h-4 text-primary transition-transform ${
                expandedSections.categories ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.categories && (
            <div className="p-3 space-y-2 max-h-64 scrollbar overflow-y-auto">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-primary text-black font-semibold"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category._id
                      ? "bg-primary text-black font-semibold"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="font-semibold text-sm text-primary">
              Price Range
            </span>
            <ChevronDown
              className={`w-4 h-4 text-primary transition-transform ${
                expandedSections.price ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.price && (
            <div className="p-3 space-y-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setPriceRange(range.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    priceRange === range.value
                      ? "bg-primary text-black font-semibold"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
                <VoucherCard key={voucher._id} voucher={voucher} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VoucherPage;
