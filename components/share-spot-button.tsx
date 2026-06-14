"use client";

import { Coffee } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

/**
 * Primary CTA on a cafe page — "Invite someone to coffee". Shares the spot via
 * the native share sheet, falling back to copying the link. Each share is a
 * traction signal (`spot_shared`).
 */
export function ShareSpotButton({
  spot,
  label = "Invite someone to coffee",
  className,
}: {
  spot: Pick<Spot, "id" | "name" | "suburb">;
  label?: string;
  className?: string;
}) {
  async function copyFallback(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — go invite someone to coffee!");
      track("spot_shared", { id: spot.id, method: "clipboard" });
    } catch {
      toast.error("Couldn't share — copy the link from the address bar.");
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/spots/${spot.id}`;
    const data = {
      title: spot.name,
      text: `Let's grab a coffee & study at ${spot.name} in ${spot.suburb}`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        track("spot_shared", { id: spot.id, method: "share" });
      } catch (err) {
        // User dismissed the share sheet — not an error.
        if ((err as Error)?.name !== "AbortError") {
          await copyFallback(url);
        }
      }
      return;
    }
    await copyFallback(url);
  }

  return (
    <Button
      type="button"
      size="lg"
      className={cn("w-full", className)}
      onClick={handleShare}
    >
      <Coffee className="size-4" />
      {label}
    </Button>
  );
}
