"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Check, X, ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { IconPicker, getIconComponent } from "@/components/ui/icon-picker";

export function CategorySheet() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("BookOpen");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingIcon, setEditingIcon] = useState("BookOpen");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("An error occurred while fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          icon: newCategoryIcon 
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category created successfully");
        setNewCategoryName("");
        setNewCategoryIcon("BookOpen");
        fetchCategories(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("An error occurred while creating the category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id, name, icon) => {
    setEditingId(id);
    setEditingName(name);
    setEditingIcon(icon || "BookOpen");
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: editingName.trim(),
          icon: editingIcon,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Category updated successfully");
        setEditingId(null);
        setEditingName("");
        fetchCategories(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating the category");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Categories <ChevronLeft /></Button>
      </SheetTrigger>
      <SheetContent className="gap-1 sm:max-w-lg">
        <SheetHeader className="pb-2">
          <SheetTitle>Categories</SheetTitle>
          <Separator />
        </SheetHeader>
        <div className="px-4 flex flex-col gap-4">
          {/* Create Category */}
          <div className="flex gap-2">
            <IconPicker
              value={newCategoryIcon}
              onChange={setNewCategoryIcon}
              disabled={isCreating}
            />
            <InputGroup className="flex-1">
              <InputGroupInput
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) {
                    handleCreate();
                  }
                }}
                disabled={isCreating}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="ghost"
                  onClick={handleCreate}
                  disabled={isCreating || !newCategoryName.trim()}
                >
                  {isCreating ? <Spinner className="h-4 w-4" /> : "Create"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Categories List */}
          <div className="space-y-3 mt-4 max-h-125 overflow-y-auto scrollbar">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              All Categories ({categories.length})
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-6 w-6" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No categories found. Create your first category above.
              </div>
            ) : (
              categories.map((category) => {
                const CategoryIcon = getIconComponent(category.icon);
                return (
                  <div
                    key={category._id}
                    className="flex items-center gap-2 border-b transition-colors py-2"
                  >
                    {editingId === category._id ? (
                      <>
                        <IconPicker
                          value={editingIcon}
                          onChange={setEditingIcon}
                        />
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit();
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                          className="h-9 flex-1"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm flex-1">
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(category._id, category.name, category.icon)}
                            disabled={deletingId === category._id}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(category._id)}
                            disabled={deletingId === category._id}
                          >
                            {deletingId === category._id ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
