import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

// IMPORTANT: Add https://laitan50.com/auth/callback to Supabase Dashboard →
// Authentication → URL Configuration → Redirect URLs

const CALLBACK_URL = "https://laitan50.com/auth/callback?next=/admin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const supabase = createServerClient();

    // 1. Check admin_requests for an approved row
    const { data: request } = await supabase
      .from("admin_requests")
      .select("requester_email")
      .eq("requester_email", trimmedEmail)
      .eq("status", "approved")
      .single();

    // 2. If not found in admin_requests, check if user exists in Supabase Auth
    //    (handles users approved before the admin_requests system was in place)
    let approvedEmail = request?.requester_email;

    if (!approvedEmail) {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existingUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase() === trimmedEmail
      );
      if (existingUser) {
        approvedEmail = existingUser.email!;
      }
    }

    if (!approvedEmail) {
      return NextResponse.json(
        { error: "No approved access found for this email. Please request access first." },
        { status: 403 }
      );
    }

    // Generate a fresh magic link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: approvedEmail,
      options: {
        redirectTo: CALLBACK_URL,
      },
    });

    if (linkError || !linkData) {
      console.error("Magic link generation error:", linkError);
      return NextResponse.json({ error: "Failed to generate login link." }, { status: 500 });
    }

    // Send the magic link via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const magicLink = linkData.properties?.action_link;

    await resend.emails.send({
      from: "Birthday Website <noreply@laitan50.com>",
      to: approvedEmail,
      subject: "Your Login Link — Birthday Website Admin",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4A1D6A;">Welcome Back! 🎉</h2>
          <p>Here's your login link for the Birthday Website admin dashboard.</p>
          <div style="margin: 24px 0;">
            <a href="${magicLink}" style="display: inline-block; padding: 14px 32px; background: #D4A843; color: #2D0D45; font-weight: 600; text-decoration: none; border-radius: 999px;">Sign In to Dashboard →</a>
          </div>
          <p style="color: #888; font-size: 12px;">This link is single-use and expires shortly.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Login link sent! Check your email." });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
