import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pastor Olakiitan Olaleye @ 50 — Birthday Celebration",
  description:
    "Celebrate Pastor Olakiitan Olaleye's 50th birthday. Send tributes, share photos, and upload video messages.",
  icons: {
    icon: "/Number 50 Wall And Art Print _ Number-50.jpg",
    apple: "/Number 50 Wall And Art Print _ Number-50.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${greatVibes.variable}`}
    >
      <head>
        <link rel="icon" href="/Number 50 Wall And Art Print _ Number-50.jpg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
