import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Event Details — Pastor Olakiitan Olaleye @ 50",
  description:
    "Join us on Zoom to celebrate 50 years of God's faithfulness in the life of Pastor (Mrs.) Olakiitan Olaleye.",
};

export default function EventPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-28 pb-16 px-4 text-center">
          <p className="font-[family-name:var(--font-script)] text-gold text-2xl md:text-3xl mb-2">
            50 Years of God&apos;s Faithfulness
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white">
            Join the Celebration
          </h1>
        </section>

        {/* Card */}
        <section className="px-4 -mt-8 pb-16 relative z-10">
          <div className="max-w-2xl mx-auto bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-10">
            {/* Section 1 — Event Info */}
            <div className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-[0.15em] font-semibold mb-3">
                Event Info
              </p>
              <p className="text-text-body text-sm md:text-base mb-2">
                Join us to celebrate 50 years of God&apos;s faithfulness in the
                life of:
              </p>
              <p className="font-[family-name:var(--font-display)] text-gold text-2xl md:text-3xl font-bold mb-2">
                Pst. Mrs. Olakiitan Olaleye
              </p>
              <p className="text-text-body text-sm md:text-base">
                April 22, 2026 — 12:45 PM West Central Africa Time
              </p>
            </div>

            {/* Divider */}
            <div className="gold-divider my-6" />

            {/* Section 2 — Join Zoom Meeting */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <p className="text-text-muted text-xs uppercase tracking-[0.15em] font-semibold">
                  Join Zoom Meeting
                </p>
              </div>
              <a
                href="https://us02web.zoom.us/j/87550635464?pwd=BGkt2Rw1J9E5ygnBBYvRZP8MipfRyU.1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold text-purple-deep font-bold px-10 py-3 rounded-[100px] text-base hover:bg-gold/90 transition-all hover:shadow-[var(--shadow-glow)]"
              >
                Click to Join
              </a>
              <div className="mt-4 space-y-1 text-sm">
                <p className="text-text-body">
                  <span className="text-text-muted text-xs uppercase tracking-[0.1em] font-semibold">
                    Meeting ID:{" "}
                  </span>
                  875 5063 5464
                </p>
                <p className="text-text-body">
                  <span className="text-text-muted text-xs uppercase tracking-[0.1em] font-semibold">
                    Passcode:{" "}
                  </span>
                  OJO@50
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="gold-divider my-6" />

            {/* Section 3 — Join by SIP */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <p className="text-text-muted text-xs uppercase tracking-[0.15em] font-semibold">
                  Join by SIP
                </p>
              </div>
              <p className="text-text-body text-sm font-mono bg-ivory rounded-lg px-4 py-2 inline-block select-all">
                87550635464@zoomcrc.com
              </p>
            </div>

            {/* Divider */}
            <div className="gold-divider my-6" />

            {/* Section 4 — Join Instructions */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.44a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L5.07 8.378"
                  />
                </svg>
                <p className="text-text-muted text-xs uppercase tracking-[0.15em] font-semibold">
                  Need Help?
                </p>
              </div>
              <a
                href="https://us02web.zoom.us/meetings/87550635464/invitations?signature=O4YP9A70lMCzonbjqcdLB6UX7RkwS3bLZ7qs8ucAUoY"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-semibold text-sm hover:text-gold/80 transition-colors"
              >
                View Join Instructions →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
