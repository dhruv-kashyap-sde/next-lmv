"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Menu,
  ChevronDown,
  Tag,
  Copy,
  Info,
  FilterIcon,
} from "lucide-react";
import VoucherCard from "./voucherCard";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

// Mock Data
const mockBrands = [
  { _id: "1", name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  {
    _id: "2",
    name: "Flipkart",
    logo: "https://logo.clearbit.com/flipkart.com",
  },
  { _id: "3", name: "Myntra", logo: "https://logo.clearbit.com/myntra.com" },
  { _id: "4", name: "Zomato", logo: "https://logo.clearbit.com/zomato.com" },
  { _id: "5", name: "Swiggy", logo: "https://logo.clearbit.com/swiggy.com" },
  { _id: "6", name: "Uber", logo: "https://logo.clearbit.com/uber.com" },
  {
    _id: "7",
    name: "BigBasket",
    logo: "https://logo.clearbit.com/bigbasket.com",
  },
  { _id: "8", name: "Nykaa", logo: "https://logo.clearbit.com/nykaa.com" },
];

const mockCategories = [
  { _id: "cat1", name: "Electronics" },
  { _id: "cat2", name: "Fashion" },
  { _id: "cat3", name: "Food & Dining" },
  { _id: "cat4", name: "Travel" },
  { _id: "cat5", name: "Beauty & Personal Care" },
  { _id: "cat6", name: "Groceries" },
];

const mockVouchers = [
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v1",
    name: "Get 20% Off on Electronics",
    brand: {
      _id: "1",
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
    },
    category: { _id: "cat1", name: "Electronics" },
    minOrder: 500,
    discount: "20%",
    code: "ELEC20",
    expiryDate: "2025-12-31",
    termsAndConditions: "Valid on all electronics. Min purchase ₹500.",
    isAvailable: true,
    createdAt: "2025-01-01",
  },
  {
    _id: "v2",
    name: "Flat ₹150 Off on Fashion",
    brand: {
      _id: "3",
      name: "Myntra",
      logo: "https://logo.clearbit.com/myntra.com",
    },
    category: { _id: "cat2", name: "Fashion" },
    minOrder: 999,
    discount: "₹150",
    code: "FASHION150",
    expiryDate: "2025-12-20",
    termsAndConditions: "Valid on min purchase of ₹999",
    isAvailable: true,
    createdAt: "2025-02-01",
  },
  {
    _id: "v3",
    name: "50% Off First Order",
    brand: {
      _id: "4",
      name: "Zomato",
      logo: "https://logo.clearbit.com/zomato.com",
    },
    category: { _id: "cat3", name: "Food & Dining" },
    minOrder: 200,
    discount: "50%",
    code: "ZOMFIRST",
    expiryDate: "2025-12-15",
    termsAndConditions: "Valid for new users only",
    isAvailable: true,
    createdAt: "2025-03-01",
  },
  {
    _id: "v4",
    name: "Get ₹100 Off on Groceries",
    brand: {
      _id: "7",
      name: "BigBasket",
      logo: "https://logo.clearbit.com/bigbasket.com",
    },
    category: { _id: "cat6", name: "Groceries" },
    minOrder: 750,
    discount: "₹100",
    code: "GROCERY100",
    expiryDate: "2025-12-25",
    termsAndConditions: "Valid on orders above ₹750",
    isAvailable: true,
    createdAt: "2025-01-15",
  },
  {
    _id: "v5",
    name: "Free Delivery + 30% Off",
    brand: {
      _id: "5",
      name: "Swiggy",
      logo: "https://logo.clearbit.com/swiggy.com",
    },
    category: { _id: "cat3", name: "Food & Dining" },
    minOrder: 300,
    discount: "30%",
    code: "SWIGGY30",
    expiryDate: "2026-01-10",
    termsAndConditions: "Valid on all restaurants",
    isAvailable: true,
    createdAt: "2025-02-10",
  },
  {
    _id: "v6",
    name: "Up to 40% Off on Beauty",
    brand: {
      _id: "8",
      name: "Nykaa",
      logo: "https://logo.clearbit.com/nykaa.com",
    },
    category: { _id: "cat5", name: "Beauty & Personal Care" },
    minOrder: 599,
    discount: "40%",
    code: "BEAUTY40",
    expiryDate: "2025-12-30",
    termsAndConditions: "Valid on selected items",
    isAvailable: true,
    createdAt: "2025-01-20",
  },
  {
    _id: "v7",
    name: "₹200 Off on Fashion Items",
    brand: {
      _id: "2",
      name: "Flipkart",
      logo: "https://logo.clearbit.com/flipkart.com",
    },
    category: { _id: "cat2", name: "Fashion" },
    minOrder: 1299,
    discount: "₹200",
    code: "FLIP200",
    expiryDate: "2025-12-28",
    termsAndConditions: "Min purchase ₹1299",
    isAvailable: true,
    createdAt: "2025-03-05",
  },
  {
    _id: "v8",
    name: "Get 15% Off on All Rides",
    brand: {
      _id: "6",
      name: "Uber",
      logo: "https://logo.clearbit.com/uber.com",
    },
    category: { _id: "cat4", name: "Travel" },
    minOrder: 150,
    discount: "15%",
    code: "UBER15",
    expiryDate: "2025-12-22",
    termsAndConditions: "Valid on all ride types",
    isAvailable: true,
    createdAt: "2025-02-20",
  },
];

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [brands, setBrands] = useState(mockBrands);
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredVouchers, setFilteredVouchers] = useState(mockVouchers);
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
    { label: "Expiring Soon", value: "expiry" },
  ];

  useEffect(() => {
    filterAndSortVouchers();
  }, [searchTerm, selectedBrand, selectedCategory, priceRange, sortBy]);

  const filterAndSortVouchers = () => {
    let filtered = [...vouchers];

    if (searchTerm) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voucher.brand?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          voucher.termsAndConditions
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.brand?._id === selectedBrand ||
          voucher.brand === selectedBrand
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.category?._id === selectedCategory ||
          voucher.category === selectedCategory
      );
    }

    if (priceRange) {
      filtered = filtered.filter((voucher) => {
        const price = voucher.minOrder;
        if (priceRange === "0-100") return price <= 100;
        if (priceRange === "101-200") return price >= 101 && price <= 200;
        if (priceRange === "201-300") return price >= 201 && price <= 300;
        if (priceRange === "301-400") return price >= 301 && price <= 400;
        if (priceRange === "401-500") return price >= 401 && price <= 500;
        if (priceRange === "500+") return price > 500;
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-asc":
          return a.minOrder - b.minOrder;
        case "price-desc":
          return b.minOrder - a.minOrder;
        case "expiry":
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

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b._id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Sidebar Component
  const SidebarContent = () => (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="font-bebas text-primary text-4xl text-center mb-0">
        All Vouchers
      </h1>
      <Separator className="bg-border" orientation="horizontal" />
      <Input placeholder="Search vouchers, brands..." />
      <div>
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vouchers, brands..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
          />
        </div> */}
        {/* Active Filters */}
        {(searchTerm ||
          selectedBrand ||
          selectedCategory ||
          priceRange ||
          sortBy !== "newest") && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary text-primary px-3 py-1 rounded-full text-sm">
                Search: "{searchTerm}"
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

      {/* <div className="h-px bg-primary/20" /> */}

      <div className=" max-h-[70vh] space-y-2 pr-2 overflow-auto scrollbar">
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
    <div className="min-h-screen w-full p-4 ">
      {/* <VoucherSidebar /> */}
      {/* Header */}
      <div className="flex sticky top-20 z-10 flex-col md:flex-row md:justify-between w-full gap-2 mb-3">
        {/* Search Bar */}
        <div className=" bg-secondary rounded-md relative md:w-1/3">
          <Input
            type="text"
            placeholder="Search Vouchers"
            className="text-primary"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={18}
          />
        </div>
        {/* Filters and Sorting */}
        <div className="flex justify-between gap-2">
          <Select>
            <SelectTrigger className="w-[180px] bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-yellow-500/20 hover:border-yellow-500/50">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="newest" onClick={() => setSortBy("newest")}>
                  Newest First
                </SelectItem>
                <SelectItem value="oldest" onClick={() => setSortBy("oldest")}>
                  Oldest First
                </SelectItem>
                <SelectItem
                  value="low-to-high"
                  onClick={() => setSortBy("low-to-high")}
                >
                  Price: Low to High
                </SelectItem>
                <SelectItem
                  value="high-to-low"
                  onClick={() => setSortBy("high-to-low")}
                >
                  Price: High to Low
                </SelectItem>
                <SelectItem
                  value="expiring-soon"
                  onClick={() => setSortBy("expiring-soon")}
                >
                  Expiring Soon
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <VoucherSidebar />
        </div>
      </div>
      {/* Main Voucher Grid */}
      <main className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md min-h-screen w-full max-w-full">
        {filteredVouchers.length === 0 ? (
          <p className="text-center text-primary mt-10">
            No vouchers found matching your criteria.
          </p>
        ) : (
          filteredVouchers.map((voucher, id) => (
            <VoucherCard key={id} voucher={voucher} />
          ))
        )}
      </main>
    </div>
  );
};

export default VoucherPage;
