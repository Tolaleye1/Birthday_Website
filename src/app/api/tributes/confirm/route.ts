import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/** Called after a successful direct-to-storage upload to persist the metadata record */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, submitterName, caption, assetPath, mimeType, fileSize, durationSeconds, fileName } = body;

    if (!type || !submitterName?.trim() || !assetPath) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get public URL for the asset
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(assetPath);

    const { data, error } = await supabase.from("contributions").insert({
      type,
      submitter_name: submitterName.trim(),
      caption: caption?.trim() || null,
      asset_path: assetPath,
      asset_url: urlData.publicUrl,
      asset_mime_type: mimeType || null,
      asset_size_bytes: fileSize || null,
      video_duration_seconds: type === "video" ? (durationSeconds || null) : null,
    }).select().single();

    if (error) {
      console.error("Confirm insert error:", error);
      return NextResponse.json({ error: "Failed to save contribution record." }, { status: 500 });
    }

    // Copy original video to originals/ folder for easy admin access
    if (type === "video" && assetPath) {
      try {
        const safeName = (fileName || "video.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
        const originalsPath = `originals/videos/${Date.now()}-${safeName}`;
        const { error: copyError } = await supabase.storage
          .from("media")
          .copy(assetPath, originalsPath);
        if (copyError) {
          console.error("Failed to copy video to originals:", copyError);
        }
      } catch (copyErr) {
        console.error("Originals copy error (non-blocking):", copyErr);
      }
    }

    return NextResponse.json({ success: true, contribution: data }, { status: 201 });
  } catch (err) {
    console.error("Confirm API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
