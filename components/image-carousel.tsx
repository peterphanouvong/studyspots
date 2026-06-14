"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Coffee } from "lucide-react";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images?: string[];
  alt: string;
  className?: string;
  /**
   * Rendered width hint for next/image so it serves a correctly-sized image
   * instead of the full source. Defaults to the list-card layout.
   */
  sizes?: string;
}

/**
 * Lightweight scroll-snap carousel (no deps). Swipe on touch; arrows on hover
 * (desktop); dots show position. Safe inside a link — controls stop propagation.
 */
export function ImageCarousel({
  images,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const valid = images?.filter(Boolean) ?? [];

  if (valid.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground",
          className,
        )}
      >
        <Coffee className="size-10" strokeWidth={1.5} />
      </div>
    );
  }

  const go = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = trackRef.current;
    if (!el) return;
    const next = (i + valid.length) % valid.length;
    el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
    setIndex(next);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={cn("group/carousel relative overflow-hidden", className)}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {valid.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0 snap-center">
            <ImageWithSkeleton
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              sizes={sizes}
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {valid.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => go(index - 1, e)}
            className="absolute left-2 top-1/2 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white group-hover/carousel:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => go(index + 1, e)}
            className="absolute right-2 top-1/2 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white group-hover/carousel:flex"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {valid.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full bg-white/60 transition-all",
                  i === index && "w-3 bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
