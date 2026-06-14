import { Bath, KeyRound, Plug, Volume2, Wifi, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrackedLink } from "@/components/tracked-link";
import { cafeProperties, type CafePropertyKey } from "@/lib/cafe-info";
import { FORM_LINKS } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

/** Per-property icons; `off` is used when the property is confirmed absent. */
const PROPERTY_ICON: Record<
  CafePropertyKey,
  { on: LucideIcon; off?: LucideIcon }
> = {
  outlets: { on: Plug },
  wifi: { on: Wifi, off: WifiOff },
  bathrooms: { on: Bath },
};

/** A labelled field that shows a value, or a "+ Add" prompt linking to the edit form. */
function ValueField({
  spot,
  field,
  label,
  value,
  icon: Icon,
}: {
  spot: Spot;
  field: string;
  label: string;
  value?: string;
  icon: LucideIcon;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.75} />
        {label}
      </p>
      {value ? (
        <p className="mt-1.5 font-mono text-sm">{value}</p>
      ) : (
        <TrackedLink
          href={FORM_LINKS.suggestEdit || "#"}
          target="_blank"
          rel="noopener noreferrer"
          event="suggest_edit_clicked"
          eventProps={{ id: spot.id, field }}
          className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          + Add
        </TrackedLink>
      )}
    </div>
  );
}

/**
 * "Cafe info" — a flat Airbnb-style amenity list (icon + label, 2 columns).
 * Confirmed-absent properties are muted + struck through; unverified ones are
 * muted with a trailing "?". Plus noise level, vibe/music, and the editable
 * Wi-Fi password / restroom code fields.
 */
export function CafeInfo({ spot }: { spot: Spot }) {
  const props = cafeProperties(spot);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {props.map((p) => {
          const icons = PROPERTY_ICON[p.key];
          const Icon = p.state === "no" && icons.off ? icons.off : icons.on;
          const muted = p.state !== "yes";
          return (
            <div
              key={p.key}
              className={cn(
                "flex items-center gap-4",
                muted && "text-muted-foreground",
              )}
            >
              <Icon className="size-6 shrink-0" strokeWidth={1.5} />
              <span
                className={cn(
                  "text-[15px]",
                  p.state === "no" && "line-through",
                )}
              >
                {p.label}
                {p.state === "unknown" && (
                  <span className="ml-1.5 font-semibold">?</span>
                )}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-4">
          <Volume2 className="size-6 shrink-0" strokeWidth={1.5} />
          <span className="text-[15px]">
            Noise{" "}
            <span className="text-muted-foreground">· {spot.noiseLevel}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 border-t pt-5 sm:grid-cols-2">
        <ValueField
          spot={spot}
          field="wifi_password"
          label="Wi-Fi password"
          value={spot.wifiPassword}
          icon={Wifi}
        />
        <ValueField
          spot={spot}
          field="restroom_code"
          label="Restroom code"
          value={spot.restroomCode}
          icon={KeyRound}
        />
      </div>
      {((spot.vibe && spot.vibe.length > 0) ||
        (spot.music && spot.music !== "None")) && (
        <div className="flex flex-wrap items-center gap-2 border-t pt-5">
          {spot.vibe?.map((v) => (
            <Badge key={v} variant="accent">
              {v}
            </Badge>
          ))}
          {spot.music && spot.music !== "None" && (
            <Badge variant="accent">♪ {spot.music}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
