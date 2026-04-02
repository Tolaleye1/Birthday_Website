import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import type { Contribution } from "@/lib/types";

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

const avatarColors = ["bg-purple-primary", "bg-berry", "bg-gold"];

export default async function RecentTributesSection() {
  const tributes = await getRecentTributes();

  // Placeholder tributes if no real ones exist yet
  const displayTributes = tributes.length > 0 ? tributes : [
    { id: "p1", submitter_name: "Funke Adeyemi", message: '"Happy golden jubilee, Pastor! Your counselling changed my family. We love and celebrate you."', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "p2", submitter_name: "Kunle Ogunbiyi", message: '"Praying for continued strength and grace upon your life. You are a blessing, Mummy!"', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: "p3", submitter_name: "Brother Ade", message: '"50 looks glorious on you, Pastor! Thank you for decades of kindness and unwavering faith."', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  ];

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

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {displayTributes.map((tribute, i) => (
            <div
              key={tribute.id}
              className="bg-gradient-to-br from-blush-light to-blush rounded-[var(--radius-card)] p-6 border border-rose/20 hover-lift"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${avatarColors[i % 3]} flex items-center justify-center text-white font-bold text-sm`}>
                  {getInitials(tribute.submitter_name)}
                </div>
                <div>
                  <p className="font-semibold text-text-dark text-sm">{tribute.submitter_name}</p>
                  <p className="text-xs text-text-muted">{getTimeAgo(tribute.created_at)}</p>
                </div>
              </div>
              <p className="text-text-body text-sm leading-relaxed italic">{tribute.message}</p>
            </div>
          ))}
        </div>

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
