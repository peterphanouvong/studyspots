import {
  Armchair,
  Banknote,
  Car,
  Clock,
  Coffee,
  Cookie,
  Info,
  Laptop,
  MapPin,
  Plug,
  TrainFront,
  Users,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GoodToKnowIcon, Spot } from "@/lib/types";

const ICON: Record<GoodToKnowIcon, LucideIcon> = {
  parking: Car,
  clock: Clock,
  seating: Armchair,
  crowd: Users,
  dessert: Cookie,
  transit: TrainFront,
  wifi: Wifi,
  power: Plug,
  cash: Banknote,
  laptop: Laptop,
  coffee: Coffee,
  location: MapPin,
  info: Info,
};

/**
 * "Good to know" — founder-authored value-adds, each an icon + headline +
 * detail (Airbnb-highlights style). The real edge from having been there.
 */
export function GoodToKnow({ spot }: { spot: Spot }) {
  const items = spot.goodToKnow ?? [];
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const Icon = ICON[item.icon];
        return (
          <div
            key={item.title}
            className={cn(
              "flex items-start gap-4 py-4",
              i > 0 && "border-t border-border/60",
            )}
          >
            <Icon
              className="mt-0.5 size-6 shrink-0 text-foreground"
              strokeWidth={1.5}
            />
            <div className="flex flex-col gap-0.5">
              <p className="font-medium leading-tight">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
