import Link from "next/link";

export default function ParticipateSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-ivory to-blush-light/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Be Part of the Celebration
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark">
            Three Ways to Share Your Love
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Text Tribute */}
          <Link
            href="/submit-tribute"
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 text-center hover-lift block group"
          >
            <div className="w-16 h-16 rounded-full bg-blush mx-auto mb-5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <svg className="w-7 h-7 text-berry" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">
              Write a Tribute
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Pen a heartfelt birthday message that will appear on the Tributes Wall for everyone to read.
            </p>
          </Link>

          {/* Card 2: Photo */}
          <Link
            href="/submit-tribute"
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 text-center hover-lift block group"
          >
            <div className="w-16 h-16 rounded-full bg-gold-glow mx-auto mb-5 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">
              Share a Photo
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Upload a favourite photo with a short caption to add to the celebration gallery.
            </p>
          </Link>

          {/* Card 3: Video */}
          <Link
            href="/upload-video"
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 text-center hover-lift block group"
          >
            <div className="w-16 h-16 rounded-full bg-blush mx-auto mb-5 flex items-center justify-center group-hover:bg-purple-primary/10 transition-colors">
              <svg className="w-7 h-7 text-purple-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">
              Record a Video
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Record a personal video greeting up to 90 seconds that will live in the celebration gallery.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
