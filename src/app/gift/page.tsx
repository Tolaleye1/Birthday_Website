import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GiftPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Celebrate with Generosity</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Gift the Celebrant</h1>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-20 md:py-28 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-glow mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-8">Account Details</h2>
              
              <div className="flex flex-col gap-5 w-full">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1 font-medium">Account Number</p>
                  <p className="text-text-dark text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-purple-deep to-berry bg-clip-text text-transparent pb-1">0030258046</p>
                </div>
                
                <div className="gold-divider w-full opacity-50 my-1" />
                
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1 font-medium">Account Name</p>
                  <p className="text-text-dark text-lg md:text-xl font-bold">Olaleye Olakiitan</p>
                </div>
                
                <div className="gold-divider w-full opacity-50 my-1" />
                
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1 font-medium">Bank</p>
                  <p className="text-text-dark text-lg md:text-xl font-bold">Access Bank</p>
                </div>
              </div>

              <div className="gold-divider max-w-[80px] mx-auto mt-10 mb-6" />
              <Link href="/" className="text-gold hover:text-gold/80 font-semibold text-sm inline-flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                Back to Home
              </Link>
            </div>
            
            <p className="text-center mt-6 text-sm text-text-muted">
              Kindly use your name as the payment reference
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
