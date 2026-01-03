"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  GraduationCap,
  Building2,
  Train,
  School,
  Briefcase,
  Heart,
  Calculator,
  Globe,
  Trophy,
  User,
  Users,
  Code,
  Laptop,
  Book,
  Lightbulb,
  Target,
  Award,
  CheckCircle2,
  Star,
  Shield,
  Zap,
  Crown,
  Rocket,
  Flag,
  Hamburger,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Available icons for categories
const ICONS = [
  { name: "BookOpen", icon: BookOpen },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Building2", icon: Building2 },
  { name: "Train", icon: Train },
  { name: "School", icon: School },
  { name: "Briefcase", icon: Briefcase },
  { name: "Heart", icon: Heart },
  { name: "Calculator", icon: Calculator },
  { name: "Globe", icon: Globe },
  { name: "Trophy", icon: Trophy },
  { name: "User", icon: User },
  { name: "Users", icon: Users },
  { name: "Code", icon: Code },
  { name: "Laptop", icon: Laptop },
  { name: "Book", icon: Book },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Target", icon: Target },
  { name: "Award", icon: Award },
  { name: "CheckCircle2", icon: CheckCircle2 },
  { name: "Star", icon: Star },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "Crown", icon: Crown },
  { name: "Rocket", icon: Rocket },
  { name: "Flag", icon: Flag },
  { name: "Food", icon: Hamburger}
];

export function IconPicker({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);

  // Get the selected icon component
  const SelectedIcon = ICONS.find((icon) => icon.name === value)?.icon || BookOpen;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[60px] h-9 justify-center"
          disabled={disabled}
        >
          <SelectedIcon className="h-4 w-4 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2">
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((iconItem) => {
            const IconComponent = iconItem.icon;
            return (
              <Button
                key={iconItem.name}
                variant="ghost"
                className={cn(
                  "h-10 w-10 p-0 hover:bg-accent",
                  value === iconItem.name && "bg-accent text-primary"
                )}
                onClick={() => {
                  onChange(iconItem.name);
                  setOpen(false);
                }}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Helper function to get icon component by name
export function getIconComponent(iconName) {
  return ICONS.find((icon) => icon.name === iconName)?.icon || BookOpen;
}
