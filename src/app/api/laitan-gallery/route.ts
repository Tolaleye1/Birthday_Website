import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { ALLOWED_GALLERY_TYPES, MAX_PHOTO_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES, ALLOWED_PHOTO_TYPES } from "@/lib/types";

function isYearsScope(req: NextRequest) {
  return new URL(req.url).searchParams.get("scope") === "years";
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();

    if (isYearsScope(req)) {
      const { data, error } = await supabase
        .from("laitan_years_slots")
        .select("*")
        .order("position", { ascending: true });

      if (error) {
        console.error("Laitan years slots fetch error:", error);
        return NextResponse.json({ error: "Failed to load Laitan Over the Years slots." }, { status: 500 });
      }

      return NextResponse.json({ slots: data ?? [] });
    }

    const url = new URL(req.url);
    const galLimit = url.searchParams.get("limit");
    const galOffset = url.searchParams.get("offset");
    const parsedGalLimit = galLimit ? Number(galLimit) : null;
    const parsedGalOffset = galOffset ? Number(galOffset) : 0;

    let galQuery = supabase
      .from("laitan_gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (parsedGalLimit && Number.isFinite(parsedGalLimit) && parsedGalLimit > 0) {
      galQuery = galQuery.range(parsedGalOffset, parsedGalOffset + parsedGalLimit - 1);
    }

    const { data, error } = await galQuery;

    if (error) {
      console.error("Laitan gallery fetch error:", error);
      return NextResponse.json({ error: "Failed to load gallery items." }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err) {
    console.error("Laitan gallery GET error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/** Admin: upload a Laitan gallery item (photo or video) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, mimeType, fileSize, position } = body;

    const yearsScope = isYearsScope(req);
    const allowedTypes = yearsScope ? ALLOWED_PHOTO_TYPES : ALLOWED_GALLERY_TYPES;

    if (!mimeType || !allowedTypes.includes(mimeType)) {
      return NextResponse.json({
        error: yearsScope
          ? "Invalid image format. Use JPEG, PNG, WebP, or HEIC."
          : "Invalid file format. Accepted: JPEG, PNG, WebP, HEIC, MP4, MOV, WebM.",
      }, { status: 400 });
    }

    const isPhoto = ALLOWED_PHOTO_TYPES.includes(mimeType);
    const maxSize = isPhoto ? MAX_PHOTO_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    if (fileSize > maxSize) {
      return NextResponse.json({ error: `File must be under ${isPhoto ? "10" : "100"} MB.` }, { status: 400 });
    }

    const supabase = createServerClient();
    const ext = fileName?.split(".").pop() || "jpg";
    const path = yearsScope
      ? `laitan-years/slot-${position}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      : `laitan/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    if (yearsScope && (!Number.isInteger(position) || position < 1 || position > 6)) {
      return NextResponse.json({ error: "A slot position from 1 to 6 is required." }, { status: 400 });
    }

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
    const { assetPath, caption, mediaType, position } = body;

    if (!assetPath) {
      return NextResponse.json({ error: "Asset path required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(assetPath);

    if (isYearsScope(req)) {
      if (!Number.isInteger(position) || position < 1 || position > 6) {
        return NextResponse.json({ error: "A slot position from 1 to 6 is required." }, { status: 400 });
      }

      const { data: existing } = await supabase
        .from("laitan_years_slots")
        .select("asset_path")
        .eq("position", position)
        .maybeSingle();

      if (existing?.asset_path && existing.asset_path !== assetPath) {
        const { error: removeError } = await supabase.storage
          .from("media")
          .remove([existing.asset_path]);

        if (removeError) {
          console.error("Laitan years old asset cleanup error:", removeError);
        }
      }

      const { data, error } = await supabase
        .from("laitan_years_slots")
        .upsert(
          {
            position,
            asset_path: assetPath,
            asset_url: urlData.publicUrl,
            caption: caption || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "position" }
        )
        .select()
        .single();

      if (error) {
        console.error("Laitan years slot upsert error:", error);
        return NextResponse.json({ error: "Failed to save slot." }, { status: 500 });
      }

      return NextResponse.json({ success: true, slot: data }, { status: 201 });
    }

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

/** Admin: delete a Laitan gallery item and its stored file */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const position = Number(searchParams.get("position"));

    const supabase = createServerClient();

    if (searchParams.get("scope") === "years") {
      if (!Number.isInteger(position) || position < 1 || position > 6) {
        return NextResponse.json({ error: "A valid slot position is required." }, { status: 400 });
      }

      const { data: slot, error: slotError } = await supabase
        .from("laitan_years_slots")
        .select("*")
        .eq("position", position)
        .maybeSingle();

      if (slotError) {
        console.error("Laitan years slot fetch error:", slotError);
        return NextResponse.json({ error: "Failed to load slot." }, { status: 500 });
      }

      if (slot?.asset_path) {
        const { error: storageError } = await supabase.storage
          .from("media")
          .remove([slot.asset_path]);

        if (storageError) {
          console.error("Laitan years storage delete error:", storageError);
        }
      }

      const { error: deleteError } = await supabase
        .from("laitan_years_slots")
        .delete()
        .eq("position", position);

      if (deleteError) {
        console.error("Laitan years slot delete error:", deleteError);
        return NextResponse.json({ error: "Failed to clear slot." }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Item id is required." }, { status: 400 });
    }

    const { data: item, error: fetchError } = await supabase
      .from("laitan_gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !item) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    if (item.asset_path) {
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([item.asset_path]);

      if (storageError) {
        console.error("Laitan gallery storage delete error:", storageError);
      }
    }

    const { error: deleteError } = await supabase
      .from("laitan_gallery")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Laitan gallery delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Laitan gallery DELETE error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
