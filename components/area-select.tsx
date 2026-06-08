"use client";

import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ALL_AREAS = "all";

interface AreaSelectProps {
  suburbs: string[];
  value: string;
  onChange: (value: string) => void;
}

export function AreaSelect({ suburbs, value, onChange }: AreaSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full gap-1.5 sm:w-48">
        <MapPin className="size-4 text-muted-foreground" />
        <SelectValue placeholder="All areas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_AREAS}>All areas</SelectItem>
        {suburbs.map((suburb) => (
          <SelectItem key={suburb} value={suburb}>
            {suburb}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
