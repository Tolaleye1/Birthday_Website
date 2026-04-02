import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES } from "@/lib/types";

/** Admin: upload a Laitan photo */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, fileName, mimeType, fileSize } = body;

    if (!mimeType || !ALLOWED_PHOTO_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "Invalid photo format." }, { status: 400 });
    }
    if (fileSize > MAX_PHOTO_SIZE_BYTES) {
      return NextResponse.json({ error: "Photo must be under 10 MB." }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      uploadUrl: signedData.signedUrl,
      uploadToken: signedData.token,
      assetPath: path,
      caption: caption || null,
    });
  } catch (err) {
    console.error("Laitan photo API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/** Admin: confirm Laitan photo after upload */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetPath, caption } = body;

    if (!assetPath) {
      return NextResponse.json({ error: "Asset path required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(assetPath);

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from("laitan_photos")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.display_order ?? 0) + 1;

    const { data, error } = await supabase.from("laitan_photos").insert({
      asset_path: assetPath,
      asset_url: urlData.publicUrl,
      caption: caption || null,
      display_order: nextOrder,
    }).select().single();

    if (error) {
      console.error("Laitan photo insert error:", error);
      return NextResponse.json({ error: "Failed to save photo." }, { status: 500 });
    }

    return NextResponse.json({ success: true, photo: data }, { status: 201 });
  } catch (err) {
    console.error("Laitan photo confirm error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
