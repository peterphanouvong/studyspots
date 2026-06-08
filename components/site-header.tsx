"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { FORM_LINKS } from "@/lib/links";

/** Shared top bar — wordmark (→ home) + Submit a spot. Used on every page. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between gap-2 border-b bg-background px-5 py-4">
      <Link href="/" className="outline-none">
        <Wordmark className="text-lg" />
      </Link>
      <Button asChild>
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
