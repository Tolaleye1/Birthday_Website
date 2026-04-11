import Link from "next/link";
import LaitanYearsLightbox from "@/components/home/LaitanYearsLightbox";
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

        <LaitanYearsLightbox slots={slots} />

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
