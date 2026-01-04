"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar, IndianRupee, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DynamicListInput } from "@/components/ui/dynamic-list-input";

export function AddNewVoucher() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    category: "",
    brand: "",
    minOrderAmount: "",
    expiryDate: "",
    termsAndConditions: [],
    howToUse: [],
  });

  // Fetch categories and brands when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchBrands();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/categories');
      // const data = await response.json();
      // setCategories(data.categories);

      // Mock data for now
      setCategories([
        { id: "1", name: "E-commerce" },
        { id: "2", name: "Food Delivery" },
        { id: "3", name: "Fashion" },
        { id: "4", name: "Travel" },
        { id: "5", name: "Entertainment" },
      ]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/brands');
      // const data = await response.json();
      // setBrands(data.brands);

      // Mock data for now
      setBrands([
        { id: "1", name: "Amazon" },
        { id: "2", name: "Flipkart" },
        { id: "3", name: "Zomato" },
        { id: "4", name: "Swiggy" },
        { id: "5", name: "Myntra" },
      ]);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/vouchers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      console.log("Voucher data:", formData);

      // Reset form and close dialog
      setFormData({
        title: "",
        code: "",
        category: "",
        brand: "",
        minOrderAmount: "",
        expiryDate: "",
        termsAndConditions: [],
        howToUse: [],
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFormData({
      title: "",
      code: "",
      category: "",
      brand: "",
      minOrderAmount: "",
      expiryDate: "",
      termsAndConditions: [],
      howToUse: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="brand">
          <Plus className="w-4 h-4 mr-2" />
          Add New Voucher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] scrollbar max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bebas text-primary">
            Create New Voucher
          </DialogTitle>
          <DialogDescription>
            Fill in the voucher details below. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Row 1: Title and Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Voucher Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., 50% OFF on Electronics"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">
                  Voucher Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="e.g., ELEC50"
                  value={formData.code}
                  onChange={(e) =>
                    handleInputChange("code", e.target.value.toUpperCase())
                  }
                  required
                  className="focus:border-primary uppercase"
                />
              </div>
            </div>

            {/* Row 2: Category and Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  required
                >
                  <SelectTrigger className="focus:border-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange("brand", value)}
                  required
                >
                  <SelectTrigger className="focus:border-primary">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Min Order Amount and Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">
                  Minimum Order Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="minOrderAmount"
                    type="number"
                    placeholder="0"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      handleInputChange("minOrderAmount", e.target.value)
                    }
                    required
                    min="0"
                    className="pl-10 focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10 focus:border-primary "
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Terms and Conditions */}
            <div className="space-y-2">
              <Label>
                Terms & Conditions <span className="text-red-500">*</span>
              </Label>
              <DynamicListInput
                items={formData.termsAndConditions}
                onChange={(items) => handleInputChange("termsAndConditions", items)}
                placeholder="Enter a term or condition..."
                label="Term"
                required
              />
            </div>

            {/* Row 5: How to Use */}
            <div className="space-y-2">
              <Label>
                How to Use <span className="text-red-500">*</span>
              </Label>
              <DynamicListInput
                items={formData.howToUse}
                onChange={(items) => handleInputChange("howToUse", items)}
                placeholder="Enter a step..."
                label="Step"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={resetAll}
                  type="reset"
                  variant="ghost"
                  size="icon"
                >
                  <RotateCw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
