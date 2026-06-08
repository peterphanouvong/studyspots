"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Vote = "yes" | "no" | null;

/**
 * "Are the outlets working today?" — anonymous binary vote.
 * Counts live in client state only (reset on refresh) for the MVP.
 */
export function VerificationModule({ spotId }: { spotId: string }) {
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);
  const [myVote, setMyVote] = useState<Vote>(null);

  function vote(choice: "yes" | "no") {
    if (myVote === choice) return; // already counted

    // Remove a previous vote if switching sides.
    if (myVote === "yes") setYes((n) => n - 1);
    if (myVote === "no") setNo((n) => n - 1);

    if (choice === "yes") setYes((n) => n + 1);
    else setNo((n) => n + 1);
    setMyVote(choice);
    track("outlet_vote", { spotId, vote: choice });
  }

  const total = yes + no;

  return (
    <section className="rounded-2xl bg-card p-5">
      <h2 className="font-heading text-base font-semibold">
        Are the outlets working today?
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Help others by sharing what you see right now.
      </p>

      <div className="mt-3 flex gap-3">
        <VoteButton
          active={myVote === "yes"}
          tone="yes"
          icon={<ThumbsUp className="size-4" />}
          label="Yes"
          count={yes}
          onClick={() => vote("yes")}
        />
        <VoteButton
          active={myVote === "no"}
          tone="no"
          icon={<ThumbsDown className="size-4" />}
          label="No"
          count={no}
          onClick={() => vote("no")}
        />
      </div>

      {total > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {Math.round((yes / total) * 100)}% say yes ({total}{" "}
          {total === 1 ? "vote" : "votes"})
        </p>
      )}
    </section>
  );
}

function VoteButton({
  active,
  tone,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  tone: "yes" | "no";
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
        !active && "bg-background text-foreground hover:brightness-95",
        active && tone === "yes" && "bg-primary text-primary-foreground",
        active && tone === "no" && "bg-rose-600 text-white",
      )}
    >
      {icon}
      {label}
      <span className="tabular-nums text-muted-foreground">{count}</span>
    </button>
  );
}
