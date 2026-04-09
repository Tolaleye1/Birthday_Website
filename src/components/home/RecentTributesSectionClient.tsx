"use client";

import { useEffect, useState } from "react";
import type { Contribution } from "@/lib/types";

type RecentTributesSectionClientProps = {
  tributes: Contribution[];
  avatarColors: string[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTributeDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentTributesSectionClient({
  tributes,
  avatarColors,
}: RecentTributesSectionClientProps) {
  const [selectedTribute, setSelectedTribute] = useState<Contribution | null>(null);

  useEffect(() => {
    if (!selectedTribute) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedTribute(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedTribute]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {tributes.map((tribute, index) => (
          <button
            key={tribute.id}
            type="button"
            onClick={() => setSelectedTribute(tribute)}
            className="group text-left h-72 rounded-[var(--radius-card)] border border-rose/20 bg-gradient-to-br from-blush-light to-blush p-6 hover-lift shadow-[var(--shadow-card)] overflow-hidden relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {getInitials(tribute.submitter_name)}
              </div>
              <div>
                <p className="font-semibold text-text-dark text-sm">{tribute.submitter_name}</p>
                <p className="text-xs text-text-muted">{formatTributeDate(tribute.created_at)}</p>
              </div>
            </div>

            <div className="relative h-[calc(100%-4.5rem)]">
              <p className="text-text-body text-sm leading-7">
                {tribute.message}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blush via-blush/95 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 pt-8 pb-1">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-purple-primary shadow-sm">
                  Tap to read
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTribute && (
        <div
          className="fixed inset-0 z-[70] bg-purple-deep/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedTribute(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[32px] border border-gold/30 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedTribute(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-purple-deep text-white p-2 hover:bg-purple-primary transition-colors"
              aria-label="Close tribute"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-gradient-to-r from-purple-deep via-purple-primary to-berry px-6 md:px-8 pt-8 pb-16 text-white">
              <p className="text-gold-light uppercase tracking-[0.18em] text-xs font-semibold mb-3">Full Tribute</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold">
                {selectedTribute.submitter_name}
              </h3>
              <p className="text-white/70 text-sm mt-2">{formatTributeDate(selectedTribute.created_at)}</p>
            </div>

            <div className="-mt-8 mx-4 md:mx-6 rounded-[28px] border border-gold/20 bg-ivory px-5 md:px-7 py-6 md:py-8 shadow-lg mb-6">
              <p className="text-text-body leading-8 whitespace-pre-wrap">{selectedTribute.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
