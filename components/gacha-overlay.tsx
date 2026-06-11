"use client";

import { useEffect, useRef } from "react";
import { MapPin, Volume2, VolumeX, X } from "lucide-react";
import type { GachaPhase } from "@/hooks/use-gacha";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    tx: `${Math.round(Math.cos(angle) * 64)}px`,
    ty: `${Math.round(Math.sin(angle) * 64)}px`,
  };
});

interface GachaOverlayProps {
  phase: GachaPhase;
  spots: Spot[];
  highlightIndex: number;
  winner: Spot | null;
  muted: boolean;
  onToggleMute: () => void;
  onCancel: () => void;
}

/**
 * Full-screen spin animation. Fixed layer (no map-camera movement, so no jank).
 * The lit chip cycles through the pool, then the winner pops with a neon glow.
 */
export function GachaOverlay({
  phase,
  spots,
  highlightIndex,
  winner,
  muted,
  onToggleMute,
  onCancel,
}: GachaOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const open = phase === "spinning" || phase === "celebrating";
  const celebrating = phase === "celebrating";

  useEffect(() => {
    if (!open) return;
    containerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Spinning for a study spot"
      tabIndex={-1}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-gray-950/92 px-6 outline-none backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <button
        type="button"
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        onClick={onToggleMute}
        className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
      </button>

      <p
        aria-live="polite"
        className="font-heading text-lg font-semibold text-white/90"
      >
        {celebrating && winner ? winner.name : "Finding your spot…"}
      </p>

      <div className="flex max-w-md flex-wrap items-center justify-center gap-2.5">
        {spots.map((spot, i) => {
          const lit = i === highlightIndex;
          const isWinner = celebrating && winner?.id === spot.id;
          return (
            <div
              key={spot.id}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[transform,background-color,color] duration-75 will-change-transform",
                lit
                  ? "border-transparent bg-(--gacha-neon) text-white"
                  : "border-white/15 bg-white/5 text-white/55",
                lit && !isWinner && "scale-110",
                isWinner && "gacha-glow gacha-pop scale-125",
              )}
            >
              <MapPin className="size-3.5" strokeWidth={2.25} />
              <span className="max-w-28 truncate">{spot.name}</span>

              {isWinner &&
                PARTICLES.map((p, pi) => (
                  <span
                    key={pi}
                    aria-hidden
                    className="gacha-particle absolute left-1/2 top-1/2 size-1.5 rounded-full bg-(--gacha-neon)"
                    style={
                      {
                        "--tx": p.tx,
                        "--ty": p.ty,
                      } as React.CSSProperties
                    }
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
