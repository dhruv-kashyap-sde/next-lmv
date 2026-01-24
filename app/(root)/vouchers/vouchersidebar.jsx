import { useState, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, FilterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const VoucherSidebar = ({ 
  brands = [], 
  categories = [], 
  selectedBrands = [], 
  selectedCategories = [], 
  selectedPriceRange = '',
  onApplyFilters,
  onClearFilters
}) => {
  const [selectedTab, setSelectedTab] = useState("Brands");
  const [localSelectedBrands, setLocalSelectedBrands] = useState(selectedBrands);
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories);
  const [localSelectedPriceRange, setLocalSelectedPriceRange] = useState(selectedPriceRange);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalSelectedBrands(selectedBrands);
    setLocalSelectedCategories(selectedCategories);
    setLocalSelectedPriceRange(selectedPriceRange);
  }, [selectedBrands, selectedCategories, selectedPriceRange]);

  const tabList = [
    { value: "Brands" },
    { value: "Categories" },
    { value: "Price Range" },
  ];

  const tabPriceRange = [
    { name: "0-100", label: "Below ₹100" },
    { name: "101-200", label: "₹101 - ₹200" },
    { name: "201-300", label: "₹201 - ₹300" },
    { name: "301-400", label: "₹301 - ₹400" },
    { name: "401-500", label: "₹401 - ₹500" },
    { name: "500+", label: "Above ₹500" },
  ];

  const handleBrandToggle = (brandId) => {
    setLocalSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((b) => b !== brandId)
        : [...prev, brandId]
    );
  };

  const handleCategoryToggle = (categoryId) => {
    setLocalSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setLocalSelectedBrands([]);
    setLocalSelectedCategories([]);
    setLocalSelectedPriceRange("");
    if (onClearFilters) {
      onClearFilters();
    }
    setIsOpen(false);
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        brands: localSelectedBrands,
        categories: localSelectedCategories,
        priceRange: localSelectedPriceRange,
      });
    }
    setIsOpen(false);
  };

  const getTotalFiltersCount = () => {
    return localSelectedBrands.length + localSelectedCategories.length + (localSelectedPriceRange ? 1 : 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <FilterIcon />
          Filters
          <ChevronLeft />
          {getTotalFiltersCount() > 0 && <Badge>{getTotalFiltersCount()}</Badge>}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-0">
          <div className="flex items-center gap-2">
            <FilterIcon size={18} />
            <SheetTitle> Filter By</SheetTitle>
          </div>
        </SheetHeader>
        <Separator className="-mt-5" />
        <div className=" w-full h-screen flex">
          {/* tab content */}
          <div className="bg-secondary w-2/3 h-full overflow-y-auto">
            {selectedTab === "Brands" &&
              (brands.length > 0 ? (
                brands
                  .filter(brand => brand.isActive)
                  .map((brand) => (
                    <div key={brand._id} className=" items-center flex gap-4 p-4">
                      <Checkbox
                        id={brand._id}
                        className="cursor-pointer"
                        checked={localSelectedBrands.includes(brand._id)}
                        onCheckedChange={() => handleBrandToggle(brand._id)}
                      />
                      <Label
                        variant="ghost"
                        htmlFor={brand._id}
                        className="rounded-none w-full cursor-pointer"
                      >
                        {brand.name}
                      </Label>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No brands available
                </div>
              ))}
            {selectedTab === "Categories" &&
              (categories.length > 0 ? (
                categories
                  .filter(category => category.isActive)
                  .map((category) => (
                    <div
                      key={category._id}
                      className=" items-center flex gap-4 p-4"
                    >
                      <Checkbox
                        id={category._id}
                        className="cursor-pointer"
                        checked={localSelectedCategories.includes(category._id)}
                        onCheckedChange={() => handleCategoryToggle(category._id)}
                      />
                      <Label
                        variant="ghost"
                        htmlFor={category._id}
                        className="rounded-none w-full cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No categories available
                </div>
              ))}
            <RadioGroup value={localSelectedPriceRange} onValueChange={setLocalSelectedPriceRange}>
              {selectedTab === "Price Range" &&
                tabPriceRange.map((price) => (
                  <div
                    key={price.name}
                    className=" items-center flex gap-4 p-4"
                  >
                    <RadioGroupItem value={price.name} id={price.name} />
                    <Label htmlFor={price.name}>{price.label}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
          {/* tab list */}
          <div className="w-1/3 h-full">
            {tabList.map((tab) => (
              <Button
                variant="ghost"
                key={tab.value}
                className={`p-4 mb-4  rounded-none w-full cursor-pointer hover:bg-secondary ${selectedTab === tab.value ? "bg-secondary border-r-primary border-r" : ""}`}
                onClick={() => setSelectedTab(tab.value)}
              >
                {tab.value}
              </Button>
            ))}
          </div>
        </div>
        <SheetFooter>
          <Button type="button" onClick={applyFilters}>Apply Filters</Button>
          <SheetClose asChild>
            <Button variant="secondary" onClick={clearAllFilters}>Clear All</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default VoucherSidebar;
