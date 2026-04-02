import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/** Admin: delete a contribution + its stored file */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Fetch the record first so we can delete the file
    const { data: record, error: fetchError } = await supabase
      .from("contributions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
    }

    // Delete the stored file if it exists
    if (record.asset_path) {
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([record.asset_path]);
      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }

    // Mark as deleted (soft delete) so it disappears from public pages immediately
    const { error: updateError } = await supabase
      .from("contributions")
      .update({ is_deleted: true })
      .eq("id", id);

    if (updateError) {
      console.error("Delete update error:", updateError);
      return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
