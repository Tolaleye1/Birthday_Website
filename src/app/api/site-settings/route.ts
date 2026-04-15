import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const VALID_KEYS = ["tributes_visible", "photos_visible", "videos_visible"] as const;
type SettingKey = (typeof VALID_KEYS)[number];

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [...VALID_KEYS]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: Record<string, boolean> = {
      tributes_visible: false,
      photos_visible: false,
      videos_visible: false,
    };

    for (const row of data || []) {
      if (VALID_KEYS.includes(row.key as SettingKey)) {
        settings[row.key as string] = row.value === "true";
      }
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body as { key: string; value: boolean };

    if (!key || !VALID_KEYS.includes(key as SettingKey)) {
      return NextResponse.json(
        { error: `Invalid key. Must be one of: ${VALID_KEYS.join(", ")}` },
        { status: 400 }
      );
    }

    if (typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Value must be a boolean" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value: String(value), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key, value });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
