"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { FORM_LINKS } from "@/lib/links";

/**
 * Shared top bar — wordmark (→ home) + Submit a spot. Used on every page.
 * `center` renders a centered slot (e.g. the area search) between the two.
 * The wordmark collapses to its compact "S" mark on small screens.
 */
export function SiteHeader({ center }: { center?: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 grid shrink-0 grid-cols-[auto_1fr_auto] items-center gap-2 bg-gray-50 px-5 py-4">
      <Link href="/" className="justify-self-start outline-none">
        <Wordmark className="text-lg sm:hidden" compact />
        <Wordmark className="hidden text-lg sm:inline" />
      </Link>
      <div className="justify-self-center">{center}</div>
      <Button asChild variant="secondary" className="justify-self-end">
        <a
          href={FORM_LINKS.submitSpot || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("submit_spot_clicked", { from: "header" })}
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Submit a spot</span>
        </a>
      </Button>
    </header>
  );
}
