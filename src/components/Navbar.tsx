"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Olakiitan" },
  { href: "/gift", label: "Gift the Celebrant" },
  { href: "/gallery", label: "Gallery" },
  { href: "/tributes", label: "Tributes" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-hero backdrop-blur-md border-b border-white/5">
      <div className="w-full px-6 lg:px-12 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-script)] text-gold text-2xl"
        >
          Pastor Olakiitan Olaleye @ 50
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-gold"
                  : "text-white/70 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit-tribute"
            className="bg-gold text-purple-deep font-semibold px-5 py-2 rounded-[100px] text-sm hover:bg-gold/90 transition-all"
          >
            Send a Tribute
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4">
          <Link href="/" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/about" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>About Olakiitan</Link>
          <Link href="/gift" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>Gift the Celebrant</Link>
          <Link href="/submit-tribute" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>Send a Tribute</Link>
          <Link href="/gallery" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>Gallery</Link>
          <Link href="/tributes" className="block py-3 text-white/80 font-medium border-b border-white/10" onClick={() => setMobileOpen(false)}>Tributes Wall</Link>
          <Link
            href="/submit-tribute"
            className="block mt-4 bg-gold text-purple-deep font-semibold py-3 rounded-[100px] text-center text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Send a Tribute
          </Link>
        </div>
      )}
    </nav>
  );
}
