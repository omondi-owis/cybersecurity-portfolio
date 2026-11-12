/**
 * Public brand configuration. VYRA is deliberately hardcoded so legacy
 * environment variables cannot replace the public identity or links.
 */
export const site = {
  name: 'VYRA',
  firstName: 'VYRA',
  title: 'Cybersecurity Services',
  siteUrl: 'https://cybersecurity-portfolio-zp1e.vercel.app',
  tagline: 'Practical cybersecurity, clearly scoped.',
  subTagline:
    'Authorized security services for monitoring, hardening, review and documentation.',
  bio: 'VYRA offers scoped cybersecurity services for teams that need practical help strengthening systems, visibility and security operations.',

  // GitHub is public evidence; direct contact details remain unpublished.
  // The contact form keeps using its private server-side delivery variables.
  email: '',
  github: 'https://github.com/omondi-owis',
  linkedin: '',
  instagram: 'https://www.instagram.com/vyra_security/',
  youtube: '',
  tiktok: '',
  whatsapp: '',
  cvUrl: '',
} as const;

export type SiteConfig = typeof site;

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

export function isSafeExternalUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'mailto:';
  } catch {
    return false;
  }
}
