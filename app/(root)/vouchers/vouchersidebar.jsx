import { useState } from "react";
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

const VoucherSidebar = () => {
  const [selectedTab, setSelectedTab] = useState("Brands");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const tabList = [
    { value: "Brands" },
    { value: "Categories" },
    { value: "Price Range" },
  ];

  const tabBrand = [
    { name: "Amazon" },
    { name: "eBay" },
    { name: "Walmart" },
    { name: "Target" },
  ];

  const tabCategories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Home & Garden" },
    { name: "Health & Beauty" },
  ];

  const tabPriceRange = [
    { name: "$0 - $50" },
    { name: "$51 - $100" },
    { name: "$101 - $200" },
    { name: "$201 and above" },
  ];

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPriceRange("");
  };

  const getTotalFiltersCount = () => {
    return selectedBrands.length + selectedCategories.length + (selectedPriceRange ? 1 : 0);
  };

  return (
    <Sheet>
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
          <div className="bg-secondary w-2/3 h-full">
            {selectedTab === "Brands" &&
              tabBrand.map((brand) => (
                <div key={brand.name} className=" items-center flex gap-4 p-4">
                  <Checkbox
                    id={brand.name}
                    className="cursor-pointer"
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={() => handleBrandToggle(brand.name)}
                  />
                  <Label
                    variant="ghost"
                    htmlFor={brand.name}
                    className="rounded-none w-full cursor-pointer"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            {selectedTab === "Categories" &&
              tabCategories.map((category) => (
                <div
                  key={category.name}
                  className=" items-center flex gap-4 p-4"
                >
                  <Checkbox
                    id={category.name}
                    className="cursor-pointer"
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryToggle(category.name)}
                  />
                  <Label
                    variant="ghost"
                    htmlFor={category.name}
                    className="rounded-none w-full cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            <RadioGroup value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              {selectedTab === "Price Range" &&
                tabPriceRange.map((price) => (
                  <div
                    key={price.name}
                    className=" items-center flex gap-4 p-4"
                  >
                    <RadioGroupItem value={price.name} id={price.name} />
                    <Label htmlFor={price.name}>{price.name}</Label>
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
          <Button type="submit">Apply Filters</Button>
          <SheetClose asChild>
            <Button variant="secondary" onClick={clearAllFilters}>Clear All</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default VoucherSidebar;
