"use client";

import { Coffee, Grid2x2 } from "lucide-react";
import { ImageCarousel } from "@/components/image-carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Photo gallery for a spot:
 * - mobile: swipeable carousel
 * - desktop: Airbnb-style bento (1 large + 4 small) when there are 5+ photos,
 *   otherwise a single hero. "Show all photos" opens a lightbox.
 */
export function GalleryGrid({
  images,
  alt,
}: {
  images?: string[];
  alt: string;
}) {
  const pics = images?.filter(Boolean) ?? [];

  if (pics.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-muted text-muted-foreground">
        <Coffee className="size-12" strokeWidth={1.5} />
      </div>
    );
  }

  const bento = pics.slice(0, 5);

  return (
    <div className="relative">
      {/* Mobile: carousel */}
      <div className="md:hidden">
        <ImageCarousel
          images={pics}
          alt={alt}
          className="aspect-video w-full rounded-2xl"
        />
      </div>

      {/* Desktop: bento grid (5+) or single hero */}
      <div className="hidden md:block">
        {bento.length >= 5 ? (
          <div className="grid aspect-[2/1] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
            {bento.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                className={cn(
                  "h-full w-full object-cover",
                  i === 0 && "col-span-2 row-span-2",
                )}
              />
            ))}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pics[0]}
            alt={alt}
            className="aspect-video w-full rounded-2xl object-cover"
          />
        )}
      </div>

      {/* Show all photos → lightbox */}
      {pics.length > 1 && (
        <Dialog>
          <DialogTrigger className="absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-white md:flex">
            <Grid2x2 className="size-4" />
            Show all photos
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogTitle>{alt} — photos</DialogTitle>
            <div className="flex flex-col gap-3">
              {pics.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${alt} — photo ${i + 1}`}
                  className="w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
