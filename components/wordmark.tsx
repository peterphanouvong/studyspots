import { cn } from "@/lib/utils";

/**
 * Brand wordmark: "Study Spots" in Soft Black with a Deep Teal dot —
 * a quiet nod to a map pin / location dot.
 *
 * `compact` renders just the "S" + dot mark (matching the favicon),
 * keeping the full name available to screen readers.
 */
export function Wordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-heading font-bold tracking-tight text-foreground",
        className,
      )}
    >
      {compact ? (
        <>
          <span aria-hidden>S</span>
          <span className="sr-only">Study Spots</span>
        </>
      ) : (
        "Study Spots"
      )}
      <span
        aria-hidden
        className="ml-[0.1em] inline-block rounded-full bg-primary align-baseline"
        style={{ width: "0.28em", height: "0.28em" }}
      />
      {!compact && <span className="sr-only">.</span>}
    </span>
  );
}
