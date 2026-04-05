import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const ADMIN_NOTIFICATION_EMAIL = "olaleyetomisin15@gmail.com";
const SITE_URL = "https://laitanat50.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const supabase = createServerClient();

    // Check for existing pending request
    const { data: existing } = await supabase
      .from("admin_requests")
      .select("id")
      .eq("requester_email", email.trim().toLowerCase())
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, message: "Request already pending." });
    }

    // Insert new request
    const { data: request, error: insertError } = await supabase
      .from("admin_requests")
      .insert({ requester_email: email.trim().toLowerCase() })
      .select()
      .single();

    if (insertError || !request) {
      console.error("Admin request insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
    }

    // Send notification email to admin
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const approveUrl = `${SITE_URL}/api/admin-approve?token=${request.approval_token}&action=approve`;
      const rejectUrl = `${SITE_URL}/api/admin-approve?token=${request.approval_token}&action=reject`;

      await resend.emails.send({
        from: "Birthday Website <onboarding@resend.dev>",
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `Admin Access Request — ${email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #4A1D6A;">Admin Access Request</h2>
            <p><strong>${email}</strong> is requesting admin access to the Birthday Website dashboard.</p>
            <div style="margin: 24px 0;">
              <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background: #D4A843; color: #2D0D45; font-weight: 600; text-decoration: none; border-radius: 999px; margin-right: 12px;">✅ Approve</a>
              <a href="${rejectUrl}" style="display: inline-block; padding: 12px 24px; background: #e5e5e5; color: #333; font-weight: 600; text-decoration: none; border-radius: 999px;">❌ Reject</a>
            </div>
            <p style="color: #888; font-size: 12px;">This link expires when the request is processed.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "Access request submitted." });
  } catch (err) {
    console.error("Admin request error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
