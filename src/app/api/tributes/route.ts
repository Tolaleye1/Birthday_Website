import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  ALLOWED_PHOTO_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
} from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const parsedLimit = limit ? Number(limit) : null;
    const parsedOffset = offset ? Number(offset) : 0;

    const supabase = createServerClient();
    let query = supabase
      .from("contributions")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (type && ["text", "photo", "video"].includes(type)) {
      query = query.eq("type", type);
    }

    if (parsedLimit && Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.range(parsedOffset, parsedOffset + parsedLimit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Contributions fetch error:", error);
      return NextResponse.json({ error: "Failed to load contributions." }, { status: 500 });
    }

    return NextResponse.json({ contributions: data ?? [] });
  } catch (err) {
    console.error("Contributions GET error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, submitterName, message, fileName, mimeType, fileSize, durationSeconds } = body;

    // Validate required fields
    if (!type || !submitterName?.trim()) {
      return NextResponse.json({ error: "Type and name are required." }, { status: 400 });
    }

    if (type === "text") {
      if (!message?.trim()) {
        return NextResponse.json({ error: "Message is required for text tributes." }, { status: 400 });
      }
      const supabase = createServerClient();
      const { data, error } = await supabase.from("contributions").insert({
        type: "text",
        submitter_name: submitterName.trim(),
        message: message.trim(),
      }).select().single();

      if (error) {
        console.error("Insert error:", error);
        return NextResponse.json({ error: "Failed to save tribute." }, { status: 500 });
      }
      return NextResponse.json({ success: true, contribution: data }, { status: 201 });
    }

    if (type === "photo") {
      if (!mimeType || !ALLOWED_PHOTO_TYPES.includes(mimeType)) {
        return NextResponse.json({ error: "Invalid photo format. Use JPEG, PNG, WebP, or HEIC." }, { status: 400 });
      }
      if (fileSize > MAX_PHOTO_SIZE_BYTES) {
        return NextResponse.json({ error: "Photo must be under 10 MB." }, { status: 400 });
      }
    }

    if (type === "video") {
      if (!mimeType || !ALLOWED_VIDEO_TYPES.includes(mimeType)) {
        return NextResponse.json({ error: "Invalid video format. Use MP4, MOV, or WebM." }, { status: 400 });
      }
      if (fileSize > MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json({ error: "Video must be under 50 MB." }, { status: 400 });
      }
      if (durationSeconds && durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
        return NextResponse.json({ error: "Video must be 90 seconds or shorter." }, { status: 400 });
      }
    }

    // For photo/video: generate a signed upload URL
    if (type === "photo" || type === "video") {
      const supabase = createServerClient();
      const ext = fileName?.split(".").pop() || (type === "photo" ? "jpg" : "mp4");
      const path = `${type}s/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data: signedData, error: signedError } = await supabase.storage
        .from("media")
        .createSignedUploadUrl(path);

      if (signedError || !signedData) {
        console.error("Signed URL error:", signedError);
        return NextResponse.json({ error: "Failed to prepare upload." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        uploadUrl: signedData.signedUrl,
        uploadToken: signedData.token,
        assetPath: path,
      });
    }

    return NextResponse.json({ error: "Invalid contribution type." }, { status: 400 });
  } catch (err) {
    console.error("Tribute API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
