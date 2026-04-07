import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Resend } from "resend";

function htmlPage(title: string, message: string) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#FFF8F0;}
    .card{max-width:400px;text-align:center;padding:40px;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    h1{color:#4A1D6A;font-size:1.5rem;margin-bottom:12px;}p{color:#666;}</style></head>
    <body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const action = searchParams.get("action");

  if (!token || !action || !["approve", "reject"].includes(action)) {
    return htmlPage("Invalid Request", "This link is invalid or expired.");
  }

  try {
    const supabase = createServerClient();

    // Find the pending request
    const { data: request, error: findError } = await supabase
      .from("admin_requests")
      .select("*")
      .eq("approval_token", token)
      .eq("status", "pending")
      .single();

    if (findError || !request) {
      return htmlPage("Already Processed", "This request has already been handled or the link has expired.");
    }

    const resendKey = process.env.RESEND_API_KEY;
    const resend = resendKey ? new Resend(resendKey) : null;

    if (action === "approve") {
      // Update status
      await supabase.from("admin_requests").update({ status: "approved" }).eq("id", request.id);

      // Generate magic link via Supabase Admin API
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: request.requester_email,
      });

      if (linkError || !linkData) {
        console.error("Magic link generation error:", linkError);
        return htmlPage("Error", "Failed to generate magic link. Please try again.");
      }

      // Send magic link email to requester
      if (resend) {
        const magicLink = linkData.properties?.action_link;
        await resend.emails.send({
          from: "Birthday Website <noreply@laitan50.com>",
          to: request.requester_email,
          subject: "Admin Access Approved — Birthday Website",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #4A1D6A;">Access Approved! 🎉</h2>
              <p>Your request for admin access to the Birthday Website has been approved.</p>
              <div style="margin: 24px 0;">
                <a href="${magicLink}" style="display: inline-block; padding: 14px 32px; background: #D4A843; color: #2D0D45; font-weight: 600; text-decoration: none; border-radius: 999px;">Sign In to Dashboard →</a>
              </div>
              <p style="color: #888; font-size: 12px;">This link is single-use and expires shortly.</p>
            </div>
          `,
        });
      }

      return htmlPage("Access Approved ✅", `Magic link sent to <strong>${request.requester_email}</strong>. They can now sign in.`);
    } else {
      // Reject
      await supabase.from("admin_requests").update({ status: "rejected" }).eq("id", request.id);

      // Send rejection email
      if (resend) {
        await resend.emails.send({
          from: "Birthday Website <noreply@laitan50.com>",
          to: request.requester_email,
          subject: "Admin Access Request — Birthday Website",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #4A1D6A;">Access Request Update</h2>
              <p>Your request for admin access to the Birthday Website dashboard was not approved at this time.</p>
              <p>If you believe this was a mistake, please contact the site administrator directly.</p>
            </div>
          `,
        });
      }

      return htmlPage("Request Rejected", `The admin access request from <strong>${request.requester_email}</strong> has been rejected.`);
    }
  } catch (err) {
    console.error("Admin approve error:", err);
    return htmlPage("Error", "Something went wrong. Please try again.");
  }
}
