/**
 * ComingSoonBlock — A decorative "coming soon" screen for hidden sections.
 * Rendered in place of content when the admin has toggled a section to hidden.
 */
export default function ComingSoonBlock({ section }: { section: "tributes" | "photos" | "videos" }) {
  const headings: Record<typeof section, string> = {
    tributes: "Tributes Will Be Revealed On",
    photos: "Photos Will Be Revealed On",
    videos: "Videos Will Be Revealed On",
  };

  return (
    <div className="text-center py-20 md:py-28 px-4">
      <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-text-dark mb-6">
        {headings[section]}
      </h2>

      <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-gold">
        April 22, 2026
      </p>
    </div>
  );
}
