import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Toggle is_pinned on a contribution */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { is_pinned } = body;

    if (typeof is_pinned !== "boolean") {
      return NextResponse.json({ error: "is_pinned must be a boolean." }, { status: 400 });
    }

    const supabase = createServerClient();

    if (is_pinned) {
      // Find max pin_order among currently-pinned tributes
      const { data: maxRow } = await supabase
        .from("contributions")
        .select("pin_order")
        .eq("is_pinned", true)
        .order("pin_order", { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (maxRow?.pin_order ?? -1) + 1;

      const { error } = await supabase
        .from("contributions")
        .update({ is_pinned: true, pin_order: nextOrder })
        .eq("id", id);

      if (error) {
        console.error("Pin error:", error);
        return NextResponse.json({ error: "Failed to pin tribute." }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("contributions")
        .update({ is_pinned: false, pin_order: null })
        .eq("id", id);

      if (error) {
        console.error("Unpin error:", error);
        return NextResponse.json({ error: "Failed to unpin tribute." }, { status: 500 });
      }
    }

    revalidatePath("/tributes");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pin API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
