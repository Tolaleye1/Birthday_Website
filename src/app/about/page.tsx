import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-lg md:text-xl font-semibold mb-1">50 Years of Grace</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">About Olakiitan</h1>
          <p className="text-white/60 max-w-md mx-auto">A Life of Faith, Service, and Impact</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="gold-divider max-w-xs mx-auto mb-12" />

            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-center text-text-dark mb-8">
              Celebrating Pastor Olakiitan Olaleye: A Golden Legacy of Impact at 50
            </h2>

            <p className="text-text-body leading-relaxed text-lg mb-8">
              Olakiitan Josephine Olaleye, affectionately known as &ldquo;Laitan&rdquo; by many and &ldquo;Ms LightsOn!&rdquo; by the thousands of school students she inspires, has spent five decades embodying resilience, grace, and excellence. As she hits this golden milestone, we celebrate a life that is a resounding testimony to God&apos;s mercy.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4 mt-10">Early Life and Education</h2>
            <p className="text-text-body leading-relaxed mb-6">
              Laitan&apos;s journey is defined by divine intervention. Just days before her first birthday, she crawled beneath the massive tyres of her father&apos;s &ldquo;911 truck.&rdquo; The engine roared to life, but before the vehicle could move, God intervened, sparing her life for the great purpose she carries today.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              Born on Thursday, April 22, 1976, in Owo, Ondo State, to Chief Francis Fabamiwoye Fadeyi (Ojumu) and Madam Monisola Lydia Fadeyi, Laitan was raised with a foundation of hard work and integrity. Though her parents lacked formal literacy, they deeply valued education, a passion Laitan inherited.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              Her academic journey took her from St. John Mary&apos;s Demonstration School to Baptist High School, Ile-Oluji. Her brilliance earned her the Ayo Ogunrinde Academic Scholarship, allowing her to complete her secondary education at St. John/Mary&apos;s Unity Secondary School, Owo. She eventually proceeded to the prestigious Obafemi Awolowo University (OAU), Ile-Ife, where she earned her Bachelor of Pharmacy degree. During her NYSC year in Niger State, she began her lifelong mission of blending professional service with youth mentorship. There, she combined professional service with raising young Teenagers for Christ and positive values across schools and churches across various towns in the state.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4 mt-10">The Professional &amp; Entrepreneurial Visionary</h2>
            <p className="text-text-body leading-relaxed mb-6">
              With a career spanning over 25 years, Laitan&apos;s professional footprint is vast. After her internship at the University of Port Harcourt Teaching Hospital and service at the Central Medical Stores, Minna, she followed her heart into community pharmacy. She served as the Superintendent Pharmacist at Healthplus Pharmacy, Ikeja GRA, for three years before her entrepreneurial spirit took flight.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              Driven by the Holy Spirit, she founded Springcare Pharmacy Ltd, a people-focused practice built on professionalism and quality care that has since expanded to multiple branches across Lagos. Her visionary leadership extended into other ventures, including:
            </p>
            <p className="text-text-body leading-relaxed mb-6 ml-6 relative before:content-[''] before:absolute before:-left-4 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-gold before:rounded-full">
              <span className="font-semibold text-text-dark">Life Hub Events and Spaces:</span> A dynamic co-working and event hub.
            </p>
            <p className="text-text-body leading-relaxed mb-6 ml-6 relative before:content-[''] before:absolute before:-left-4 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-gold before:rounded-full">
              <span className="font-semibold text-text-dark">Just Exotic Concepts:</span> A premium event and ushering service.
            </p>
            <p className="text-text-body leading-relaxed mb-6 ml-6 relative before:content-[''] before:absolute before:-left-4 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-gold before:rounded-full">
              <span className="font-semibold text-text-dark">LightsOn Impact Consulting:</span> A coaching organisation dedicated to personal transformation.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              A certified Maxwell Leadership Coach and an Emotional Intelligence Coach (Six Seconds, USA), Laitan is a respected voice in the Association of Community Pharmacists of Nigeria (ACPN) and the NECA&apos;s Network of Entrepreneurial Women (NNEW).
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4 mt-10">Family: The Heartbeat of Her Life</h2>
            <p className="text-text-body leading-relaxed mb-8">
              On April 17, 2004, Laitan married her &ldquo;darling,&rdquo; Pastor Joshua Adeyemi Olaleye. Together, they have built a home rooted in love and impact. They are blessed with three sons, Oluwatomisin, Oluwateniola, and Oluwatisefunmi, as well as numerous spiritual children whom she nurtures with a mother&apos;s heart. Laitan remains a pillar for her extended family, investing deeply in the unity and success of her siblings and in-laws.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4 mt-10">Faith and Ministerial Life</h2>
            <p className="text-text-body leading-relaxed mb-6">
              Since accepting Christ in July 1991, Laitan has been an unapologetic ambassador for the Gospel. As an ordained Pastor in the Redeemed Christian Church of God (RCCG), she has ministered in various capacities alongside her husband, assisting him in his roles. First at RCCG Maranatha, Gbagada, Parish and Area Pastor at RCCG the City of Refuge, as Zonal Pastor at  RCCG Strongtower Parish and now as Assistant Pastor in Charge of Province (Admin) LP44.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              By the grace of God, she has become a mother to many, investing in young lives through dedicated mentoring, counselling, and teaching. Her influence is particularly profound within the junior church, where she is being used to shape values and guide destinies.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              Through her signature Family Service platform, she brings the Word of God into practical reality, serving as a vessel for restoring homes, providing direction, and empowering people to live with clear purpose.
            </p>

            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4 mt-10">Impact and Legacy</h2>
            <p className="text-text-body leading-relaxed mb-6">
              Laitan&apos;s life&apos;s work is rooted in a passion for positive values. Through the Maxwell Leadership Foundation&apos;s iLEAD initiative, she has led teams across Lagos State to reach thousands of students in hundreds of schools, fostering life-changing transformations.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              As a beneficiary of others&apos; benevolence during her own education, she vowed to pay it forward. This inspired the launch of the Lightson Impact Foundation for Empowerment (LIFE), which provides underprivileged individuals with a better head start in life.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              Driven by a deep conviction for value-based leadership, Laitan believes Nigeria will thrive when integrity and justice are prioritised over ethnicity or bias. While she does not seek political office, her next phase focuses on influencing governance through advocacy and teaching, dedicated to building a nation that truly works.
            </p>
            <p className="text-text-body leading-relaxed mb-6">
              As she marks this golden milestone, we celebrate a journey sustained by grace and defined by integrity. Pastor Laitan Olaleye remains a beloved friend, a guiding mentor, and a pillar of her family whose smile warms every room she enters.
            </p>
            <p className="text-text-body leading-relaxed mb-8">
              Our prayer is for many more fruitful years characterised by good health, a sound mind, and ever-increasing impact.
            </p>

            <p className="font-[family-name:var(--font-display)] text-center text-xl text-gold-dark font-bold italic mt-8">
              Glory to God for Fifty Hearty Years!
            </p>

            <div className="text-center mt-12">
              <Link href="/submit-tribute" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                Send a Tribute
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
