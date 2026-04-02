"use client";

import { useState } from "react";

export default function BiographySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-[family-name:var(--font-script)] text-gold text-2xl mb-4">
          50 Years of Grace
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark mb-6">
          A Life of Faith, Service, and Love
        </h2>
        <div className="gold-divider max-w-xs mx-auto mb-8" />

        <div className="text-left md:text-center relative">
          <div
            className="relative overflow-hidden transition-[max-height] duration-600 ease-in-out"
            style={{ maxHeight: expanded ? "4000px" : "7.5em" }}
          >
            <p className="text-text-body leading-relaxed text-lg mb-4">
              Olakiitan Josephine Olaleye, affectionately known as &ldquo;Laitan&rdquo; by many and &ldquo;Ms LightsOn!&rdquo; by the thousands of school students she inspires, has spent five decades embodying resilience, grace, and excellence. As she hits this golden milestone, we celebrate a life that is a resounding testimony to God&apos;s mercy.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">Early Life and Education</strong><br />
              Laitan&apos;s journey is defined by divine intervention. Just days before her first birthday, she crawled beneath the massive tyres of her father&apos;s &ldquo;911 truck.&rdquo; The engine roared to life, but before the vehicle could move, God intervened, sparing her life for the great purpose she carries today.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              Born on Thursday, April 22, 1976, in Owo, Ondo State, to Chief Francis Fabamiwoye Fadeyi (Ojumu) and Madam Monisola Lydia Fadeyi, Laitan was raised with a foundation of hard work and integrity.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              Her academic journey took her from St. John Mary&apos;s Demonstration School to Baptist High School, Ile-Oluji. Her brilliance earned her the Ayo Ogunrinde Academic Scholarship, allowing her to complete her secondary education. She eventually proceeded to the prestigious Obafemi Awolowo University (OAU), Ile-Ife, where she earned her Bachelor of Pharmacy degree.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">The Professional &amp; Entrepreneurial Visionary</strong><br />
              With a career spanning over 25 years, Laitan&apos;s professional footprint is vast. She founded Springcare Pharmacy Ltd, a people-focused practice built on professionalism and quality care that has since expanded to multiple branches across Lagos.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              A certified Maxwell Leadership Coach and an Emotional Intelligence Coach (Six Seconds, USA), Laitan is a respected voice in the Association of Community Pharmacists of Nigeria (ACPN).
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">Family: The Heartbeat of Her Life</strong><br />
              On April 17, 2004, Laitan married her &ldquo;darling,&rdquo; Pastor Joshua Adeyemi Olaleye. Together, they have built a home rooted in love and impact. They are blessed with three sons, Oluwatomisin, Oluwateniola, and Oluwatisefunmi.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">Faith and Ministerial Life</strong><br />
              Since accepting Christ in July 1991, Laitan has been an unapologetic ambassador for the Gospel. As an ordained Pastor in the Redeemed Christian Church of God (RCCG), she has ministered in various capacities alongside her husband.
            </p>
            <p className="text-text-body leading-relaxed mb-4">
              <strong className="text-text-dark">Impact and Legacy</strong><br />
              Through the Maxwell Leadership Foundation&apos;s iLEAD initiative, she has led teams across Lagos State to reach thousands of students in hundreds of schools. This inspired the launch of the Lightson Impact Foundation for Empowerment (LIFE).
            </p>
            <p className="text-text-muted leading-relaxed italic">
              As she marks this golden milestone, we celebrate a journey sustained by grace and defined by integrity. Pastor Laitan Olaleye remains a beloved friend, a guiding mentor, and a pillar of her family whose smile warms every room she enters.
            </p>
          </div>

          {/* Fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-400"
            style={{
              background: "linear-gradient(to bottom, rgba(255,248,240,0), #FFF8F0)",
              opacity: expanded ? 0 : 1,
            }}
          />

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-gold hover:text-gold/80 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
          >
            <span>{expanded ? "Read Less" : "Read More"}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
