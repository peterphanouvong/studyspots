"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * `next/image` with a pulsing Skeleton placeholder that fades out once the
 * image loads. The parent must be positioned (these always use `fill`), so the
 * skeleton can fill it. Handles already-cached images via the `complete` check.
 */
export function ImageWithSkeleton({ className, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Cached images may finish before React attaches `onLoad`.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && (
        <Skeleton className="absolute inset-0 size-full rounded-none" />
      )}
      <Image
        ref={ref}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    </>
  );
}
