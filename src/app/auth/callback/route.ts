import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeAdminNext(next: string | null): string {
  if (next === "/admin/reset-password" || next === "/admin") {
    return next;
  }
  return "/admin/reset-password";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeAdminNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=auth_callback`
  );
}
