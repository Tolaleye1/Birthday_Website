"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import type { Contribution } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const avatarColors = [
  "bg-purple-primary", "bg-berry", "bg-gold", "bg-rose", "bg-orchid",
  "bg-purple-deep", "bg-berry-light",
];

export default function TributesPage() {
  const [tributes, setTributes] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data } = await supabase
        .from("contributions")
        .select("*")
        .eq("type", "text")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      setTributes((data as Contribution[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Words from the Heart</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Tributes Wall</h1>
          <p className="text-white/60 max-w-md mx-auto">Heartfelt messages from family, friends, and loved ones celebrating Pastor Olakiitan&apos;s 50th birthday.</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto">
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
                <a href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                  Send a Tribute
                </a>
              </div>
            ) : (
              <>
                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
                  {tributes.map((tribute, i) => (
                    <div
                      key={tribute.id}
                      className="break-inside-avoid bg-gradient-to-br from-blush-light to-blush rounded-[var(--radius-card)] p-6 border border-rose/20 hover-lift"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {getInitials(tribute.submitter_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-text-dark text-sm">{tribute.submitter_name}</p>
                          <p className="text-xs text-text-muted">{getTimeAgo(tribute.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-text-body text-sm leading-relaxed italic">
                        &ldquo;{tribute.message}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <p className="text-text-muted mb-4">Want to add your voice?</p>
                  <a href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    Send a Tribute
                  </a>
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
