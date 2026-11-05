/**
 * OWNER CONFIGURATION — single source of truth for identity & links.
 *
 * Values come from environment variables so no personal URL is hardcoded.
 * NEVER invent values here. Leave empty ("") when unknown — the UI hides
 * unavailable links gracefully instead of rendering dead links.
 *
 * Configure via `.env` (see `.env.example`).
 */

function env(key: string): string {
  return (process.env[key] ?? '').trim();
}

/** Public env is inlined at build time; server env stays server-side. */
export const site = {
  name: env('NEXT_PUBLIC_OWNER_NAME') || 'Omondi Raphael Owino',
  firstName: 'Raphael',
  title: env('NEXT_PUBLIC_OWNER_TITLE') || 'Cybersecurity & Network Security Engineer',
  siteUrl: env('NEXT_PUBLIC_SITE_URL') || 'https://cybersecurity-portfolio-zp1e.vercel.app',
  tagline: 'Building secure systems.',
  subTagline:
    'Learning through real infrastructure, security engineering and experimentation.',

  bio: 'I build and study secure systems through practical infrastructure, network security, monitoring, automation, and defensive experimentation.',

  // Contact — empty string = not configured = hidden in UI.
  email: env('CONTACT_EMAIL'),
  github: env('NEXT_PUBLIC_GITHUB_URL'),
  linkedin: env('NEXT_PUBLIC_LINKEDIN_URL'),
  instagram: env('NEXT_PUBLIC_INSTAGRAM_URL'),
  youtube: env('NEXT_PUBLIC_YOUTUBE_URL'),
  tiktok: env('NEXT_PUBLIC_TIKTOK_URL'),
  whatsapp: env('NEXT_PUBLIC_WHATSAPP_URL'),
  cvUrl: env('NEXT_PUBLIC_CV_URL'),
} as const;

export type SiteConfig = typeof site;

/** Social links that are actually configured (for footer / contact). */
export function configuredSocials(): Array<{
  key: 'github' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok' | 'whatsapp';
  label: string;
  href: string;
}> {
  const all = [
    { key: 'github' as const, label: 'GitHub', href: site.github },
    { key: 'linkedin' as const, label: 'LinkedIn', href: site.linkedin },
    { key: 'instagram' as const, label: 'Instagram', href: site.instagram },
    { key: 'youtube' as const, label: 'YouTube', href: site.youtube },
    { key: 'tiktok' as const, label: 'TikTok', href: site.tiktok },
    { key: 'whatsapp' as const, label: 'WhatsApp', href: site.whatsapp },
  ];
  return all.filter((s) => s.href.length > 0);
}

/** Very small URL allowlist check for configured links (https only). */
export function isSafeExternalUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'mailto:';
  } catch {
    return false;
  }
}
