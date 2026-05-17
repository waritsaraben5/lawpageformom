/** Redirect URL for Supabase password recovery (admin only). */
export function getAdminPasswordResetRedirectUrl(): string {
  const next = encodeURIComponent("/admin/reset-password");
  return `${window.location.origin}/auth/callback?next=${next}`;
}
