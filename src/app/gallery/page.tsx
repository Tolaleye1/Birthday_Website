"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import type { Contribution, LaitanPhoto } from "@/lib/types";

type GalleryTab = "videos" | "photos" | "laitan";

export default function GalleryPage() {
  const [tab, setTab] = useState<GalleryTab>("videos");
  const [videos, setVideos] = useState<Contribution[]>([]);
  const [photos, setPhotos] = useState<Contribution[]>([]);
  const [laitanPhotos, setLaitanPhotos] = useState<LaitanPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [videoRes, photoRes, laitanRes] = await Promise.all([
        supabase.from("contributions").select("*").eq("type", "video").eq("is_deleted", false).order("created_at", { ascending: false }),
        supabase.from("contributions").select("*").eq("type", "photo").eq("is_deleted", false).order("created_at", { ascending: false }),
        supabase.from("laitan_photos").select("*").order("display_order", { ascending: true }),
      ]);
      setVideos((videoRes.data as Contribution[]) || []);
      setPhotos((photoRes.data as Contribution[]) || []);
      setLaitanPhotos((laitanRes.data as LaitanPhoto[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  // Check URL hash for laitan-photos tab
  useEffect(() => {
    if (window.location.hash === "#laitan-photos") {
      setTab("laitan");
    }
  }, []);

  const tabConfig: { key: GalleryTab; label: string; count?: number; icon: React.ReactNode }[] = [
    {
      key: "videos", label: "Videos", count: videos.length,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
    },
    {
      key: "photos", label: "Photos", count: photos.length,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>,
    },
    {
      key: "laitan", label: "Laitan's Photos",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>,
    },
  ];

  function EmptyState({ type }: { type: string }) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-blush-light mx-auto mb-6 flex items-center justify-center">
          <svg className="w-10 h-10 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">No {type} yet</h3>
        <p className="text-text-muted text-sm">Be the first to share!</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Memories Worth Celebrating</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Celebration Gallery</h1>
          <p className="text-white/60 max-w-md mx-auto">Browse photos and video messages shared by loved ones for Pastor Olakiitan&apos;s 50th birthday.</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Switcher */}
            <div className="flex justify-center mb-10">
              <div className="bg-white rounded-[var(--radius-pill)] shadow-[var(--shadow-card)] p-1 inline-flex gap-1">
                {tabConfig.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`px-6 md:px-8 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${tab === t.key ? "bg-purple-primary text-white shadow-md" : "text-text-muted hover:text-text-dark"}`}>
                    {t.icon} {t.label}
                    {t.count !== undefined && <span className={`px-2 py-0.5 rounded-full text-xs ml-1 ${tab === t.key ? "bg-white/20" : "bg-gold/10 text-gold"}`}>{t.count}</span>}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <>
                {/* Videos Tab */}
                {tab === "videos" && (
                  <div>
                    {videos.length === 0 ? <EmptyState type="videos" /> : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((v) => (
                          <div key={v.id} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                            <div className="aspect-video bg-purple-deep relative">
                              <video src={v.asset_url || ""} controls className="w-full h-full object-cover" preload="metadata" />
                            </div>
                            <div className="p-4">
                              <p className="font-semibold text-text-dark">{v.submitter_name}</p>
                              {v.caption && <p className="text-sm text-text-muted mt-1">{v.caption}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Photos Tab */}
                {tab === "photos" && (
                  <div>
                    {photos.length === 0 ? <EmptyState type="photos" /> : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((p) => (
                          <div key={p.id} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                            <div className="aspect-square relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.asset_url || ""} alt={p.caption || `Photo by ${p.submitter_name}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-semibold text-text-dark">{p.submitter_name}</p>
                              {p.caption && <p className="text-xs text-text-muted">{p.caption}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Laitan's Photos Tab */}
                {tab === "laitan" && (
                  <div>
                    <div className="text-center mb-8">
                      <p className="text-text-muted">A personal collection curated by the host</p>
                    </div>
                    {laitanPhotos.length === 0 ? <EmptyState type="photos" /> : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {laitanPhotos.map((p) => (
                          <div key={p.id} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                            <div className="aspect-square relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.asset_url || ""} alt={p.caption || "Laitan's photo"} className="w-full h-full object-cover" />
                            </div>
                            {p.caption && (
                              <div className="p-3"><p className="text-sm text-text-muted text-center">{p.caption}</p></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA - only on guest tabs */}
                {tab !== "laitan" && (
                  <div className="text-center mt-12">
                    <p className="text-text-muted mb-4">Want to add your own memory?</p>
                    <a href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Share a Photo or Video
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
