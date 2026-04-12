"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Contribution, LaitanGalleryItem, LaitanYearSlot } from "@/lib/types";
import { compressImage } from "@/lib/compressImage";
import { ALLOWED_PHOTO_TYPES } from "@/lib/types";

type AdminTab = "all" | "text" | "photo" | "video";

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("all");
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [laitanItems, setLaitanItems] = useState<LaitanGalleryItem[]>([]);
  const [yearSlots, setYearSlots] = useState<LaitanYearSlot[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const laitanFileRef = useRef<HTMLInputElement>(null);
  const [laitanCaption, setLaitanCaption] = useState("");
  const [laitanUploading, setLaitanUploading] = useState(false);
  const [yearSlotFiles, setYearSlotFiles] = useState<Record<number, File | null>>({});
  const [yearSlotCaptions, setYearSlotCaptions] = useState<Record<number, string>>({});
  const [yearSlotUploading, setYearSlotUploading] = useState<Record<number, boolean>>({});
  const [laitanCompressing, setLaitanCompressing] = useState(false);
  const [yearSlotCompressing, setYearSlotCompressing] = useState<Record<number, boolean>>({});

  const loadData = useCallback(async () => {
    const [contribRes, laitanRes, yearsRes] = await Promise.all([
      fetch("/api/tributes"),
      fetch("/api/laitan-gallery"),
      fetch("/api/laitan-gallery?scope=years"),
    ]);

    const [contribData, laitanData, yearsData] = await Promise.all([
      contribRes.json(),
      laitanRes.json(),
      yearsRes.json(),
    ]);

    if (!contribRes.ok) {
      throw new Error(contribData.error || "Failed to load contributions.");
    }

    if (!laitanRes.ok) {
      throw new Error(laitanData.error || "Failed to load Laitan gallery.");
    }

    if (!yearsRes.ok) {
      throw new Error(yearsData.error || "Failed to load Laitan Over the Years slots.");
    }

    setContributions((contribData.contributions as Contribution[]) || []);
    setLaitanItems((laitanData.items as LaitanGalleryItem[]) || []);
    setYearSlots((yearsData.slots as LaitanYearSlot[]) || []);
    setYearSlotCaptions(
      Object.fromEntries(
        ((yearsData.slots as LaitanYearSlot[]) || []).map((slot) => [slot.position, slot.caption || ""])
      )
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAdminData() {
      try {
        const [contribRes, laitanRes, yearsRes] = await Promise.all([
          fetch("/api/tributes"),
          fetch("/api/laitan-gallery"),
          fetch("/api/laitan-gallery?scope=years"),
        ]);

        const [contribData, laitanData, yearsData] = await Promise.all([
          contribRes.json(),
          laitanRes.json(),
          yearsRes.json(),
        ]);

        if (cancelled) {
          return;
        }

        if (contribRes.ok) {
          setContributions((contribData.contributions as Contribution[]) || []);
        }

        if (laitanRes.ok) {
          setLaitanItems((laitanData.items as LaitanGalleryItem[]) || []);
        }

        if (yearsRes.ok) {
          const slots = (yearsData.slots as LaitanYearSlot[]) || [];
          setYearSlots(slots);
          setYearSlotCaptions(
            Object.fromEntries(slots.map((slot) => [slot.position, slot.caption || ""]))
          );
        }
      } catch {
        if (!cancelled) {
          setContributions([]);
          setLaitanItems([]);
          setYearSlots([]);
        }
      }
    }

    void hydrateAdminData();

    return () => {
      cancelled = true;
    };
  }, []);

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

    // Compress if it's an image
    let uploadFile = file;
    if (ALLOWED_PHOTO_TYPES.includes(file.type)) {
      try {
        setLaitanCompressing(true);
        uploadFile = await compressImage(file);
      } catch { /* use original if compression fails */ }
      setLaitanCompressing(false);
    }

    try {
      // Get signed URL
      const res = await fetch("/api/laitan-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: laitanCaption, fileName: uploadFile.name, mimeType: uploadFile.type, fileSize: uploadFile.size }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error); setLaitanUploading(false); return; }

      // Upload
      const uploadRes = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": uploadFile.type }, body: uploadFile });
      if (!uploadRes.ok) {
        alert("Upload failed.");
        setLaitanUploading(false);
        return;
      }

      // Confirm
      const confirmRes = await fetch("/api/laitan-gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetPath: data.assetPath, caption: laitanCaption, mediaType: data.mediaType }),
      });

      if (!confirmRes.ok) {
        const confirmData = await confirmRes.json();
        alert(confirmData.error || "Failed to save item.");
        setLaitanUploading(false);
        return;
      }

      setLaitanCaption("");
      if (laitanFileRef.current) laitanFileRef.current.value = "";
      await loadData();
    } catch { alert("Upload failed."); }
    setLaitanUploading(false);
  };

  const handleDeleteLaitan = async (item: LaitanGalleryItem) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/laitan-gallery?id=${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setLaitanItems((prev) => prev.filter((entry) => entry.id !== item.id));
      }
    } catch { /* ignore */ }
  };

  async function handleYearSlotUpload(position: number) {
    const file = yearSlotFiles[position];
    if (!file) {
      alert("Please choose an image for this slot.");
      return;
    }

    setYearSlotUploading((prev) => ({ ...prev, [position]: true }));

    // Compress if it's an image
    let uploadFile = file;
    if (ALLOWED_PHOTO_TYPES.includes(file.type)) {
      try {
        setYearSlotCompressing((prev) => ({ ...prev, [position]: true }));
        uploadFile = await compressImage(file);
      } catch { /* use original if compression fails */ }
      setYearSlotCompressing((prev) => ({ ...prev, [position]: false }));
    }

    try {
      const prepareRes = await fetch("/api/laitan-gallery?scope=years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          fileName: uploadFile.name,
          mimeType: uploadFile.type,
          fileSize: uploadFile.size,
        }),
      });

      const prepareData = await prepareRes.json();
      if (!prepareRes.ok) {
        alert(prepareData.error || "Failed to prepare slot upload.");
        return;
      }

      const uploadRes = await fetch(prepareData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });

      if (!uploadRes.ok) {
        alert("Upload failed.");
        return;
      }

      const confirmRes = await fetch("/api/laitan-gallery?scope=years", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          assetPath: prepareData.assetPath,
          caption: yearSlotCaptions[position] || "",
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        alert(confirmData.error || "Failed to save this slot.");
        return;
      }

      setYearSlotFiles((prev) => ({ ...prev, [position]: null }));
      await loadData();
    } catch {
      alert("Upload failed.");
    } finally {
      setYearSlotUploading((prev) => ({ ...prev, [position]: false }));
    }
  }

  async function handleYearSlotClear(position: number) {
    if (!confirm(`Clear slot ${position}?`)) return;

    try {
      const res = await fetch(`/api/laitan-gallery?scope=years&position=${position}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to clear the slot.");
        return;
      }

      setYearSlotFiles((prev) => ({ ...prev, [position]: null }));
      await loadData();
    } catch {
      alert("Failed to clear the slot.");
    }
  }

  // Filter contributions
  const filtered = tab === "all" ? contributions : contributions.filter((c) => c.type === tab);
  const yearSlotMap = new Map(yearSlots.map((slot) => [slot.position, slot]));

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
            <p className="text-white/60 text-sm">Open access enabled</p>
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
                          <td className="p-4 text-text-muted max-w-xs truncate">{c.message || c.caption || "-"}</td>
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

            {/* Run the SQL amendment in Supabase Dashboard SQL Editor if laitan_years_slots does not exist yet. */}
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-8 mb-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark">Laitan Over the Years</h2>
                  <p className="text-text-muted text-sm mt-1">These 6 curated slots power the home page section. They are separate from the main Laitan gallery.</p>
                </div>
                <div className="rounded-2xl bg-gold-glow px-4 py-2 text-xs font-semibold text-purple-deep">
                  Run SQL if needed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }, (_, index) => {
                  const position = index + 1;
                  const slot = yearSlotMap.get(position);

                  return (
                    <div key={position} className="rounded-[var(--radius-card)] border border-gold-light/30 bg-ivory/50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-text-dark">Slot {position}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-gold">{slot ? "Filled" : "Empty"}</p>
                      </div>

                      <div className={`aspect-[4/5] rounded-3xl overflow-hidden border border-gold-light/30 mb-4 ${slot?.asset_url ? "bg-white" : "bg-blush-light"}`}>
                        {slot?.asset_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={slot.asset_url} alt={slot.caption || `Slot ${position}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">No image yet</div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={yearSlotCaptions[position] || ""}
                          onChange={(event) => setYearSlotCaptions((prev) => ({ ...prev, [position]: event.target.value }))}
                          placeholder="Caption (optional)"
                          className="w-full px-4 py-2 rounded-xl border border-gold-light/60 bg-white text-text-body text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20"
                        />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/heic"
                          onChange={(event) => setYearSlotFiles((prev) => ({ ...prev, [position]: event.target.files?.[0] || null }))}
                          className="w-full text-sm file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold file:text-purple-deep file:font-semibold"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void handleYearSlotUpload(position)}
                            disabled={yearSlotUploading[position]}
                            className="flex-1 bg-purple-primary hover:bg-purple-primary/90 text-white font-semibold px-4 py-2 rounded-[var(--radius-pill)] text-sm transition-all disabled:opacity-50"
                          >
                            {yearSlotCompressing[position] ? "Preparing your photo..." : yearSlotUploading[position] ? "Saving..." : slot ? "Replace" : "Upload"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleYearSlotClear(position)}
                            disabled={!slot}
                            className="px-4 py-2 rounded-[var(--radius-pill)] border border-gold-light/40 text-text-dark text-sm font-semibold disabled:opacity-40"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Laitan's Gallery Management */}
            <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                Laitan&apos;s Gallery
              </h2>
              <p className="text-text-muted text-sm mb-6">Upload photos and videos for the dedicated Laitan&apos;s Gallery tab on the gallery page.</p>

              {/* Upload form */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input type="text" value={laitanCaption} onChange={(e) => setLaitanCaption(e.target.value)} placeholder="Caption (optional)"
                  className="flex-1 px-4 py-2 rounded-xl border border-gold-light/60 bg-ivory text-text-body text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20" />
                <input ref={laitanFileRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" className="text-sm file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold file:text-purple-deep file:font-semibold file:text-sm" />
                <button onClick={handleLaitanUpload} disabled={laitanUploading}
                  className="bg-gold hover:bg-gold/90 text-purple-deep font-semibold px-6 py-2 rounded-[var(--radius-pill)] text-sm transition-all disabled:opacity-50">
                  {laitanCompressing ? "Preparing your photo..." : laitanUploading ? "Uploading..." : "Upload"}
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
