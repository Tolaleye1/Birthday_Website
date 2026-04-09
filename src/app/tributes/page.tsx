"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Contribution } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
}

function formatTributeDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const avatarColors = [
  "bg-purple-primary", "bg-berry", "bg-gold", "bg-rose", "bg-orchid",
  "bg-purple-deep", "bg-berry-light",
];

export default function TributesPage() {
  const [tributes, setTributes] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTribute, setSelectedTribute] = useState<Contribution | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/tributes?type=text");
        const data = await res.json();
        if (res.ok) {
          setTributes((data.contributions as Contribution[]) || []);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

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
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Words from the Heart</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Tributes Wall</h1>
          <p className="text-white/60 max-w-md mx-auto">Heartfelt messages from family, friends, and loved ones celebrating Pastor Olakiitan&apos;s 50th birthday.</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : tributes.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-blush-light mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">No tributes yet</h3>
                <p className="text-text-muted text-sm mb-6">Be the first to share a heartfelt message!</p>
                <Link href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                  Send a Tribute
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {tributes.map((tribute, index) => (
                    <button
                      key={tribute.id}
                      type="button"
                      onClick={() => setSelectedTribute(tribute)}
                      className="group text-left h-72 rounded-[var(--radius-card)] border border-rose/20 bg-gradient-to-br from-blush-light to-blush p-6 hover-lift shadow-[var(--shadow-card)] overflow-hidden relative"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
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

                <div className="text-center mt-12">
                  <p className="text-text-muted mb-4">Want to add your voice?</p>
                  <Link href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    Send a Tribute
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

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
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold">{selectedTribute.submitter_name}</h2>
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
