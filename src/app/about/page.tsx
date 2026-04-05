import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">50 Years of Grace</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">About Olakiitan</h1>
          <p className="text-white/60 max-w-md mx-auto">A Life of Faith, Service, and Impact</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="gold-divider max-w-xs mx-auto mb-12" />

            <p className="text-text-body leading-relaxed text-lg mb-8">
              Olakiitan Josephine Olaleye, affectionately known as &ldquo;Laitan&rdquo; by many and &ldquo;Ms LightsOn!&rdquo; by the thousands of school students she inspires, has spent five decades embodying resilience, grace, and excellence. As she hits this golden milestone, we celebrate a life that is a resounding testimony to God&apos;s mercy.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Early Life and Education</h2>
            <p className="text-text-body leading-relaxed mb-6">
              Laitan&apos;s journey is defined by divine intervention. Just days before her first birthday, she crawled beneath the massive tyres of her father&apos;s &ldquo;911 truck.&rdquo; The engine roared to life, but before the vehicle could move, God intervened, sparing her life for the great purpose she carries today.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              Born in Owo, Ondo State, to Chief Francis Fabamiwoye Fadeyi (Ojumu) and Madam Monisola Lydia Fadeyi, Laitan was raised with a foundation of hard work and integrity.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              Her academic journey took her from St. John Mary&apos;s Demonstration School to Baptist High School, Ile-Oluji. Her brilliance earned her the Ayo Ogunrinde Academic Scholarship, allowing her to complete her secondary education. She eventually proceeded to the prestigious Obafemi Awolowo University (OAU), Ile-Ife, where she earned her Bachelor of Pharmacy degree.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">The Professional &amp; Entrepreneurial Visionary</h2>
            <p className="text-text-body leading-relaxed mb-6">
              With a career spanning over 25 years, Laitan&apos;s professional footprint is vast. She founded Springcare Pharmacy Ltd, a people-focused practice built on professionalism and quality care that has since expanded to multiple branches across Lagos.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              A certified Maxwell Leadership Coach and an Emotional Intelligence Coach (Six Seconds, USA), Laitan is a respected voice in the Association of Community Pharmacists of Nigeria (ACPN).
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Family: The Heartbeat of Her Life</h2>
            <p className="text-text-body leading-relaxed mb-8">
              On April 17, 2004, Laitan married her &ldquo;darling,&rdquo; Pastor Joshua Adeyemi Olaleye. Together, they have built a home rooted in love and impact. They are blessed with three sons, Oluwatomisin, Oluwateniola, and Oluwatisefunmi.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Faith and Ministerial Life</h2>
            <p className="text-text-body leading-relaxed mb-8">
              Since accepting Christ in July 1991, Laitan has been an unapologetic ambassador for the Gospel. As an ordained Pastor in the Redeemed Christian Church of God (RCCG), she has ministered in various capacities alongside her husband.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Impact and Legacy</h2>
            <p className="text-text-body leading-relaxed mb-8">
              Through the Maxwell Leadership Foundation&apos;s iLEAD initiative, she has led teams across Lagos State to reach thousands of students in hundreds of schools. This inspired the launch of the Lightson Impact Foundation for Empowerment (LIFE).
            </p>

            <div className="gold-divider max-w-xs mx-auto my-10" />

            <p className="text-text-muted leading-relaxed italic text-center text-lg">
              As she marks this golden milestone, we celebrate a journey sustained by grace and defined by integrity. Pastor Laitan Olaleye remains a beloved friend, a guiding mentor, and a pillar of her family whose smile warms every room she enters.
            </p>

            <div className="text-center mt-12">
              <a href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                Send a Tribute
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
