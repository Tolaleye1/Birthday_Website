import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="gradient-hero relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Decorative confetti dots */}
      <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-gold opacity-15" />
      <div className="absolute top-32 right-[15%] w-3 h-3 rounded-full bg-blush opacity-15" />
      <div className="absolute bottom-24 left-[20%] w-1.5 h-1.5 rounded-full bg-orchid opacity-15" />
      <div className="absolute bottom-20 right-[25%] w-2 h-2 rounded-full bg-gold opacity-15" />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Tagline */}
        <p className="animate-[fadeUp_0.8s_ease-out_both] text-gold-light uppercase tracking-[0.25em] text-xs md:text-sm font-semibold mb-6">
          Celebrating a Golden Legacy of Impact
        </p>

        {/* Portrait Placeholder */}
        <div className="animate-[fadeUp_0.8s_ease-out_0.2s_both] mx-auto w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-gold/40 shadow-[var(--shadow-glow)] mb-8 overflow-hidden bg-gradient-to-br from-purple-light to-berry flex items-center justify-center">
          <div className="text-center">
            <svg className="w-14 h-14 text-white/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="text-white/40 text-xs mt-1">Photo</p>
          </div>
        </div>

        {/* Celebrant Name */}
        <p className="animate-[fadeUp_0.8s_ease-out_0.2s_both] font-[family-name:var(--font-script)] text-gold text-3xl md:text-5xl mb-2">
          Pastor Olakiitan
        </p>
        <h1 className="animate-[fadeUp_0.8s_ease-out_0.2s_both] font-[family-name:var(--font-display)] text-4xl md:text-6xl font-extrabold text-white mb-4">
          Olaleye at <span className="text-gold">50</span>
        </h1>
        <p className="animate-[fadeUp_0.8s_ease-out_0.4s_both] text-white/70 max-w-lg mx-auto mb-4 leading-relaxed">
          Join us in celebrating 50 years of grace, faithfulness, and a legacy that has touched lives across generations.
        </p>

        {/* CTA Group */}
        <div className="animate-[fadeUp_0.8s_ease-out_0.4s_both] flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/submit-tribute"
            className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-4 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.03] text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Send a Tribute
            </span>
          </Link>
          <Link
            href="/upload-video"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-[var(--radius-pill)] transition-all duration-300 hover:scale-[1.03] text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Upload a Video
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
