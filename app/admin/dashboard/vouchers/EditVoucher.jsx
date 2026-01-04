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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DynamicListInput } from "@/components/ui/dynamic-list-input";
import { toast } from "sonner";

export function EditVoucher({ voucher, onSuccess }) {
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

  // Load voucher data when dialog opens
  useEffect(() => {
    if (open && voucher) {
      fetchCategories();
      fetchBrands();
      
      setFormData({
        title: voucher.title || "",
        code: voucher.code || "",
        category: voucher.category?._id || "",
        brand: voucher.brand?._id || "",
        minOrderAmount: voucher.minOrder || "",
        expiryDate: voucher.expiryDate ? new Date(voucher.expiryDate).toISOString().split('T')[0] : "",
        termsAndConditions: voucher.termsAndConditions || [],
        howToUse: voucher.stepsToUse || [],
      });
    }
  }, [open, voucher]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands');
      const result = await response.json();
      
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.termsAndConditions.length === 0) {
      toast.error("Please add at least one term or condition");
      return;
    }
    
    if (formData.howToUse.length === 0) {
      toast.error("Please add at least one step for how to use");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: voucher._id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Voucher updated successfully');
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || 'Failed to update voucher');
      }
    } catch (error) {
      console.error("Failed to update voucher:", error);
      toast.error('An error occurred while updating the voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit voucher</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] scrollbar max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bebas text-primary">
              Edit Voucher
            </DialogTitle>
            <DialogDescription>
              Update the voucher details below.
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
                        <SelectItem key={category._id} value={category._id}>
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
                        <SelectItem key={brand._id} value={brand._id}>
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
                      className="pl-10 focus:border-primary"
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
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="brand" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
