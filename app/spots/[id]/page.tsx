import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AtSign,
  Clock,
  Coffee,
  Globe,
  Info,
  MapPin,
  Navigation,
  Store,
} from "lucide-react";
import { OffersGrid } from "@/components/offers-grid";
import { VerificationModule } from "@/components/verification-module";
import { Button } from "@/components/ui/button";
import { FORM_LINKS } from "@/lib/links";
import { formatTodayHours, isOpenNow } from "@/lib/hours";
import { SPOTS } from "@/lib/spots";

export function generateStaticParams() {
  return SPOTS.map((spot) => ({ id: spot.id }));
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
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-5 px-4 py-5">
      <Link
        href="/"
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All spots
      </Link>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
        {spot.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground">
            <Coffee className="size-12" strokeWidth={1.5} />
          </div>
        )}
      </div>

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

      <Button asChild size="lg" className="w-full">
        <a href={spot.googleMapsUrl} target="_blank" rel="noopener noreferrer">
          <Navigation className="size-4" />
          Get Directions
        </a>
      </Button>

      {(spot.website || spot.instagram) && (
        <div className="flex flex-wrap gap-2">
          {spot.website && (
            <Button asChild variant="outline" size="sm">
              <a href={spot.website} target="_blank" rel="noopener noreferrer">
                <Globe className="size-4" />
                Website
              </a>
            </Button>
          )}
          {spot.instagram && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://instagram.com/${spot.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AtSign className="size-4" />
                {spot.instagram}
              </a>
            </Button>
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

      <VerificationModule />

      <a
        href={FORM_LINKS.claimCafe || "#"}
        target="_blank"
        rel="noopener noreferrer"
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
      </a>
    </div>
  );
}
