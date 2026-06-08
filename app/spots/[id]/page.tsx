import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AtSign,
  Clock,
  Globe,
  Info,
  MapPin,
  Navigation,
  Store,
} from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";
import { OffersGrid } from "@/components/offers-grid";
import { SiteHeader } from "@/components/site-header";
import { TrackedLink } from "@/components/tracked-link";
import { VerificationModule } from "@/components/verification-module";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FORM_LINKS } from "@/lib/links";
import { formatTodayHours, isOpenNow } from "@/lib/hours";
import { SPOTS } from "@/lib/spots";

export function generateStaticParams() {
  return SPOTS.map((spot) => ({ id: spot.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const spot = SPOTS.find((s) => s.id === id);
  if (!spot) return { title: "Spot not found" };
  const desc = `${spot.suburb} · ${spot.outletCount} outlets · ${
    spot.hasWifi ? "WiFi" : "no WiFi"
  } · ${spot.noiseLevel.toLowerCase()}. Can you study here?`;
  return {
    title: spot.name,
    description: desc,
    openGraph: { title: `${spot.name} · Study Spots`, description: desc },
    twitter: { title: `${spot.name} · Study Spots`, description: desc },
  };
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = SPOTS.find((s) => s.id === id);
  if (!spot) notFound();

  const open = isOpenNow(spot.hours);

  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All spots
        </Link>

        <GalleryGrid images={spot.images} alt={spot.name} />

        <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight">
          {spot.name}
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {spot.address}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          <Clock className="size-4 shrink-0 text-muted-foreground" />
          <span
            className={
              open
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : "font-medium text-rose-600 dark:text-rose-400"
            }
          >
            {open ? "Open now" : "Closed"}
          </span>
          <span className="text-muted-foreground">
            · {formatTodayHours(spot.hours)}
          </span>
        </p>
      </div>

      <TrackedLink
        href={spot.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        event="directions_clicked"
        eventProps={{ id: spot.id, name: spot.name }}
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        <Navigation className="size-4" />
        Get Directions
      </TrackedLink>

      {(spot.website || spot.instagram) && (
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
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          What this spot offers
        </h2>
        <OffersGrid spot={spot} />
      </div>

      {spot.houseRules && spot.houseRules.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Good to know
          </h2>
          <ul className="rounded-2xl bg-card p-5">
            {spot.houseRules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 py-1.5 text-sm"
              >
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      <VerificationModule spotId={spot.id} />

      <TrackedLink
        href={FORM_LINKS.claimCafe || "#"}
        target="_blank"
        rel="noopener noreferrer"
        event="claim_cafe_clicked"
        eventProps={{ id: spot.id, name: spot.name }}
        className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4 text-sm transition-colors hover:brightness-95"
      >
        <span className="flex items-center gap-2">
          <Store className="size-4 text-muted-foreground" />
          <span>
            <span className="font-medium">Is this your cafe?</span>
            <span className="text-muted-foreground"> — claim it & get in touch.</span>
          </span>
        </span>
        <span className="shrink-0 text-muted-foreground">→</span>
      </TrackedLink>
      </div>
    </>
  );
}
