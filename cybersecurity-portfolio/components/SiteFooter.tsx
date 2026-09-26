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
            <Link href="/" className="brand" aria-label="Raphael — home">
              <span className="brand-mark" aria-hidden="true">
                RO
              </span>
              <span>
                RAPHAEL.O<small>SEC • NET • ENG</small>
              </span>
            </Link>
            <p>
              {site.title}. Practical infrastructure, network security, monitoring and
              defensive experimentation — documented in the open.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/lab">Security Lab</Link></li>
              <li><Link href="/knowledge">Knowledge base</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </nav>

          <nav aria-label="Trust">
            <h2>Trust</h2>
            <ul>
              <li><Link href="/security">How this site is secured</Link></li>
              <li><Link href="/disclosure">Security disclosure</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/resume">Résumé / CV</Link></li>
            </ul>
          </nav>

          <nav aria-label="Connect">
            <h2>Connect</h2>
            <ul>
              {site.email ? (
                <li><a href={`mailto:${site.email}`}>Email</a></li>
              ) : (
                <li><Link href="/contact">Contact form</Link></li>
              )}
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
              <li><Link href="/contact">All contact options</Link></li>
            </ul>
          </nav>
        </div>

        <div className="foot-bottom">
          <span>© {year} {site.name}. All rights reserved.</span>
          <span>Built with intent • Secured by design • No trackers</span>
        </div>
      </div>
    </footer>
  );
}
