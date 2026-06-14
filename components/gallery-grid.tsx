"use client";

import { useState } from "react";
import { Coffee, Grid2x2 } from "lucide-react";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { ImageCarousel } from "@/components/image-carousel";
import { cn } from "@/lib/utils";

/**
 * Desktop grid layout per photo count (1 photo is a single hero, handled
 * separately). `hero` makes the first tile span 2×2 as the focal image.
 */
const GALLERY_LAYOUTS: Record<number, { grid: string; hero: boolean }> = {
  2: { grid: "grid-cols-2", hero: false },
  3: { grid: "grid-cols-3 grid-rows-2", hero: true },
  4: { grid: "grid-cols-2 grid-rows-2", hero: false },
  5: { grid: "grid-cols-4 grid-rows-2", hero: true },
};

/**
 * Photo gallery for a spot:
 * - mobile: swipeable carousel
 * - desktop: layout adapts to photo count — single hero (1), split (2),
 *   hero + 2 stacked (3), 2×2 grid (4), Airbnb bento 1 large + 4 small (5+).
 *   Clicking any photo (or "Show all photos") opens a full-screen viewer.
 */
export function GalleryGrid({
  images,
  alt,
  mobileFullBleed = false,
}: {
  images?: string[];
  alt: string;
  /** Drop the carousel's rounded corners on mobile for an edge-to-edge image. */
  mobileFullBleed?: boolean;
}) {
  const pics = images?.filter(Boolean) ?? [];

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  if (pics.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-video w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground",
          mobileFullBleed ? "rounded-none md:rounded-2xl" : "rounded-2xl",
        )}
      >
        <Coffee className="size-12" strokeWidth={1.5} />
      </div>
    );
  }

  const bento = pics.slice(0, 5);

  const open = (i: number) => {
    setIndex(i);
    setVisible(true);
  };

  return (
    <div className="relative">
      {/* Mobile: carousel */}
      <div className="md:hidden">
        <ImageCarousel
          images={pics}
          alt={alt}
          className={cn(
            "aspect-video w-full",
            mobileFullBleed ? "rounded-none" : "rounded-2xl",
          )}
        />
      </div>

      {/* Desktop: layout adapts to photo count. Photos open a full-screen viewer. */}
      <div className="hidden md:block">
        {bento.length === 1 ? (
          <button
            type="button"
            onClick={() => open(0)}
            className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl"
          >
            <ImageWithSkeleton
              src={pics[0]}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </button>
        ) : (
          <div
            className={cn(
              "grid aspect-2/1 gap-2 overflow-hidden rounded-2xl",
              GALLERY_LAYOUTS[bento.length].grid,
            )}
          >
            {bento.map((src, i) => {
              const isHero = GALLERY_LAYOUTS[bento.length].hero && i === 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => open(i)}
                  className={cn(
                    "group relative block h-full w-full cursor-pointer overflow-hidden",
                    isHero && "col-span-2 row-span-2",
                  )}
                >
                  <ImageWithSkeleton
                    src={src}
                    alt={`${alt} — photo ${i + 1}`}
                    fill
                    sizes={isHero ? "(max-width: 1024px) 67vw, 672px" : "(max-width: 1024px) 33vw, 336px"}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Show all photos → full-screen viewer */}
      {pics.length > 1 && (
        <button
          type="button"
          onClick={() => open(0)}
          className="absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-white md:flex"
        >
          <Grid2x2 className="size-4" />
          Show all photos
        </button>
      )}

      <PhotoSlider
        images={pics.map((src, i) => ({ src, key: i }))}
        visible={visible}
        onClose={() => setVisible(false)}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}
