export default function BibleVerseSection() {
  return (
    <section
      className="py-16 md:py-24 px-4 relative overflow-hidden"
      style={{ background: "#2D1048" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <p
          className="uppercase tracking-[0.3em] text-xs font-semibold text-gold mb-6"
          style={{ fontVariant: "small-caps" }}
        >
          Isaiah 60:1 NIV
        </p>
        <blockquote className="font-[family-name:var(--font-display)] text-2xl md:text-4xl font-normal italic text-white/95 leading-snug mb-0">
          &ldquo;Arise, shine, for your light has come, and the glory of the LORD rises upon you.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
