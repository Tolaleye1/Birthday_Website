import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { ALLOWED_GALLERY_TYPES, MAX_PHOTO_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES, ALLOWED_PHOTO_TYPES } from "@/lib/types";

/** Admin: upload a Laitan gallery item (photo or video) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, fileName, mimeType, fileSize } = body;

    if (!mimeType || !ALLOWED_GALLERY_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "Invalid file format. Accepted: JPEG, PNG, WebP, HEIC, MP4, MOV, WebM." }, { status: 400 });
    }

    const isPhoto = ALLOWED_PHOTO_TYPES.includes(mimeType);
    const maxSize = isPhoto ? MAX_PHOTO_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    if (fileSize > maxSize) {
      return NextResponse.json({ error: `File must be under ${isPhoto ? "10" : "100"} MB.` }, { status: 400 });
    }

    const supabase = createServerClient();
    const ext = fileName?.split(".").pop() || "jpg";
    const path = `laitan/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data: signedData, error: signedError } = await supabase.storage
      .from("media")
      .createSignedUploadUrl(path);

    if (signedError || !signedData) {
      return NextResponse.json({ error: "Failed to prepare upload." }, { status: 500 });
    }

    const mediaType = isPhoto ? "photo" : "video";

    return NextResponse.json({
      success: true,
      uploadUrl: signedData.signedUrl,
      uploadToken: signedData.token,
      assetPath: path,
      caption: caption || null,
      mediaType,
    });
  } catch (err) {
    console.error("Laitan gallery API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/** Admin: confirm Laitan gallery item after upload */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetPath, caption, mediaType } = body;

    if (!assetPath) {
      return NextResponse.json({ error: "Asset path required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(assetPath);

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("laitan_gallery")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.display_order ?? 0) + 1;

    const { data, error } = await supabase.from("laitan_gallery").insert({
      asset_path: assetPath,
      asset_url: urlData.publicUrl,
      caption: caption || null,
      display_order: nextOrder,
      media_type: mediaType || "photo",
    }).select().single();

    if (error) {
      console.error("Laitan gallery insert error:", error);
      return NextResponse.json({ error: "Failed to save item." }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (err) {
    console.error("Laitan gallery confirm error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
