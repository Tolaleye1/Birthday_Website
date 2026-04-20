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

/** Admin: update a text contribution's name and message */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { submitterName, message } = body as { submitterName?: string; message?: string };

    if (!submitterName?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verify the contribution exists and is a text tribute
    const { data: record, error: fetchError } = await supabase
      .from("contributions")
      .select("id, type")
      .eq("id", id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: "Contribution not found." }, { status: 404 });
    }

    if (record.type !== "text") {
      return NextResponse.json({ error: "Only text tributes can be edited." }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("contributions")
      .update({
        submitter_name: submitterName.trim(),
        message: message.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update tribute." }, { status: 500 });
    }

    return NextResponse.json({ success: true, contribution: updated });
  } catch (err) {
    console.error("PATCH tribute error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
