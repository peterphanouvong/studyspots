"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { FORM_LINKS } from "@/lib/links";

/**
 * Shared top bar — wordmark (→ home) + Submit a spot. Used on every page.
 * `center` renders a centered slot (e.g. the area search) between the two.
 * `back` swaps the wordmark for a back link (e.g. "← All spots" on a detail
 * page); since the wordmark also points home, this avoids a redundant link.
 * The wordmark collapses to its compact "S" mark on small screens.
 */
export function SiteHeader({
  center,
  back,
}: {
  center?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="sticky top-0 z-50 grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 bg-gray-50 px-5 py-4">
      {back ? (
        <Link
          href={back.href}
          className="flex items-center gap-1.5 justify-self-start text-sm font-medium text-muted-foreground outline-none hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {back.label}
        </Link>
      ) : (
        <Link href="/" className="justify-self-start outline-none">
          <Wordmark className="text-lg sm:hidden" compact />
          <Wordmark className="hidden text-lg sm:inline" />
        </Link>
      )}
      <div className="justify-self-center">{center}</div>
      <Button asChild variant="dark" className="justify-self-end">
        <a
          href={FORM_LINKS.submitSpot || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("submit_spot_clicked", { from: "header" })}
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Nominate a spot</span>
        </a>
      </Button>
    </header>
  );
}
