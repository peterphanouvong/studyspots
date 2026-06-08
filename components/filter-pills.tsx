"use client";

import { Clock, Moon, Plug, Volume2, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterKey = "outlets" | "wifi" | "quiet" | "openNow" | "openLate";

export type Filters = Record<FilterKey, boolean>;

export const EMPTY_FILTERS: Filters = {
  outlets: false,
  wifi: false,
  quiet: false,
  openNow: false,
  openLate: false,
};

const PILLS: { key: FilterKey; label: string; icon: LucideIcon }[] = [
  { key: "openNow", label: "Open Now", icon: Clock },
  { key: "openLate", label: "Open Late", icon: Moon },
  { key: "outlets", label: "Has Outlets", icon: Plug },
  { key: "wifi", label: "Has WiFi", icon: Wifi },
  { key: "quiet", label: "Quiet", icon: Volume2 },
];

interface FilterPillsProps {
  filters: Filters;
  onToggle: (key: FilterKey) => void;
}

export function FilterPills({ filters, onToggle }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PILLS.map(({ key, label, icon: Icon }) => {
        const active = filters[key];
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(key)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-sm",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-3.5 sm:size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
