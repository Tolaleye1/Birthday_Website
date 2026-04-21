import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import BiographySection from "@/components/home/BiographySection";
import LaitanYearsSection from "@/components/home/LaitanYearsSection";
import ParticipateSection from "@/components/home/ParticipateSection";
import RecentTributesSection from "@/components/home/RecentTributesSection";
import BibleVerseSection from "@/components/home/BibleVerseSection";
import EventDetailsSection from "@/components/home/EventDetailsSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BiographySection />
        <LaitanYearsSection />
        <ParticipateSection />
        <RecentTributesSection />
        <BibleVerseSection />
        <EventDetailsSection />
      </main>
      <Footer />
    </>
  );
}
