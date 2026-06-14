import { Quote } from "lucide-react";
import type { Spot } from "@/lib/types";

/** The founder's personal one-liner about a spot, as a highlighted callout. */
export function FoundersTip({ spot }: { spot: Spot }) {
  if (!spot.foundersTip) return null;
  return (
    <div className="rounded-2xl bg-primary/5 p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
        <Quote className="size-3.5" />
        Founder&apos;s tip
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">
        {spot.foundersTip}
      </p>
    </div>
  );
}
