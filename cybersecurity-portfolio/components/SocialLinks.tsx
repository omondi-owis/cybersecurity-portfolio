import { configuredSocials, site, isSafeExternalUrl } from '@/content/site';

const icons: Record<string, string> = { github: '⬡', linkedin: 'in', instagram: '◉', youtube: '▶', tiktok: '♪', whatsapp: '✆' };

export default function SocialLinks() {
  const socials = configuredSocials().filter((s) => isSafeExternalUrl(s.href));
  if (socials.length === 0 && !site.email) return <p className="form-note">Public direct channels are not listed. Use the contact form to send a scoped service enquiry.</p>;
  return <div className="social-row">{site.email && <a className="social-btn" href={`mailto:${site.email}`}><span aria-hidden="true">✉</span> Email</a>}{socials.map((s) => <a key={s.key} className="social-btn" href={s.href} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">{icons[s.key] ?? '↗'}</span> {s.label}</a>)}</div>;
}
