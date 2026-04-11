"use client";

import { useEffect, useState } from "react";
import type { Contribution } from "@/lib/types";

type TributeLetterExperienceProps = {
  tributes: Contribution[];
  className?: string;
};

function LetterHeartIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-6.716-4.348-9.192-8.347C.81 9.43 2.113 5.25 6.03 5.25c2.31 0 3.717 1.464 4.47 2.667.753-1.203 2.16-2.667 4.47-2.667 3.917 0 5.22 4.18 3.222 7.403C18.716 16.652 12 21 12 21Z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 8.25v7.5A2.25 2.25 0 0119.5 18H4.5a2.25 2.25 0 01-2.25-2.25v-7.5m19.5 0L13.06 13.94a1.5 1.5 0 01-2.12 0L2.25 8.25m19.5 0L13.5 5.1a3 3 0 00-3 0L2.25 8.25" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Flourish({
  className,
  mirrored = false,
}: {
  className: string;
  mirrored?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M20 98C20 70 34 58 44 58C52 58 56 64 56 70C56 77 51 82 44 82C36 82 30 76 30 68C30 52 43 34 63 27C81 20 95 27 100 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M90 18C85 22 82 28 82 34C82 40 86 46 92 46C98 46 103 41 103 34C103 26 97 18 89 18C78 18 68 27 65 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TributeLetterExperience({
  tributes,
  className = "mb-10",
}: TributeLetterExperienceProps) {
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
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
        {tributes.map((tribute) => (
          <button
            key={tribute.id}
            type="button"
            onClick={() => setSelectedTribute(tribute)}
            className="group relative flex h-[320px] flex-col overflow-hidden rounded-[16px] border border-gold/15 bg-ivory text-left shadow-[0_12px_32px_rgba(45,16,72,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(201,168,76,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
          >
            <div className="relative h-24 shrink-0 bg-[linear-gradient(135deg,rgba(201,168,76,0.22),rgba(245,213,224,0.9),rgba(75,29,110,0.18))]">
              <div
                className="absolute inset-x-0 top-0 h-full bg-blush"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 62%)" }}
              />
              <div
                className="absolute left-0 top-0 h-[72px] w-[48%] bg-white/88"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
              <div
                className="absolute right-0 top-0 h-[72px] w-[48%] bg-white/88"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              />
              <div className="absolute left-1/2 top-5 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white/70 text-gold shadow-[0_8px_18px_rgba(201,168,76,0.22)]">
                <LetterHeartIcon />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
              <p className="border-b border-gold/20 pb-3 font-[family-name:var(--font-display)] text-[1.45rem] italic text-gold">
                To: {tribute.submitter_name}
              </p>

              <div className="relative mt-4 flex-1 overflow-hidden">
                <p
                  className="text-sm leading-7 text-text-muted"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {tribute.message}
                </p>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ivory via-ivory/90 to-transparent" />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-purple-primary">
                  <EnvelopeIcon />
                  <span>Read Tribute</span>
                  <span aria-hidden="true">-&gt;</span>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-white shadow-[0_10px_20px_rgba(201,168,76,0.35)] transition-transform duration-300 group-hover:scale-105">
                  <LetterHeartIcon />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTribute ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1f0b33]/70 p-4 backdrop-blur-[2px]"
          onClick={() => setSelectedTribute(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-gold/25 bg-ivory shadow-[0_25px_80px_rgba(24,10,42,0.38)] animate-[fadeUp_0.35s_ease-out_both]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedTribute(null)}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-white/80 text-gold shadow-[0_12px_24px_rgba(201,168,76,0.18)] transition-colors hover:bg-white"
              aria-label="Close tribute"
            >
              <CloseIcon />
            </button>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(245,213,224,0.22),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-gold via-blush to-purple-primary" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold via-blush to-purple-primary/80" />

            <Flourish className="pointer-events-none absolute left-5 top-6 h-20 w-20 text-gold/35" />
            <Flourish className="pointer-events-none absolute right-12 top-8 h-20 w-20 text-gold/30" mirrored />
            <Flourish className="pointer-events-none absolute bottom-10 left-6 h-20 w-20 text-gold/30" />
            <Flourish className="pointer-events-none absolute bottom-8 right-6 h-20 w-20 text-gold/30" mirrored />

            <div className="relative px-6 pb-8 pt-8 md:px-10 md:pb-10 md:pt-10">
              <div className="flex items-start justify-between gap-6 pr-14">
                <div>
                  <p className="font-[family-name:var(--font-body)] text-sm italic text-gold">
                    On the occasion of her 50th
                  </p>
                  <div className="mt-3 h-px w-28 bg-gold/35" />
                </div>

                <div className="rotate-[6deg] border-2 border-gold/60 bg-white/70 px-3 py-2 text-center shadow-[0_12px_24px_rgba(201,168,76,0.12)]">
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none text-purple-primary">
                    50
                  </p>
                  <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-gold">
                    Years of Grace
                  </p>
                </div>
              </div>

              <h2 className="mt-8 font-[family-name:var(--font-display)] text-[2.2rem] italic leading-tight text-gold md:text-[3.1rem]">
                Dear Pastor Olakiitan,
              </h2>

              <div className="mt-8 space-y-5 text-[1.05rem] leading-9 text-text-body">
                {String(selectedTribute.message || "")
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${selectedTribute.id}-${index}`} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
              </div>

              <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

              <div className="mt-8 text-right">
                <p className="font-[family-name:var(--font-body)] text-lg italic text-text-muted">
                  With love,
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-[2rem] italic text-gold md:text-[2.4rem]">
                  {selectedTribute.submitter_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
