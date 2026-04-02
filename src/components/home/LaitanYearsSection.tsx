import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { LaitanPhoto } from "@/lib/types";

async function getLaitanPhotos(): Promise<LaitanPhoto[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("laitan_photos")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(6);
    return (data as LaitanPhoto[]) || [];
  } catch {
    return [];
  }
}

export default async function LaitanYearsSection() {
  const photos = await getLaitanPhotos();

  const placeholderSlots = Math.max(0, 6 - photos.length);

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            A Journey in Pictures
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark">
            Laitan Throughout the Years
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
              <div className="aspect-[4/5] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.asset_url || ""}
                  alt={photo.caption || "Laitan through the years"}
                  className="w-full h-full object-cover"
                />
              </div>
              {photo.caption && (
                <div className="p-3">
                  <p className="text-sm text-text-muted text-center">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}

          {/* Placeholder slots */}
          {Array.from({ length: placeholderSlots }).map((_, i) => (
            <div key={`placeholder-${i}`} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
              <div className={`aspect-[4/5] border-2 border-dashed border-gold-light flex items-center justify-center ${i % 2 === 0 ? "bg-blush-light" : "bg-ivory"}`}>
                <svg className="w-10 h-10 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
              <div className="p-3">
                <p className="text-sm text-text-muted text-center">Coming soon</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery#laitan-photos"
            className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
            See Laitan&apos;s Photos
          </Link>
        </div>
      </div>
    </section>
  );
}
