import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Batch-update pin_order for pinned tributes after drag-and-drop reorder */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds must be a non-empty array." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Update pin_order for each ID to match its position in the array
    const updates = orderedIds.map((id: string, index: number) =>
      supabase
        .from("contributions")
        .update({ pin_order: index })
        .eq("id", id)
        .eq("is_pinned", true)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) {
      console.error("Pin order update error:", failed.error);
      return NextResponse.json(
        { error: "Failed to update pin order." },
        { status: 500 }
      );
    }

    revalidatePath("/tributes");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Pin order API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
