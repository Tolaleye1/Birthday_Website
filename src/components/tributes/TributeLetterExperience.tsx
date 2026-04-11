"use client";

import { useEffect, useState } from "react";
import type { Contribution } from "@/lib/types";

type TributeLetterExperienceProps = {
  tributes: Contribution[];
  className?: string;
};

function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-6.716-4.348-9.192-8.347C.81 9.43 2.113 5.25 6.03 5.25c2.31 0 3.717 1.464 4.47 2.667.753-1.203 2.16-2.667 4.47-2.667 3.917 0 5.22 4.18 3.222 7.403C18.716 16.652 12 21 12 21Z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 8.25v7.5A2.25 2.25 0 0119.5 18H4.5a2.25 2.25 0 01-2.25-2.25v-7.5m19.5 0L13.06 13.94a1.5 1.5 0 01-2.12 0L2.25 8.25m19.5 0L13.5 5.1a3 3 0 00-3 0L2.25 8.25" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* Decorative corner curl — used in the letter modal */
function CornerCurl({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 70C10 50 22 38 34 38C43 38 48 44 48 51C48 59 42 65 34 65C24 65 16 57 16 47C16 30 30 12 52 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 10C54 15 51 22 51 30C51 37 56 44 63 44C70 44 76 38 76 30C76 21 69 12 60 12C47 12 36 23 33 38"
        stroke="currentColor"
        strokeWidth="2"
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
    if (!selectedTribute) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedTribute(null);
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
      {/* ── Card Grid ── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
        {tributes.map((tribute) => (
          <button
            key={tribute.id}
            type="button"
            onClick={() => setSelectedTribute(tribute)}
            className="group relative flex flex-col overflow-hidden rounded-[16px] bg-white text-left shadow-[0_4px_20px_rgba(45,16,72,0.08)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_8px_30px_rgba(201,168,76,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/60"
            style={{ height: "280px" }}
          >
            {/* Envelope flap — pink-to-blush chevron */}
            <div className="relative shrink-0" style={{ height: "88px", zIndex: 10 }}>
              {/* Flap chevron — the blush inverted-V pointing down */}
              <div
                className="absolute inset-x-0 top-0"
                style={{
                  height: "100%",
                  background: "linear-gradient(135deg, #F5D5E0 0%, #FDEEF4 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
              {/* Gold circular heart icon centred on flap tip */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full text-white"
                style={{
                  bottom: "-17px",
                  width: "34px",
                  height: "34px",
                  background: "#C9A84C",
                  boxShadow: "0 4px 12px rgba(201,168,76,0.35)",
                }}
              >
                <HeartIcon className="h-4 w-4" />
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
              {/* Submitter name — Playfair italic gold, no "To:" prefix */}
              <p
                className="font-[family-name:var(--font-display)] italic"
                style={{ color: "#C9A84C", fontSize: "1.1rem" }}
              >
                {tribute.submitter_name}
              </p>

              {/* Message preview — 2-line clamp */}
              <p
                className="mt-2 flex-1 text-sm leading-relaxed"
                style={{
                  color: "#8E7BA7",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {tribute.message || tribute.caption || ""}
              </p>

              {/* Footer row */}
              <div className="mt-4 flex items-center justify-between">
                {/* Read link */}
                <div
                  className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "#8E7BA7" }}
                >
                  <EnvelopeIcon />
                  <span>Read Tribute</span>
                  <span aria-hidden="true">→</span>
                </div>

                {/* Gold heart button */}
                <div
                  className="flex items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#C9A84C",
                    boxShadow: "0 6px 18px rgba(201,168,76,0.35)",
                  }}
                >
                  <HeartIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Letter Modal ── */}
      {selectedTribute ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setSelectedTribute(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full overflow-y-auto rounded-[12px]"
            style={{
              maxWidth: "580px",
              maxHeight: "85vh",
              background: "linear-gradient(175deg, #FFF8F0 0%, #FFF3E8 100%)",
              boxShadow: "0 32px 80px rgba(20,8,40,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button — absolute top-right gold circle */}
            <button
              type="button"
              onClick={() => setSelectedTribute(null)}
              className="absolute right-4 top-4 z-20 flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
              style={{
                width: "32px",
                height: "32px",
                background: "#C9A84C",
              }}
              aria-label="Close tribute"
            >
              <CloseIcon />
            </button>

            {/* Corner flourishes */}
            <CornerCurl className="pointer-events-none absolute left-3 top-3 h-16 w-16 text-[#C9A84C]/25" />
            <CornerCurl
              className="pointer-events-none absolute bottom-3 left-3 h-16 w-16 text-[#C9A84C]/25"
              style={{ transform: "scaleY(-1)" }}
            />

            <div className="px-10 pb-10 pt-8 md:px-12">
              {/* Top section: occasion text + stamp */}
              <div className="flex items-start justify-between gap-4 pr-8">
                <p
                  className="font-[family-name:var(--font-body)] italic"
                  style={{ color: "#C9A84C", fontSize: "0.8rem" }}
                >
                  On the occasion of her 50th
                </p>

                {/* Stamp badge */}
                <div
                  className="shrink-0 rotate-[5deg] border-2 px-3 py-2 text-center"
                  style={{
                    borderColor: "#C9A84C",
                    background: "rgba(255,248,240,0.9)",
                    boxShadow: "0 4px 12px rgba(201,168,76,0.15)",
                  }}
                >
                  <p
                    className="font-[family-name:var(--font-display)] font-bold leading-none"
                    style={{ color: "#2D0D45", fontSize: "1.5rem" }}
                  >
                    50
                  </p>
                  <p
                    className="mt-0.5 font-semibold uppercase tracking-[0.12em]"
                    style={{ color: "#C9A84C", fontSize: "0.5rem" }}
                  >
                    Years of Grace
                  </p>
                </div>
              </div>

              {/* Thin gold rule */}
              <div
                className="mt-4"
                style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C60, transparent)" }}
              />

              {/* Greeting */}
              <h2
                className="mt-6 font-[family-name:var(--font-display)] italic leading-tight"
                style={{ color: "#C9A84C", fontSize: "2rem" }}
              >
                Dear Pastor Olakiitan,
              </h2>

              {/* Media (photo / video) */}
              {selectedTribute.type === "photo" && selectedTribute.asset_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedTribute.asset_url}
                  alt={selectedTribute.caption || "Tribute photo"}
                  className="mt-6 w-full rounded-xl object-cover"
                  style={{ maxHeight: "260px" }}
                />
              )}
              {selectedTribute.type === "video" && selectedTribute.asset_url && (
                <video
                  src={selectedTribute.asset_url}
                  controls
                  className="mt-6 w-full rounded-xl"
                  style={{ maxHeight: "240px" }}
                />
              )}

              {/* Message body — notebook lined paper effect */}
              <div
                className="mt-6 leading-[2rem] text-[1rem]"
                style={{
                  color: "#3D2955",
                  lineHeight: "2rem",
                  /* Notebook lines: 1px gold lines every 2rem starting at 2rem */
                  background:
                    "repeating-linear-gradient(transparent, transparent calc(2rem - 1px), rgba(201,168,76,0.15) calc(2rem - 1px), rgba(201,168,76,0.15) 2rem)",
                  backgroundSize: "100% 2rem",
                  paddingBottom: "1rem",
                }}
              >
                {String(selectedTribute.message || selectedTribute.caption || "")
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    <p key={`${selectedTribute.id}-p-${idx}`} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Divider */}
              <div
                className="mt-8"
                style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C70, transparent)" }}
              />

              {/* Sign-off — bottom right */}
              <div className="mt-6 text-right">
                <p
                  className="font-[family-name:var(--font-body)] italic"
                  style={{ color: "#8E7BA7", fontSize: "0.9rem" }}
                >
                  With love,
                </p>
                <p
                  className="mt-1 font-[family-name:var(--font-display)] italic"
                  style={{ color: "#C9A84C", fontSize: "1.5rem" }}
                >
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
