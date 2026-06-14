import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** A warm "Founder favourite" pill for the founder's personal picks. */
export function FounderFavouriteBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm",
        className,
      )}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      Founder favourite
    </span>
  );
}
