"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TributeLetterExperience from "@/components/tributes/TributeLetterExperience";
import ComingSoonBlock from "@/components/ComingSoonBlock";
import type { Contribution } from "@/lib/types";

export default function TributesPage() {
  const [tributes, setTributes] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [tributesVisible, setTributesVisible] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tributeRes, settingsRes] = await Promise.all([
          fetch("/api/tributes?type=text"),
          fetch("/api/site-settings"),
        ]);

        const tributeData = await tributeRes.json();
        if (tributeRes.ok) {
          setTributes((tributeData.contributions as Contribution[]) || []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setTributesVisible(settings.tributes_visible === true);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

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
            ) : !tributesVisible ? (
              <ComingSoonBlock section="tributes" />
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
                <TributeLetterExperience tributes={tributes} className="" />

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
    </>
  );
}
