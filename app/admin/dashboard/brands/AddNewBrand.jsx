"use client";
import { useState, useRef } from "react";
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
import { Plus, Upload, Link as LinkIcon, X, ImageIcon } from "lucide-react";

export function AddNewBrand() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "url"
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    setUploadMethod("file");
    
    // Create preview
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
      alert("Please enter a valid URL");
      return;
    }
    setLogoPreview(logoUrl);
    setUploadMethod("url");
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
      alert("Please enter a brand name");
      return;
    }

    if (!logoPreview) {
      alert("Please upload a brand logo");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const formData = new FormData();
      formData.append("name", brandName);
      
      if (uploadMethod === "file" && logoFile) {
        formData.append("logo", logoFile);
      } else if (uploadMethod === "url" && logoUrl) {
        formData.append("logoUrl", logoUrl);
      }

      console.log("Creating brand:", { brandName, uploadMethod, logoPreview });

      // Reset form
      setBrandName("");
      setLogoFile(null);
      setLogoUrl("");
      setLogoPreview("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create brand:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="brand">
          <Plus className="w-4 h-4 mr-2" />
          Add New Brand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary font-bebas">Add New Brand</DialogTitle>
          <DialogDescription>
            Upload a brand logo and enter the brand name
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label>
                Brand Logo <span className="text-red-500">*</span>
              </Label>

              {!logoPreview ? (
                <>
                  {/* Drag & Drop Area */}
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

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-gray-400">or</span>
                    </div>
                  </div>

                  {/* Import from URL */}
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
                // Logo Preview
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
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<div class="text-gray-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {logoFile?.name || "Logo from URL"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {logoFile 
                          ? `${(logoFile.size / 1024).toFixed(2)} KB`
                          : "External image"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Name Input */}
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Brand
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
