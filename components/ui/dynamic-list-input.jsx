"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, GripVertical } from "lucide-react";

export function DynamicListInput({ 
  items = [], 
  onChange, 
  placeholder = "Enter item...", 
  label = "Item",
  required = false 
}) {
  const [currentInput, setCurrentInput] = useState("");

  const addItem = () => {
    if (currentInput.trim()) {
      onChange([...items, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-3">
      {/* Add new item input */}
      <div className="flex gap-2">
        <Input
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 focus:border-primary"
        />
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          size="icon"
          className="shrink-0"
          disabled={!currentInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* List of items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-white/20 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
              <div className="flex-1 text-sm wrap-break-word">
                <span className="text-gray-400 mr-2">{index + 1}.</span>
                {item}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-7 w-7 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state with validation hint */}
      {items.length === 0 && (
        <div className="text-center py-4 border border-dashed border-white/10 rounded-lg">
          <p className="text-sm text-gray-400">
            {required ? "Add at least one item (required)" : "No items added yet"}
          </p>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        Press Enter or click + to add. Total: {items.length} {items.length === 1 ? 'item' : 'items'}
      </p>
    </div>
  );
}
