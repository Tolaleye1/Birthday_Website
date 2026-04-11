"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Contribution, LaitanGalleryItem } from "@/lib/types";

type GalleryTab = "videos" | "photos" | "laitan";
type LightboxItem = {
  id: string;
  kind: "image" | "video";
  src: string;
  alt: string;
  title: string;
  caption: string | null;
};

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

export default function GalleryPage() {
  const [tab, setTab] = useState<GalleryTab>("videos");
  const [videos, setVideos] = useState<Contribution[]>([]);
  const [photos, setPhotos] = useState<Contribution[]>([]);
  const [laitanItems, setLaitanItems] = useState<LaitanGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [videoRes, photoRes, laitanRes] = await Promise.all([
          fetch("/api/tributes?type=video"),
          fetch("/api/tributes?type=photo"),
          fetch("/api/laitan-gallery"),
        ]);

        const [videoData, photoData, laitanData] = await Promise.all([
          videoRes.json(),
          photoRes.json(),
          laitanRes.json(),
        ]);

        if (videoRes.ok) {
          setVideos((videoData.contributions as Contribution[]) || []);
        }

        if (photoRes.ok) {
          setPhotos((photoData.contributions as Contribution[]) || []);
        }

        if (laitanRes.ok) {
          setLaitanItems((laitanData.items as LaitanGalleryItem[]) || []);
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#laitan-photos") {
      setTab("laitan");
    }
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => current === null ? current : (current - 1 + lightboxItems.length) % lightboxItems.length);
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => current === null ? current : (current + 1) % lightboxItems.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, lightboxItems.length]);

  const tabConfig: { key: GalleryTab; label: string; mobileLabel: string; count?: number; icon: React.ReactNode }[] = [
    {
      key: "videos", label: "Videos", mobileLabel: "Videos", count: videos.length,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
    },
    {
      key: "photos", label: "Photos", mobileLabel: "Photos", count: photos.length,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>,
    },
    {
      key: "laitan", label: "Laitan's Gallery", mobileLabel: "Laitan's",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>,
    },
  ];

  const photoLightboxItems = useMemo<LightboxItem[]>(
    () => photos.map((photo) => ({
      id: photo.id,
      kind: "image",
      src: photo.asset_url || "",
      alt: photo.caption || `Photo by ${photo.submitter_name}`,
      title: photo.submitter_name,
      caption: photo.caption,
    })),
    [photos]
  );

  const videoLightboxItems = useMemo<LightboxItem[]>(
    () => videos.map((video) => ({
      id: video.id,
      kind: "video",
      src: video.asset_url || "",
      alt: `Video from ${video.submitter_name}`,
      title: video.submitter_name,
      caption: video.caption,
    })),
    [videos]
  );

  const laitanLightboxItems = useMemo<LightboxItem[]>(
    () => laitanItems.map((item) => ({
      id: item.id,
      kind: item.media_type === "video" ? "video" : "image",
      src: item.asset_url || "",
      alt: item.caption || "Laitan's gallery",
      title: "Laitan's Gallery",
      caption: item.caption,
    })),
    [laitanItems]
  );

  function openLightbox(items: LightboxItem[], index: number) {
    setLightboxItems(items);
    setLightboxIndex(index);
  }

  function goToPrevItem() {
    setLightboxIndex((current) => current === null ? current : (current - 1 + lightboxItems.length) % lightboxItems.length);
  }

  function goToNextItem() {
    setLightboxIndex((current) => current === null ? current : (current + 1) % lightboxItems.length);
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Memories Worth Celebrating</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Celebration Gallery</h1>
          <p className="text-white/60 max-w-md mx-auto">Browse photos and video messages shared by loved ones for Pastor Olakiitan&apos;s 50th birthday.</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <div className="bg-white rounded-[28px] shadow-[var(--shadow-card)] p-1.5 grid grid-cols-3 gap-1">
                {tabConfig.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`min-w-0 px-2 sm:px-4 py-2.5 rounded-[24px] text-[11px] sm:text-sm font-semibold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center ${tab === item.key ? "bg-purple-primary text-white shadow-md" : "text-text-muted hover:text-text-dark"}`}
                  >
                    {item.icon}
                    <span className="leading-tight">
                      <span className="sm:hidden">{item.mobileLabel}</span>
                      <span className="hidden sm:inline">{item.label}</span>
                    </span>
                    {item.count !== undefined && <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab === item.key ? "bg-white/20" : "bg-gold/10 text-gold"}`}>{item.count}</span>}
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
                {tab === "videos" && (
                  <div>
                    {videos.length === 0 ? <EmptyState type="videos" /> : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() => openLightbox(videoLightboxItems, index)}
                            className="text-left bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift"
                          >
                            <div className="relative aspect-video bg-purple-deep">
                              <video src={video.asset_url || ""} className="w-full h-full object-cover" preload="metadata" muted />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                  <svg className="w-6 h-6 text-purple-deep ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-text-dark">{video.submitter_name}</p>
                                  {video.caption && <p className="text-sm text-text-muted mt-1">{video.caption}</p>}
                                </div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold whitespace-nowrap">
                                  {index + 1} / {videos.length}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === "photos" && (
                  <div>
                    {photos.length === 0 ? <EmptyState type="photos" /> : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                          <button key={photo.id} type="button" onClick={() => openLightbox(photoLightboxItems, index)} className="text-left bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                            <div className="aspect-square relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo.asset_url || ""} alt={photo.caption || `Photo by ${photo.submitter_name}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-semibold text-text-dark">{photo.submitter_name}</p>
                              {photo.caption && <p className="text-xs text-text-muted">{photo.caption}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === "laitan" && (
                  <div>
                    <div className="text-center mb-8">
                      <p className="text-text-muted">A personal collection curated by the host</p>
                    </div>
                    {laitanItems.length === 0 ? <EmptyState type="media" /> : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {laitanItems.map((item, index) => (
                          <button key={item.id} type="button" onClick={() => openLightbox(laitanLightboxItems, index)} className="text-left bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                            <div className="aspect-square relative">
                              {item.media_type === "video" ? (
                                <div className="w-full h-full relative bg-purple-deep">
                                  <video src={item.asset_url || ""} className="w-full h-full object-cover" preload="metadata" muted />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                      <svg className="w-5 h-5 text-purple-deep ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={item.asset_url || ""} alt={item.caption || "Laitan's gallery"} className="w-full h-full object-cover" />
                              )}
                            </div>
                            {item.caption && (
                              <div className="p-3"><p className="text-sm text-text-muted text-center">{item.caption}</p></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab !== "laitan" && (
                  <div className="text-center mt-12">
                    <p className="text-text-muted mb-4">Want to add your own memory?</p>
                    <Link href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Share a Photo or Video
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            const endX = event.changedTouches[0]?.clientX ?? null;

            if (touchStartX === null || endX === null) {
              setTouchStartX(null);
              return;
            }

            const diff = touchStartX - endX;
            if (Math.abs(diff) > 40) {
              if (diff > 0) {
                goToNextItem();
              } else {
                goToPrevItem();
              }
            }

            setTouchStartX(null);
          }}
        >
          <button type="button" onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors" aria-label="Close lightbox">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {lightboxItems.length > 1 && (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); goToPrevItem(); }} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors" aria-label="Previous item">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.5L8.25 12 15 4.5" /></svg>
              </button>
              <button type="button" onClick={(event) => { event.stopPropagation(); goToNextItem(); }} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors" aria-label="Next item">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4.5L15.75 12 9 19.5" /></svg>
              </button>
            </>
          )}

          <div className="flex max-h-[90vh] max-w-[90vw] items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {lightboxItems[lightboxIndex].kind === "video" ? (
              <video
                src={lightboxItems[lightboxIndex].src}
                controls
                className="max-h-[90vh] max-w-[90vw] object-contain"
                autoPlay
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={lightboxItems[lightboxIndex].src}
                alt={lightboxItems[lightboxIndex].alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
