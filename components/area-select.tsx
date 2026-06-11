"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const ALL_AREAS = "all";

interface AreaSearchProps {
  suburbs: string[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Airbnb-style area picker: a compact rounded search pill that opens a
 * searchable command list of suburbs. Lives centered in the site header.
 */
export function AreaSearch({ suburbs, value, onChange }: AreaSearchProps) {
  const [open, setOpen] = useState(false);
  const hasArea = value !== ALL_AREAS;

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-9 items-center gap-2 rounded-full border bg-white py-1 pr-1 pl-4 text-sm shadow-sm transition hover:shadow-md cursor-pointer",
          "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        )}
      >
        <span
          className={cn(
            "max-w-28 truncate font-medium sm:max-w-44",
            hasArea ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {hasArea ? value : "Search areas"}
        </span>
        <span className={cn(buttonVariants({ size: "icon-sm" }), "size-7")}>
          <Search className="size-3.5" />
        </span>
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={10} className="w-72 gap-0 p-0">
        <Command>
          <CommandInput placeholder="Search areas" />
          <CommandList>
            <CommandEmpty>No areas found.</CommandEmpty>
            <CommandGroup heading="Areas">
              <CommandItem
                value="All areas"
                onSelect={() => select(ALL_AREAS)}
                data-checked={!hasArea}
              >
                All areas
              </CommandItem>
              {suburbs.map((suburb) => (
                <CommandItem
                  key={suburb}
                  value={suburb}
                  onSelect={() => select(suburb)}
                  data-checked={value === suburb}
                >
                  {suburb}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
