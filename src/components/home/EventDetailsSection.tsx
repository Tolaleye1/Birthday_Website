export default function EventDetailsSection() {
  return (
    <section className="gradient-hero py-12 md:py-16 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-script)] text-gold text-2xl mb-2">
            You Are Warmly Invited
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
            50th Birthday Celebration &amp; Foundation Launch
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="glass-card rounded-[var(--radius-card)] p-6">
            <svg className="w-8 h-8 text-gold mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-white font-semibold">Wednesday</p>
            <p className="text-gold-light text-lg font-[family-name:var(--font-display)] font-bold">
              April 22, 2026
            </p>
          </div>
          <div className="glass-card rounded-[var(--radius-card)] p-6">
            <svg className="w-8 h-8 text-gold mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-semibold">Time</p>
            <p className="text-gold-light text-lg font-[family-name:var(--font-display)] font-bold">
              1:00 PM WAT
            </p>
          </div>
          <div className="glass-card rounded-[var(--radius-card)] p-6">
            <svg className="w-8 h-8 text-gold mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="text-white font-semibold">Join Live on Zoom</p>
            <a
              href="https://us02web.zoom.us/j/87550635464?pwd=BGkt2Rw1J9E5ygnBBYvRZP8MipfRyU.1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm font-semibold hover:text-gold-light transition-colors"
            >
              Click to Join Meeting
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Dress Code: Touch of <span className="text-gold font-semibold">Gold</span> or{" "}
            <span className="text-orchid font-semibold">Purple</span>
          </p>
        </div>
      </div>
    </section>
  );
}
