import { CafeInfo } from "@/components/cafe-info";
import { FounderFavouriteHero } from "@/components/founder-favourite-hero";
import { FoundersTip } from "@/components/founders-tip";
import { GalleryGrid } from "@/components/gallery-grid";
import { GoodToKnow } from "@/components/good-to-know";
import { OpenStatus } from "@/components/open-status";
import { ShareSpotButton } from "@/components/share-spot-button";
import { SiteHeader } from "@/components/site-header";
import { SpotLinks } from "@/components/spot-links";
import { SpotSnapshot } from "@/components/spot-snapshot";
import { TrackedLink } from "@/components/tracked-link";
import { buttonVariants } from "@/components/ui/button";
import { FORM_LINKS } from "@/lib/links";
import { SPOTS } from "@/lib/spots";
import { cn } from "@/lib/utils";
import { MapPin, PencilLine, Store } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

  return (
    <>
      <SiteHeader back={{ href: "/", label: "All spots" }} />
      {/* pb-28 on mobile clears the fixed bottom CTA bar */}
      <div className="sm:max-w-6xl sm:px-6 mx-auto w-full sm:pt-4">
        <GalleryGrid images={spot.images} alt={spot.name} mobileFullBleed />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-8 pb-28 sm:pb-8 rounded-t-[36px] -mt-9 sm:mt-0 z-30 bg-white sm:rounded-none shadow-2xl sm:shadow-none">
        {/* Full-bleed on mobile (breaks out of the px-6 gutter), contained on desktop */}

        {/* Title — name, address, open status, and the quick links */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight">
              {spot.name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {spot.address}
            </p>
            <OpenStatus spot={spot} className="mt-1" />
          </div>
          <SpotLinks spot={spot} />
        </div>

        {/* Content + sticky invite card (desktop only; mobile uses the bottom bar) */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-x-12">
          <aside className="hidden lg:col-start-2 lg:row-start-1 lg:sticky lg:top-8 lg:block">
            <div className="flex flex-col gap-4 rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-lg font-bold tracking-tight">
                  Study with a friend
                </h2>
                <p className="text-sm text-muted-foreground">
                  Know someone who&apos;d love this spot? Send it over and make
                  it a coffee catch-up.
                </p>
              </div>

              <SpotSnapshot spot={spot} />

              {/* Primary CTA — invite someone to coffee (native share / copy link) */}
              <ShareSpotButton spot={spot} />
            </div>
          </aside>

          <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-1">
            {spot.founderFavourite && <FounderFavouriteHero />}

            <FoundersTip spot={spot} />

            {spot.goodToKnow && spot.goodToKnow.length > 0 && (
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-lg font-bold tracking-tight">
                  Good to know
                </h2>
                <GoodToKnow spot={spot} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-bold tracking-tight mb-2">
                Cafe info
              </h2>
              <CafeInfo spot={spot} />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <TrackedLink
            href={FORM_LINKS.claimCafe || "#"}
            target="_blank"
            rel="noopener noreferrer"
            event="claim_cafe_clicked"
            eventProps={{ id: spot.id, name: spot.name }}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Own this cafe?
          </TrackedLink>

          <TrackedLink
            href={FORM_LINKS.suggestEdit || "#"}
            target="_blank"
            rel="noopener noreferrer"
            event="suggest_edit_clicked"
            eventProps={{ id: spot.id, name: spot.name }}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Suggest an edit
          </TrackedLink>
        </div>
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-6 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 lg:hidden">
        <div className="mx-auto max-w-6xl">
          <ShareSpotButton spot={spot} />
        </div>
      </div>
    </>
  );
}
