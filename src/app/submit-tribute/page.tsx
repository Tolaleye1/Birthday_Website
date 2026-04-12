"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE_BYTES, MAX_VIDEO_DURATION_SECONDS } from "@/lib/types";
import { compressImage } from "@/lib/compressImage";

type TributeTab = "text" | "photo" | "video";

export default function SubmitTributePage() {
  const [tab, setTab] = useState<TributeTab>("text");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName(""); setMessage(""); setCaption(""); setFile(null); setDuration(null); setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;

    if (tab === "photo") {
      if (!ALLOWED_PHOTO_TYPES.includes(f.type)) { setError("Please select a valid image (JPEG, PNG, WebP, or HEIC)."); return; }
      if (f.size > MAX_PHOTO_SIZE_BYTES) { setError("Photo must be under 10 MB."); return; }
      setFile(f);
    } else if (tab === "video") {
      if (!ALLOWED_VIDEO_TYPES.includes(f.type)) { setError("Please select a valid video (MP4, MOV, or WebM)."); return; }
      if (f.size > 50 * 1024 * 1024) { setError("This video is too large. Please use a shorter or lower quality clip (max 50MB)."); return; }
      if (f.size > MAX_VIDEO_SIZE_BYTES) { setError("Video must be under 50 MB."); return; }
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
          setError(`Video is ${Math.ceil(video.duration)}s. Maximum is 90s.`); setFile(null); return;
        }
        setDuration(Math.ceil(video.duration));
        setFile(f);
      };
      video.src = URL.createObjectURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }

    if (tab === "text") {
      if (!message.trim()) { setError("Please enter your message."); return; }
      setSubmitting(true);
      try {
        const res = await fetch("/api/tributes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "text", submitterName: name.trim(), message: message.trim() }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        setSuccess(true);
      } catch { setError("Something went wrong."); } finally { setSubmitting(false); }
      return;
    }

    // Photo or Video upload flow
    if (!file) { setError(`Please select a ${tab}.`); return; }
    setSubmitting(true);

    // Compress images before uploading
    let uploadFile = file;
    if (tab === "photo") {
      try {
        setCompressing(true);
        uploadFile = await compressImage(file);
      } catch { /* use original if compression fails */ }
      setCompressing(false);
    }

    setProgress(10);

    try {
      const validateRes = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab, submitterName: name.trim(), caption: caption.trim() || undefined,
          fileName: uploadFile.name, mimeType: uploadFile.type, fileSize: uploadFile.size,
          durationSeconds: tab === "video" ? duration : undefined,
        }),
      });
      const validateData = await validateRes.json();
      if (!validateRes.ok) { setError(validateData.error); setSubmitting(false); return; }
      setProgress(30);

      const uploadRes = await fetch(validateData.uploadUrl, { method: "PUT", headers: { "Content-Type": uploadFile.type }, body: uploadFile });
      if (!uploadRes.ok) { setError("Upload failed."); setSubmitting(false); return; }
      setProgress(70);

      const confirmRes = await fetch("/api/tributes/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab, submitterName: name.trim(), caption: caption.trim() || undefined,
          assetPath: validateData.assetPath, mimeType: uploadFile.type, fileSize: uploadFile.size,
          durationSeconds: tab === "video" ? duration : undefined,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) { setError(confirmData.error || "Failed to save."); setSubmitting(false); return; }
      setProgress(100);
      setSuccess(true);
    } catch { setError("Something went wrong."); } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main>
          <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white">Tribute Sent!</h1>
            <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
          </section>
          <section className="py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Thank you for your tribute!</h2>
            <p className="text-text-muted mb-8">Your {tab === "text" ? "message" : tab} has been submitted successfully.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all">Back to Home</Link>
              <button onClick={() => { setSuccess(false); resetForm(); }} className="border-2 border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-white font-semibold px-8 py-3 rounded-[var(--radius-pill)] transition-all">Send Another</button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const tabs: { key: TributeTab; label: string; icon: React.ReactNode }[] = [
    { key: "text", label: "Text", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
    { key: "photo", label: "Photo", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg> },
    { key: "video", label: "Video", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg> },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Share Your Heart</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Send a Tribute</h1>
          <p className="text-white/60 max-w-md mx-auto">Write a message, share a photo, or record a video for Pastor Olakiitan&apos;s 50th birthday celebration.</p>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-xl mx-auto">
            {/* Tab Switcher */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-[var(--radius-pill)] shadow-[var(--shadow-card)] p-1 inline-flex gap-1">
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => { setTab(t.key); setFile(null); setError(""); }}
                    className={`px-6 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${tab === t.key ? "bg-purple-primary text-white shadow-md" : "text-text-muted hover:text-text-dark"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="tribute-name" className="block text-sm font-semibold text-text-dark mb-2">Your Name <span className="text-rose">*</span></label>
                  <input id="tribute-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all" />
                </div>

                {/* Text tab: Message */}
                {tab === "text" && (
                  <div>
                    <label htmlFor="tribute-message" className="block text-sm font-semibold text-text-dark mb-2">Your Message <span className="text-rose">*</span></label>
                    <textarea id="tribute-message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share your heartfelt birthday message..."
                      className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all resize-none" />
                  </div>
                )}

                {/* Photo/Video tab: Caption + File */}
                {(tab === "photo" || tab === "video") && (
                  <>
                    <div>
                      <label htmlFor="tribute-caption" className="block text-sm font-semibold text-text-dark mb-2">Caption <span className="text-text-muted font-normal">(optional)</span></label>
                      <textarea id="tribute-caption" rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={`Add a short note about your ${tab}...`}
                        className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Your {tab === "photo" ? "Photo" : "Video"} <span className="text-rose">*</span></label>
                      <div className="border-2 border-dashed border-gold-light rounded-xl p-8 text-center hover:border-gold transition-colors cursor-pointer bg-gold-glow/10 group"
                        onClick={() => fileInputRef.current?.click()}>
                        {file ? (
                          <>
                            <p className="font-semibold text-text-dark mb-1">{file.name}</p>
                            <p className="text-sm text-text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB{duration ? ` • ${duration}s` : ""}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-text-dark mb-1">Click to select your {tab}</p>
                            <p className="text-sm text-text-muted">{tab === "photo" ? "JPEG, PNG, WebP • up to 10MB" : "MP4/MOV • up to 50MB • max 90s"}</p>
                          </>
                        )}
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange}
                          accept={tab === "photo" ? "image/jpeg,image/png,image/webp,image/heic" : "video/mp4,video/quicktime,video/webm"} />
                      </div>
                    </div>
                  </>
                )}

                {error && <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

                {compressing && (
                  <p className="text-sm text-gold font-semibold text-center animate-pulse">Preparing your photo...</p>
                )}

                {submitting && !compressing && progress > 0 && (
                  <div className="w-full bg-blush rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full bg-gold hover:bg-gold/90 text-purple-deep font-semibold py-4 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  {submitting ? "Sending..." : "Send Tribute"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
