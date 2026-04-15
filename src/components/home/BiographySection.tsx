import Link from "next/link";

export default function BiographySection() {
  return (
    <section id="biography" className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-[family-name:var(--font-script)] text-gold text-4xl md:text-5xl mb-4">
          50 Years of Grace
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark mb-6">
          A Life of Faith, Service, and Impact
        </h2>
        <div className="gold-divider max-w-xs mx-auto mb-8" />

        <div className="text-left md:text-center relative">
          <div
            className="relative overflow-hidden"
            style={{ maxHeight: "7.5em" }}
          >
            <p className="text-text-body leading-relaxed text-lg mb-4">
              Olakiitan Josephine Olaleye, affectionately known as &ldquo;Laitan&rdquo; by many and &ldquo;Ms LightsOn!&rdquo; by the thousands of school students she inspires, has spent five decades embodying resilience, grace, and excellence. As she hits this golden milestone, we celebrate a life that is a resounding testimony to God&apos;s mercy.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">Early Life and Education</strong><br />
              Laitan&apos;s journey is defined by divine intervention. Just days before her first birthday, she crawled beneath the massive tyres of her father&apos;s &ldquo;911 truck.&rdquo; The engine roared to life, but before the vehicle could move, God intervened, sparing her life for the great purpose she carries today.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              Born in Owo, Ondo State, to Chief Francis Fabamiwoye Fadeyi (Ojumu) and Madam Monisola Lydia Fadeyi, Laitan was raised with a foundation of hard work and integrity.
            </p>
          </div>

          {/* Fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,248,240,0), #FFF8F0)",
            }}
          />

          <Link
            href="/about"
            className="mt-4 bg-gold hover:bg-gold/90 text-purple-deep font-semibold text-sm inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all"
          >
            Read More About Olakiitan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
