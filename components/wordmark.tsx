import { cn } from "@/lib/utils";

/**
 * Brand wordmark: "Study Spots" in Soft Black with a Deep Teal dot —
 * a quiet nod to a map pin / location dot.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading font-bold tracking-tight text-foreground",
        className,
      )}
    >
      Study&nbsp;Spots
      <span
        aria-hidden
        className="ml-[0.1em] inline-block rounded-full bg-primary align-baseline"
        style={{ width: "0.28em", height: "0.28em" }}
      />
      <span className="sr-only">.</span>
    </span>
  );
}
