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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Calendar, IndianRupee, Save } from "lucide-react";

export function EditVoucher({ voucher }) {
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
    termsAndConditions: "",
    howToUse: "",
  });

  // Load voucher data when dialog opens
  useEffect(() => {
    if (open && voucher) {
      setFormData({
        title: voucher.title || "",
        code: voucher.code || "",
        category: voucher.category || "",
        brand: voucher.brand.name || "",
        minOrderAmount: voucher.minOrder?.toString() || "",
        expiryDate: voucher.expiryDate || "",
        termsAndConditions: voucher.termsAndConditions || "",
        howToUse: voucher.howToUse || "",
      });
      fetchCategories();
      fetchBrands();
    }
  }, [open, voucher]);

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
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
      console.log("Updating voucher:", voucher.id, formData);
      
      setOpen(false);
    } catch (error) {
      console.error("Failed to update voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit voucher</TooltipContent>
      </Tooltip>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bebas text-primary">
            Edit Voucher
          </DialogTitle>
          <DialogDescription>
            Update the voucher details below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Row 1: Title and Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">
                  Voucher Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., 50% OFF on Electronics"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">
                  Voucher Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-code"
                  placeholder="e.g., ELEC50"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  required
                  className="focus:border-primary uppercase"
                />
              </div>
            </div>

            {/* Row 2: Category and Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger className="focus:border-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brand">
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
                      <SelectItem key={brand.id} value={brand.name}>
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
                <Label htmlFor="edit-minOrderAmount">
                  Minimum Order Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="edit-minOrderAmount"
                    type="number"
                    placeholder="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => handleInputChange("minOrderAmount", e.target.value)}
                    required
                    min="0"
                    className="pl-10 focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Terms and Conditions */}
            <div className="space-y-2">
              <Label htmlFor="edit-terms">
                Terms & Conditions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-terms"
                placeholder="Enter terms and conditions (one per line)"
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
                required
                rows={4}
                className="focus:border-primary resize-none"
              />
            </div>

            {/* Row 5: How to Use */}
            <div className="space-y-2">
              <Label htmlFor="edit-howToUse">
                How to Use <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-howToUse"
                placeholder="Enter step-by-step instructions"
                value={formData.howToUse}
                onChange={(e) => handleInputChange("howToUse", e.target.value)}
                required
                rows={4}
                className="focus:border-primary resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 ">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="brand" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
