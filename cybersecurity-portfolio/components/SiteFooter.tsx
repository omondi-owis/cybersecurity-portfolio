import Link from 'next/link';
import { configuredSocials, site } from '@/content/site';

export default function SiteFooter() {
  const socials = configuredSocials();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="brand" aria-label="VYRA — home"><span className="brand-mark" aria-hidden="true">VY</span><span>VYRA<small>CYBERSECURITY SERVICES</small></span></Link>
            <p>{site.tagline} Authorized, scoped support for security monitoring, hardening, review and documentation.</p>
          </div>
          <nav aria-label="Explore"><h2>Explore</h2><ul><li><Link href="/services">Services</Link></li><li><Link href="/projects">Technical work</Link></li><li><Link href="/knowledge">Knowledge base</Link></li><li><Link href="/about">About VYRA</Link></li></ul></nav>
          <nav aria-label="Trust"><h2>Trust</h2><ul><li><Link href="/security">How this site is secured</Link></li><li><Link href="/disclosure">Security disclosure</Link></li><li><Link href="/privacy">Privacy</Link></li><li><Link href="/resume">Capabilities</Link></li></ul></nav>
          <nav aria-label="Contact"><h2>Contact</h2><ul><li><Link href="/contact">Service enquiry</Link></li>{socials.map((s) => <li key={s.key}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}<li><Link href="/contact">Contact VYRA</Link></li></ul></nav>
        </div>
        <div className="foot-bottom"><span>© {year} {site.name}. All rights reserved.</span><span>Scoped work • Clear documentation • No trackers</span></div>
      </div>
    </footer>
  );
}
