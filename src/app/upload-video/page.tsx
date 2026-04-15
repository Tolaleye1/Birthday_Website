"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE_BYTES, MAX_VIDEO_DURATION_SECONDS } from "@/lib/types";

export default function UploadVideoPage() {
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_VIDEO_TYPES.includes(f.type)) {
      setError("Please select a valid video file (MP4, MOV, or WebM).");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("This video is too large. Please use a shorter or lower quality clip (max 50MB).");
      return;
    }
    if (f.size > MAX_VIDEO_SIZE_BYTES) {
      setError("Video must be under 50 MB.");
      return;
    }

    // Check duration
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
        setError(`Video is ${Math.ceil(video.duration)} seconds. Maximum is 90 seconds.`);
        setFile(null);
        setDuration(null);
        return;
      }
      setDuration(Math.ceil(video.duration));
      setFile(f);
    };
    video.src = URL.createObjectURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!file) { setError("Please select a video."); return; }

    setUploading(true);
    setProgress(10);

    try {
      // Step 1: Get signed upload URL
      const validateRes = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video",
          submitterName: name.trim(),
          caption: caption.trim() || undefined,
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
          durationSeconds: duration,
        }),
      });

      const validateData = await validateRes.json();
      if (!validateRes.ok) { setError(validateData.error || "Validation failed."); setUploading(false); return; }

      setProgress(30);

      // Step 2: Upload directly to storage
      const uploadRes = await fetch(validateData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) { setError("Upload failed. Please try again."); setUploading(false); return; }

      setProgress(70);

      // Step 3: Confirm the upload
      const confirmRes = await fetch("/api/tributes/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video",
          submitterName: name.trim(),
          caption: caption.trim() || undefined,
          assetPath: validateData.assetPath,
          mimeType: file.type,
          fileSize: file.size,
          durationSeconds: duration,
          fileName: file.name,
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) { setError(confirmData.error || "Failed to save. Please try again."); setUploading(false); return; }

      setProgress(100);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main>
          <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Video Uploaded!</h1>
            <p className="text-white/60 max-w-md mx-auto">Thank you for your heartfelt video message.</p>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg>
            </div>
          </section>
          <section className="py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-dark mb-4">Your video has been submitted!</h2>
            <p className="text-text-muted mb-8">It will appear in the Gallery shortly. Thank you for celebrating with us.</p>
            <Link href="/" className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-8 py-3 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all inline-flex items-center gap-2">
              Back to Home
            </Link>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
          <p className="text-gold-light uppercase tracking-[0.2em] text-xs font-semibold mb-3">Share a Personal Message</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-3">Upload a Video</h1>
          <p className="text-white/60 max-w-md mx-auto">Record a short video greeting for Pastor Olakiitan. Your message will be part of a lasting keepsake.</p>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="video-name" className="block text-sm font-semibold text-text-dark mb-2">
                    Your Name <span className="text-rose">*</span>
                  </label>
                  <input
                    id="video-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all duration-300"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label htmlFor="video-caption" className="block text-sm font-semibold text-text-dark mb-2">
                    Caption <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="video-caption"
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a short note about your video..."
                    className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-2">
                    Your Video <span className="text-rose">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gold-light rounded-xl p-10 text-center hover:border-gold transition-colors duration-300 cursor-pointer bg-gold-glow/10 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-primary/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-primary/20 transition-colors">
                      <svg className="w-8 h-8 text-purple-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    {file ? (
                      <>
                        <p className="font-semibold text-text-dark mb-1">{file.name}</p>
                        <p className="text-sm text-text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB • {duration}s</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-text-dark mb-1">Click or tap to select your video</p>
                        <p className="text-sm text-text-muted">MP4 or MOV, up to 50MB</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Duration Hint */}
                <div className="flex items-start gap-3 bg-blush-light rounded-xl p-4">
                  <svg className="w-5 h-5 text-berry mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-text-dark">Maximum 1 minute 30 seconds</p>
                    <p className="text-xs text-text-muted mt-0.5">Videos exceeding the time limit will not be accepted. Keep your message warm and personal!</p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">
                    {error}
                  </div>
                )}

                {/* Progress */}
                {uploading && (
                  <div className="w-full bg-blush rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gold hover:bg-gold/90 text-purple-deep font-semibold py-4 rounded-[var(--radius-pill)] shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {uploading ? "Uploading..." : "Upload Video"}
                </button>
              </form>
            </div>

            {/* Guidelines Card */}
            <div className="mt-8 bg-gradient-to-br from-blush-light to-blush rounded-[var(--radius-card)] p-6 border border-rose/20">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-text-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Tips for a Great Video
              </h3>
              <ul className="space-y-3 text-sm text-text-body">
                {["Find a quiet, well-lit spot for recording", "Hold your phone horizontally for the best viewing experience", "Start with a smile and speak clearly", "Keep it personal and heartfelt", "Stay within the 90-second limit"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-gold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
