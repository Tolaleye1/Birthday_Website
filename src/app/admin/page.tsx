"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import type { Contribution, LaitanGalleryItem } from "@/lib/types";

type AdminTab = "all" | "text" | "photo" | "video";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<AdminTab>("all");
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [laitanItems, setLaitanItems] = useState<LaitanGalleryItem[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const laitanFileRef = useRef<HTMLInputElement>(null);
  const [laitanCaption, setLaitanCaption] = useState("");
  const [laitanUploading, setLaitanUploading] = useState(false);

  const supabase = createClient();

  const loadData = useCallback(async () => {
    const [contribRes, laitanRes] = await Promise.all([
      supabase.from("contributions").select("*").eq("is_deleted", false).order("created_at", { ascending: false }),
      supabase.from("laitan_gallery").select("*").order("display_order", { ascending: true }),
    ]);
    setContributions((contribRes.data as Contribution[]) || []);
    setLaitanItems((laitanRes.data as LaitanGalleryItem[]) || []);
  }, [supabase]);

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthed(true);
        loadData();
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, [supabase, loadData]);

  // Amendment 7: Request access instead of direct magic link
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error); setSubmitting(false); return; }
      setRequestSent(true);
    } catch { setLoginError("Failed to submit request."); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/tributes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContributions((prev) => prev.filter((c) => c.id !== id));
      }
    } catch { /* ignore */ }
    setDeleting(null);
  };

  const handleLaitanUpload = async () => {
    const file = laitanFileRef.current?.files?.[0];
    if (!file) return;
    setLaitanUploading(true);
    try {
      // Get signed URL
      const res = await fetch("/api/laitan-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: laitanCaption, fileName: file.name, mimeType: file.type, fileSize: file.size }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error); setLaitanUploading(false); return; }

      // Upload
      await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });

      // Confirm
      await fetch("/api/laitan-gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetPath: data.assetPath, caption: laitanCaption, mediaType: data.mediaType }),
      });

      setLaitanCaption("");
      if (laitanFileRef.current) laitanFileRef.current.value = "";
      loadData();
    } catch { alert("Upload failed."); }
    setLaitanUploading(false);
  };

  const handleDeleteLaitan = async (item: LaitanGalleryItem) => {
    if (!confirm("Delete this item?")) return;
    try {
      await supabase.storage.from("media").remove([item.asset_path]);
      await supabase.from("laitan_gallery").delete().eq("id", item.id);
      loadData();
    } catch { /* ignore */ }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthed(false);
  };

  if (authLoading) {
    return (
      <><Navbar /><main className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></main><Footer /></>
    );
  }

  if (!isAuthed) {
    return (
      <>
        <Navbar />
        <main>
          <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 text-center relative">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white">Admin Dashboard</h1>
            <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
          </section>
          <section className="py-20 px-4">
            <div className="max-w-sm mx-auto">
              {requestSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold-glow mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-2">Access Request Sent</h2>
                  <p className="text-text-muted text-sm">Your request has been submitted. You&apos;ll receive an email if your request is approved.</p>
                </div>
              ) : (
                <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-4 text-center">Admin Access</h2>
                  <p className="text-text-muted text-sm text-center mb-6">Enter your email to request admin access. The site owner will review your request.</p>
                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    <div>
                      <label htmlFor="admin-email" className="block text-sm font-semibold text-text-dark mb-2">Email Address</label>
                      <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gold-light/60 bg-ivory text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-all" />
                    </div>
                    {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
                    <button type="submit" disabled={submitting} className="w-full bg-purple-primary hover:bg-purple-primary/90 text-white font-semibold py-3 rounded-[var(--radius-pill)] transition-all disabled:opacity-50">
                      {submitting ? "Submitting..." : "Request Access"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Filter contributions
  const filtered = tab === "all" ? contributions : contributions.filter((c) => c.type === tab);

  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-24 pb-12 md:pt-32 md:pb-16 px-4 relative">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/50 text-sm mt-1">{contributions.length} submissions</p>
            </div>
            <button onClick={handleLogout} className="text-white/60 hover:text-white text-sm transition-colors">Sign Out</button>
          </div>
          <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 0 1080 20C1260 30 1380 35 1440 38V40H0Z" fill="#FFF8F0" /></svg></div>
        </section>

        <section className="py-8 md:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["all", "text", "photo", "video"] as AdminTab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-all ${tab === t ? "bg-purple-primary text-white" : "bg-white text-text-muted hover:text-text-dark border border-gold-light/30"}`}>
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  <span className="ml-1 text-xs opacity-70">({t === "all" ? contributions.length : contributions.filter((c) => c.type === t).length})</span>
                </button>
              ))}
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden mb-10">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-text-muted">No submissions in this category.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ivory border-b border-gold-light/30">
                      <tr>
                        <th className="text-left p-4 font-semibold text-text-dark">Name</th>
                        <th className="text-left p-4 font-semibold text-text-dark">Type</th>
                        <th className="text-left p-4 font-semibold text-text-dark">Content</th>
                        <th className="text-left p-4 font-semibold text-text-dark">Date</th>
                        <th className="text-right p-4 font-semibold text-text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <tr key={c.id} className="border-b border-gold-light/20 hover:bg-ivory/50">
                          <td className="p-4 font-medium text-text-dark">{c.submitter_name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.type === "text" ? "bg-blush text-berry" : c.type === "photo" ? "bg-gold-glow text-gold" : "bg-purple-primary/10 text-purple-primary"}`}>
                              {c.type}
                            </span>
                          </td>
                          <td className="p-4 text-text-muted max-w-xs truncate">{c.message || c.caption || "—"}</td>
                          <td className="p-4 text-text-muted whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                              className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors disabled:opacity-50">
                              {deleting === c.id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Laitan's Gallery Management */}
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                Laitan&apos;s Gallery
              </h2>
              <p className="text-text-muted text-sm mb-6">Upload photos and videos. These appear on the Home page (&quot;Laitan Throughout the Years&quot;) and Gallery (&quot;Laitan&apos;s Gallery&quot; tab).</p>

              {/* Upload form */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input type="text" value={laitanCaption} onChange={(e) => setLaitanCaption(e.target.value)} placeholder="Caption (optional)"
                  className="flex-1 px-4 py-2 rounded-xl border border-gold-light/60 bg-ivory text-text-body text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20" />
                <input ref={laitanFileRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold file:text-purple-deep file:font-semibold file:text-sm" />
                <button onClick={handleLaitanUpload} disabled={laitanUploading}
                  className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-6 py-2 rounded-[var(--radius-pill)] text-sm transition-all disabled:opacity-50">
                  {laitanUploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {/* Gallery Grid */}
              {laitanItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {laitanItems.map((item) => (
                    <div key={item.id} className="relative group rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]">
                      {item.media_type === "video" ? (
                        <video src={item.asset_url || ""} className="w-full aspect-square object-cover" preload="metadata" muted />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.asset_url || ""} alt={item.caption || ""} className="w-full aspect-square object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => handleDeleteLaitan(item)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-[var(--radius-pill)] text-xs font-semibold transition-all">Delete</button>
                      </div>
                      {(item.caption || item.media_type === "video") && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex items-center gap-1">
                          {item.media_type === "video" && (
                            <svg className="w-3 h-3 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          )}
                          {item.caption && <p className="text-white text-xs truncate">{item.caption}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
