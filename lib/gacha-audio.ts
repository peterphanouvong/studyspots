/**
 * Spot Gacha sound engine — pure Web Audio, no asset files.
 *
 * Browsers block audio until the user interacts with the page. The AudioContext
 * is created lazily on first use, which the hook triggers from the gacha
 * button's click handler — so it lands inside a user gesture and isn't blocked.
 */
export interface GachaAudio {
  /** Resume a suspended context (call from the click gesture). */
  resume(): void;
  /** A short percussive click — one per highlight hop. */
  tick(): void;
  /** A bright arpeggio for the winning reveal. */
  chime(): void;
}

type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

export function createGachaAudio(): GachaAudio {
  let ctx: AudioContext | null = null;

  function ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const w = window as WindowWithWebkitAudio;
      const AC = w.AudioContext ?? w.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  return {
    resume() {
      const c = ensure();
      if (c && c.state === "suspended") void c.resume();
    },

    tick() {
      const c = ensure();
      if (!c) return;
      const t = c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(840, t);
      // Fast attack + decay = a tight "click".
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      osc.connect(gain).connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    },

    chime() {
      const c = ensure();
      if (!c) return;
      const t0 = c.currentTime;
      // C5 · E5 · G5 · C6 — a happy major arpeggio.
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const t = t0 + i * 0.085;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(gain).connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    },
  };
}
