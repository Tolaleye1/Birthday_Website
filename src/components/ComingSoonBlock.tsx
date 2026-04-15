/**
 * ComingSoonBlock — A decorative "coming soon" screen for hidden sections.
 * Rendered in place of content when the admin has toggled a section to hidden.
 */
export default function ComingSoonBlock({ section }: { section: "tributes" | "photos" | "videos" }) {
  const headings: Record<typeof section, string> = {
    tributes: "Tributes Will Be Revealed",
    photos: "Photos Will Be Revealed",
    videos: "Videos Will Be Revealed",
  };

  const subtexts: Record<typeof section, string> = {
    tributes:
      "All the heartfelt messages shared for Pastor Olakiitan will be unveiled on",
    photos:
      "All the beautiful photos shared for Pastor Olakiitan will be unveiled on",
    videos:
      "All the video messages shared for Pastor Olakiitan will be unveiled on",
  };

  const notes: Record<typeof section, string> = {
    tributes:
      "Your tribute has been received and will appear here on the day.",
    photos:
      "Your photo has been received and will appear here on the day.",
    videos:
      "Your video has been received and will appear here on the day.",
  };

  return (
    <div className="text-center py-20 md:py-28 px-4">
      {/* Sparkle icon */}
      <div className="flex justify-center mb-6">
        <svg
          className="w-12 h-12 text-gold"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.09 6.26L20.18 9.27l-4.91 4.48L16.54 20 12 16.77 7.46 20l1.27-6.25-4.91-4.48 6.09-1.01L12 2z" />
        </svg>
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-text-dark mb-4">
        {headings[section]}
      </h2>

      <p className="text-text-muted font-[family-name:var(--font-body)] max-w-md mx-auto mb-3">
        {subtexts[section]}
      </p>

      <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-gold mb-6">
        April 22, 2026
      </p>

      <p className="text-text-muted/70 text-sm font-[family-name:var(--font-body)] max-w-sm mx-auto">
        {notes[section]}
      </p>
    </div>
  );
}
