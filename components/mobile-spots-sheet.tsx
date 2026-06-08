"use client";

import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Map as MapIcon } from "lucide-react";
import { SpotList } from "@/components/spot-list";
import { cn } from "@/lib/utils";
import type { Coords } from "@/lib/distance";
import type { Spot } from "@/lib/types";
import { Button } from "./ui/button";

const PEEK_PX = 120; // visible height at the collapsed peek

/** Snap points as fractions of the viewport (all same type — vaul-friendly).
 *  Full = 1 (to the top); the header + filters sit above it via z-index. */
function computeSnaps(height: number): [number, number, number] {
  return [PEEK_PX / height, 0.5, 1];
}

interface MobileSpotsSheetProps {
  spots: Spot[];
  origin?: Coords;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
  countLabel: string;
  /** Called when the sheet settles on the half snap, to re-fit the map. */
  onRecenter?: () => void;
}

/**
 * Airbnb-style bottom sheet (mobile only). Snaps between a peek showing the
 * count, a half view (map + list), and a full list that stops below the header.
 */
export function MobileSpotsSheet({
  spots,
  origin,
  activeId,
  onActiveChange,
  countLabel,
  onRecenter,
}: MobileSpotsSheetProps) {
  const [snaps, setSnaps] = useState<[number, number, number]>(() =>
    computeSnaps(typeof window === "undefined" ? 800 : window.innerHeight),
  );
  useEffect(() => {
    const update = () => setSnaps(computeSnaps(window.innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [snap, setSnap] = useState<number | string | null>(snaps[1]);

  const handleSnap = (next: number | string | null) => {
    setSnap(next);
    if (next === snaps[1]) onRecenter?.();
  };

  const atFull = typeof snap === "number" && snap >= snaps[2] - 0.001;

  const goHalf = () => {
    setSnap(snaps[1]);
    onRecenter?.();
  };

  const goPeak = () => setSnap(snaps[0]);

  // Pull the list down from the top (when fully open) to drop back to half.
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const didCollapse = useRef(false);

  return (
    <>
      <Drawer.Root
        open
        modal={false}
        dismissible={false}
        snapPoints={snaps}
        activeSnapPoint={snap}
        setActiveSnapPoint={handleSnap}
      >
        <Drawer.Portal>
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-40 flex h-dvh flex-col rounded-t-2xl border-t bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.12)] outline-none focus:outline-none focus-visible:outline-none md:hidden">
            <Drawer.Handle className="mx-auto mt-3 mb-2 w-10! bg-border!" />
            <Drawer.Title className="px-5 pb-3 font-heading text-lg font-bold tracking-tight">
              {countLabel}
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              List of study spots in the current map area.
            </Drawer.Description>
            <div
              ref={scrollRef}
              data-vaul-no-drag
              onTouchStart={(e) => {
                dragStartY.current = e.touches[0].clientY;
                didCollapse.current = false;
              }}
              onTouchMove={(e) => {
                const el = scrollRef.current;
                if (!el || dragStartY.current === null || didCollapse.current) {
                  return;
                }
                if (atFull && el.scrollTop <= 0) {
                  const dy = e.touches[0].clientY - dragStartY.current;
                  if (dy > 40) {
                    didCollapse.current = true;
                    goHalf();
                  }
                }
              }}
              className={cn(
                "flex-1 overflow-y-auto px-5 pb-28",
                atFull && "pt-24", // clear the chrome the sheet now sits under
              )}
            >
              <SpotList
                spots={spots}
                origin={origin}
                activeId={activeId}
                onActiveChange={onActiveChange}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {atFull && (
        <Button
          type="button"
          variant="dark"
          size="lg"
          onClick={goPeak}
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 shadow-lg md:hidden"
        >
          <MapIcon className="size-4" />
          Map
        </Button>
      )}
    </>
  );
}
