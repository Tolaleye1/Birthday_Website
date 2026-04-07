import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// IMPORTANT: Add https://laitan50.com/auth/callback to Supabase Dashboard →
// Authentication → URL Configuration → Redirect URLs

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/admin";

  const response = NextResponse.redirect(new URL(nextPath, req.url));

  if (code) {
    const cookieStore = await cookies();

    const supabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // If no code or exchange failed, redirect to admin with error
  return NextResponse.redirect(new URL("/admin", req.url));
}
