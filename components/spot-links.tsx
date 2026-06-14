import { AtSign, Globe, MapPin } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { buttonVariants } from "@/components/ui/button";
import type { Spot } from "@/lib/types";

/** Website · Instagram · Open in Google Maps — the secondary outbound links. */
export function SpotLinks({ spot }: { spot: Spot }) {
  return (
    <div className="flex flex-wrap gap-2">
      {spot.website && (
        <TrackedLink
          href={spot.website}
          target="_blank"
          rel="noopener noreferrer"
          event="external_link_clicked"
          eventProps={{ id: spot.id, kind: "website" }}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Globe className="size-4" />
          Website
        </TrackedLink>
      )}
      {spot.instagram && (
        <TrackedLink
          href={`https://instagram.com/${spot.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          event="external_link_clicked"
          eventProps={{ id: spot.id, kind: "instagram" }}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <AtSign className="size-4" />
          {spot.instagram}
        </TrackedLink>
      )}
      <TrackedLink
        href={spot.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        event="directions_clicked"
        eventProps={{ id: spot.id, name: spot.name }}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <MapPin className="size-4" />
        Open in Google Maps
      </TrackedLink>
    </div>
  );
}
