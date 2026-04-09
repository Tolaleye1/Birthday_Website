import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { LaitanYearSlot } from "@/lib/types";

async function getLaitanYearSlots(): Promise<LaitanYearSlot[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("laitan_years_slots")
      .select("*")
      .order("position", { ascending: true });
    return (data as LaitanYearSlot[]) || [];
  } catch {
    return [];
  }
}

export default async function LaitanYearsSection() {
  const slots = await getLaitanYearSlots();
  const slotMap = new Map(slots.map((slot) => [slot.position, slot]));

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
          {Array.from({ length: 6 }, (_, index) => {
            const position = index + 1;
            const slot = slotMap.get(position);

            return (
              <div key={position} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden hover-lift">
                <div className={`aspect-[4/5] relative ${slot?.asset_url ? "" : position % 2 === 0 ? "bg-blush-light" : "bg-ivory"}`}>
                  {slot?.asset_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={slot.asset_url}
                      alt={slot.caption || `Laitan Over the Years slot ${position}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-gold-light flex items-center justify-center">
                      <svg className="w-10 h-10 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 rounded-full bg-purple-deep/80 px-2.5 py-1 text-[11px] font-semibold text-gold">
                    Slot {position}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-text-muted text-center">{slot?.caption || "Coming soon"}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery#laitan-photos"
            className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
            See Laitan&apos;s Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
