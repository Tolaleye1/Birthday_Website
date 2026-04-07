import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-purple-deep py-10 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-[family-name:var(--font-script)] text-gold text-2xl mb-3">
          Pastor Olakiitan Olaleye @ 50
        </p>
        <p className="text-white/40 text-sm mb-6">
          Celebrating a Golden Legacy of Impact
        </p>
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          <Link href="/" className="text-white/50 hover:text-gold text-sm transition-colors">Home</Link>
          <Link href="/submit-tribute" className="text-white/50 hover:text-gold text-sm transition-colors">Send a Tribute</Link>
          <Link href="/gift" className="text-white/50 hover:text-gold text-sm transition-colors">Gift the Celebrant</Link>
          <Link href="/gallery" className="text-white/50 hover:text-gold text-sm transition-colors">Gallery</Link>
          <Link href="/tributes" className="text-white/50 hover:text-gold text-sm transition-colors">Tributes</Link>
        </div>
        <div className="gold-divider max-w-xs mx-auto mb-6" />
        <p className="text-white/30 text-xs">
          Made with love for the 50th birthday celebration of Pastor Olakiitan Olaleye
        </p>
        {/* <Link
          href="/admin"
          className="text-white/20 hover:text-white/40 text-xs mt-2 inline-block transition-colors"
        >
          Admin
        </Link> */}
        <p className="text-white/30 text-xs mt-2">Courtesy: Oluwatomisin Olaleye <br />          Fadeyi Bukunmi</p>
      </div>
    </footer>
  );
}
