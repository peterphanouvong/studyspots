import { Clock } from "lucide-react";
import { formatTodayHours, isOpenNow } from "@/lib/hours";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

/** "Open now · 7:00 AM – 5:00 PM" status line. `compact` drops the clock icon. */
export function OpenStatus({
  spot,
  compact = false,
  className,
}: {
  spot: Spot;
  compact?: boolean;
  className?: string;
}) {
  const open = isOpenNow(spot.hours);
  return (
    <p className={cn("flex items-center gap-1.5 text-sm", className)}>
      {!compact && (
        <Clock className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span
        className={
          open
            ? "font-medium text-emerald-600 dark:text-emerald-400"
            : "font-medium text-rose-600 dark:text-rose-400"
        }
      >
        {open ? "Open now" : "Closed"}
      </span>
      <span className="truncate text-muted-foreground">
        · {formatTodayHours(spot.hours)}
      </span>
    </p>
  );
}
