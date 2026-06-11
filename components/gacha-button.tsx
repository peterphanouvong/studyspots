"use client";

import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GachaButtonProps {
  onStart: () => void;
  disabled: boolean;
  className?: string;
}

/**
 * "Spot Gacha" entry point — the playful primary action. Brand-green pill built
 * on the shared Button. Disabled while a spin is running or 0 spots match.
 */
export function GachaButton({ onStart, disabled, className }: GachaButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      onClick={onStart}
      disabled={disabled}
      aria-label="Spot Gacha — teleport to a random study spot"
      className={cn("rounded-full", className)}
    >
      <Dices className="size-4" />
      Spot Gacha
    </Button>
  );
}
