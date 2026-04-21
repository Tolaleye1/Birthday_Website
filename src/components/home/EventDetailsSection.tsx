import Link from "next/link";

export default function EventDetailsSection() {
  return (
    <section className="bg-purple-deep py-4 px-4 md:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <svg
            className="w-6 h-6 text-gold shrink-0 hidden sm:block"
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
          <p className="text-white/90 text-sm md:text-base font-medium">
            Join us live on Zoom —{" "}
            <span className="text-gold-light font-semibold">
              April 22, 2026 at 12:45 PM WAT
            </span>
          </p>
        </div>

        {/* Right: Button + Link */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <a
            href="https://us02web.zoom.us/j/87550635464?pwd=BGkt2Rw1J9E5ygnBBYvRZP8MipfRyU.1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-purple-deep font-semibold px-6 py-2 rounded-[100px] text-sm hover:bg-gold/90 transition-all whitespace-nowrap"
          >
            Join Meeting
          </a>
          <Link
            href="/event"
            className="text-gold-light/70 text-xs hover:text-gold transition-colors"
          >
            See full event details →
          </Link>
        </div>
      </div>
    </section>
  );
}
