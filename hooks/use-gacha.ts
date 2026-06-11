"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createGachaAudio, type GachaAudio } from "@/lib/gacha-audio";
import type { Spot } from "@/lib/types";

/**
 * Spot Gacha state machine.
 *
 *   idle ──start──▶ spinning ──(timeline ends)──▶ celebrating ──▶ revealed
 *     ▲                                                              │
 *     └──────────────────────── dismiss ◀───────────────────────────┘
 *
 * The winner is chosen up front on `start`; the spin is pure theatre that lands
 * on the pre-chosen index. A single requestAnimationFrame loop drives the whole
 * sequence (frame-rate independent), so there are no N intervals to thrash.
 */
export type GachaPhase = "idle" | "spinning" | "celebrating" | "revealed";

const MUTE_KEY = "gacha-muted";
const CELEBRATE_MS = 850;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function readMutedPref(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false; // localStorage unavailable (e.g. private mode)
  }
}

interface Schedule {
  /** Cumulative ms timestamp of each highlight hop. */
  times: number[];
  /** Total run time in ms (== last hop). */
  total: number;
  /** Highlight index at hop `i` (sequential walk landing on the winner). */
  indexAt: (i: number) => number;
}

/**
 * Builds the hop timeline: intervals accelerate (slow → fast) over the first
 * leg, then decelerate (fast → slow) into the winner. The index walks
 * sequentially, with the start offset chosen so the final hop is the winner.
 */
function buildSchedule(n: number, winnerIndex: number): Schedule {
  const ACCEL = 12;
  const DECEL = 9;
  const FAST = 45;
  const SLOW_START = 115;
  const SLOW_END = 300;

  const times: number[] = [];
  let t = 0;

  for (let i = 0; i < ACCEL; i++) {
    const p = i / (ACCEL - 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    t += SLOW_START + (FAST - SLOW_START) * eased;
    times.push(t);
  }
  for (let i = 0; i < DECEL; i++) {
    const p = (i + 1) / DECEL;
    const eased = p * p * p; // easeInCubic
    t += FAST + (SLOW_END - FAST) * eased;
    times.push(t);
  }

  const hops = times.length;
  const startOffset = (((winnerIndex - (hops - 1)) % n) + n) % n;
  return { times, total: t, indexAt: (i) => (startOffset + i) % n };
}

export interface UseGacha {
  phase: GachaPhase;
  /** Index into `spots` that is currently lit. */
  highlightIndex: number;
  /** The chosen spot — set as soon as `start` runs. */
  winner: Spot | null;
  /** Snapshot of the pool being spun (frozen at `start`). */
  spots: Spot[];
  muted: boolean;
  /** True whenever a spin/reveal is in progress — drives the interaction lock. */
  isLocked: boolean;
  start: (pool: Spot[]) => void;
  dismiss: () => void;
  toggleMute: () => void;
}

export function useGacha(options?: {
  /** Fired the moment the winner is locked in (spin landed / reveal). */
  onReveal?: (winner: Spot) => void;
}): UseGacha {
  const [phase, setPhase] = useState<GachaPhase>("idle");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [winner, setWinner] = useState<Spot | null>(null);
  const [muted, setMuted] = useState<boolean>(readMutedPref);

  const audioRef = useRef<GachaAudio | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Read live inside the rAF loop so a mute toggle mid-spin takes effect.
  const mutedRef = useRef(muted);
  const phaseRef = useRef<GachaPhase>("idle");
  // Keep the reveal callback fresh without re-creating the stable `start`.
  const onRevealRef = useRef(options?.onReveal);
  useEffect(() => {
    onRevealRef.current = options?.onReveal;
  });

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearTimers = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      try {
        localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setWinner(null);
  }, [clearTimers]);

  const start = useCallback((pool: Spot[]) => {
    if (phaseRef.current !== "idle" || pool.length === 0) return;

    if (!audioRef.current) audioRef.current = createGachaAudio();
    const audio = audioRef.current;
    const reduced = prefersReducedMotion();
    const audible = () => !mutedRef.current && !reduced;
    if (audible()) audio.resume();

    const winnerIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[winnerIndex];
    setSpots(pool);
    setWinner(chosen);

    // No suspense to build with one option, or when motion is reduced.
    if (pool.length === 1 || reduced) {
      setHighlightIndex(winnerIndex);
      setPhase("revealed");
      if (audible()) audio.chime();
      onRevealRef.current?.(chosen);
      return;
    }

    const sched = buildSchedule(pool.length, winnerIndex);
    setHighlightIndex(sched.indexAt(0));
    setPhase("spinning");
    if (!mutedRef.current) audio.tick(); // first tick on the gesture

    const startTime = performance.now();
    let hop = 0;

    const loop = () => {
      const elapsed = performance.now() - startTime;

      if (elapsed >= sched.total) {
        setHighlightIndex(winnerIndex);
        setPhase("celebrating");
        if (!mutedRef.current) audio.chime();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([0, 35, 25, 60]);
        }
        onRevealRef.current?.(chosen);
        timeoutRef.current = setTimeout(() => setPhase("revealed"), CELEBRATE_MS);
        rafRef.current = null;
        return;
      }

      while (hop < sched.times.length && elapsed >= sched.times[hop]) {
        hop++;
        setHighlightIndex(sched.indexAt(hop));
        if (!mutedRef.current) audio.tick();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  return {
    phase,
    highlightIndex,
    winner,
    spots,
    muted,
    isLocked: phase !== "idle",
    start,
    dismiss,
    toggleMute,
  };
}
