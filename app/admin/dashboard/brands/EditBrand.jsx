"use client";
import { useState, useRef, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Upload, Link as LinkIcon, X, Pencil } from "lucide-react";
import { toast } from "sonner";

export function EditBrand({ brand, onSuccess, trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState("url");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form with brand data when dialog opens
  useEffect(() => {
    if (open && brand) {
      setBrandName(brand.name || "");
      setWebsite(brand.website || "");
      setLogoPreview(brand.logo || "");
      setIsActive(brand.isActive ?? true);
      setIsFeatured(brand.isFeatured ?? false);
    }
  }, [open, brand]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    setUploadMethod("file");
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUrlImport = () => {
    if (!logoUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    setLogoPreview(logoUrl);
    setUploadMethod("url");
    setLogoUrl("");
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoUrl("");
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!brandName.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    if (!logoPreview) {
      toast.error("Please upload a brand logo");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: brand._id,
          name: brandName.trim(),
          logo: logoPreview,
          website: website.trim() || undefined,
          isActive,
          isFeatured,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Brand updated successfully");
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Failed to update brand");
      }
    } catch (error) {
      console.error("Failed to update brand:", error);
      toast.error("An error occurred while updating the brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80"
          onClick={() => setOpen(true)}
        >
          <Pencil className="w-4 h-4 mr-1" />
        </Button>
      )}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary font-bebas">
            Edit Brand
          </DialogTitle>
          <DialogDescription>
            Update brand information and logo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label>Brand Logo <span className="text-red-500">*</span></Label>

              {!logoPreview ? (
                <>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-all duration-200
                      ${dragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-white/20 hover:border-primary/50 hover:bg-white/5"
                      }
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-base font-medium mb-2">
                      Drag & Drop or Choose file to upload
                    </p>
                    <p className="text-sm text-gray-400">
                      Max 1 file · Up to 5MB
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-gray-400">or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logoUrl" className="text-sm">
                      Import from URL
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="logoUrl"
                          type="url"
                          placeholder="Add file URL"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="pr-10"
                        />
                        <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <Button
                        type="button"
                        onClick={handleUrlImport}
                        variant="outline"
                        disabled={!logoUrl.trim()}
                      >
                        Import
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative border border-white/10 rounded-lg p-4 bg-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="absolute top-2 right-2 h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {logoFile?.name || "Brand Logo"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {logoFile 
                          ? `${(logoFile.size / 1024).toFixed(2)} KB`
                          : "Current logo"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="brandName">
                Brand Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brandName"
                placeholder="e.g., Amazon, Flipkart"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className="focus:border-primary"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="focus:border-primary"
              />
            </div>

            {/* Status Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this brand visible to users
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Show in featured brands section
                  </p>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
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
                "Update Brand"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
