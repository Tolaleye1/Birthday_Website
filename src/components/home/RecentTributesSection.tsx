import Link from "next/link";
import RecentTributesSectionClient from "@/components/home/RecentTributesSectionClient";
import { createServerClient } from "@/lib/supabase/server";
import type { Contribution } from "@/lib/types";

const placeholderTributes: Contribution[] = [
  {
    id: "p1",
    type: "text",
    submitter_name: "Funke Adeyemi",
    message: '"Happy golden jubilee, Pastor! Your counselling changed my family. We love and celebrate you."',
    caption: null,
    asset_path: null,
    asset_url: null,
    asset_mime_type: null,
    asset_size_bytes: null,
    video_duration_seconds: null,
    is_deleted: false,
    created_at: "2026-04-07T10:00:00.000Z",
  },
  {
    id: "p2",
    type: "text",
    submitter_name: "Kunle Ogunbiyi",
    message: '"Praying for continued strength and grace upon your life. You are a blessing, Mummy!"',
    caption: null,
    asset_path: null,
    asset_url: null,
    asset_mime_type: null,
    asset_size_bytes: null,
    video_duration_seconds: null,
    is_deleted: false,
    created_at: "2026-04-07T07:00:00.000Z",
  },
  {
    id: "p3",
    type: "text",
    submitter_name: "Brother Ade",
    message: '"50 looks glorious on you, Pastor! Thank you for decades of kindness and unwavering faith."',
    caption: null,
    asset_path: null,
    asset_url: null,
    asset_mime_type: null,
    asset_size_bytes: null,
    video_duration_seconds: null,
    is_deleted: false,
    created_at: "2026-04-06T12:00:00.000Z",
  },
];

async function getRecentTributes(): Promise<Contribution[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("contributions")
      .select("*")
      .eq("type", "text")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data as Contribution[]) || [];
  } catch {
    return [];
  }
}

export default async function RecentTributesSection() {
  const tributes = await getRecentTributes();

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            A Growing Collection of Love
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark">
            Recent Tributes
          </h2>
        </div>

        <RecentTributesSectionClient
          tributes={tributes.length > 0 ? tributes : placeholderTributes}
        />

        <div className="text-center">
          <Link
            href="/tributes"
            className="border-2 border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white font-semibold px-8 py-3 rounded-[var(--radius-pill)] transition-all duration-300 inline-flex items-center gap-2"
          >
            View All Tributes
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
