"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  BadgeCheck,
  Plug,
  Quote,
  Send,
  Volume2,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { coreAmenities, type AmenityIcon } from "@/lib/amenities";
import { distanceKm, formatDistance, type Coords } from "@/lib/distance";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const ICON: Record<AmenityIcon, LucideIcon> = {
  outlets: Plug,
  wifi: Wifi,
  noise: Volume2,
};

interface GachaMatchSheetProps {
  spot: Spot | null;
  origin?: Coords;
  open: boolean;
  onClose: () => void;
}

/** The reveal sheet — shown after the spin lands on a winner. */
export function GachaMatchSheet({
  spot,
  origin,
  open,
  onClose,
}: GachaMatchSheetProps) {
  if (!spot) return null;

  const amenities = coreAmenities(spot);

  async function copyFallback(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — send it to your study buddy!");
      track("gacha_shared", { id, method: "clipboard" });
    } catch {
      toast.error("Couldn't share — copy the link from the address bar.");
    }
  }

  async function handleShare() {
    if (!spot) return;
    const url = `${window.location.origin}/spots/${spot.id}`;
    const data = {
      title: spot.name,
      text: `Let's study at ${spot.name} in ${spot.suburb}`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        track("gacha_shared", { id: spot.id, method: "share" });
      } catch (err) {
        // User dismissed the share sheet — not an error.
        if ((err as Error)?.name !== "AbortError") {
          await copyFallback(url, spot.id);
        }
      }
      return;
    }
    await copyFallback(url, spot.id);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DrawerContent className="mx-auto max-w-md">
        <div className="px-5 pt-2 pb-1">
          {spot.verified && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="size-3.5" />
              Verified
            </span>
          )}

          <div className="flex items-baseline justify-between gap-2">
            <DrawerTitle className="font-heading text-xl font-bold tracking-tight">
              {spot.name}
            </DrawerTitle>
            {origin && (
              <span className="shrink-0 text-sm text-muted-foreground">
                {formatDistance(distanceKm(origin, spot))}
              </span>
            )}
          </div>
          <DrawerDescription className="mt-0.5">{spot.suburb}</DrawerDescription>

          {spot.foundersTip && (
            <div className="mt-4 rounded-2xl bg-primary/5 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <Quote className="size-3.5" />
                Founder&apos;s tip
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {spot.foundersTip}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {amenities.map((a) => {
              const Icon = ICON[a.key];
              return (
                <span
                  key={a.key}
                  className={cn(
                    "inline-flex items-center gap-1.5",
                    !a.available && "line-through opacity-70",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {a.label}
                </span>
              );
            })}
          </div>
        </div>

        <DrawerFooter className="gap-2">
          <Button type="button" size="lg" onClick={handleShare}>
            <Send className="size-4" />
            Send to Study Buddy
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link
                href={`/spots/${spot.id}`}
                onClick={() =>
                  track("spot_card_clicked", {
                    id: spot.id,
                    name: spot.name,
                    suburb: spot.suburb,
                    from: "gacha",
                  })
                }
              >
                View details
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="ghost" size="lg" className="flex-1">
                Done
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
