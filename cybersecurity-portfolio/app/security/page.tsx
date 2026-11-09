import type { Metadata } from 'next';
import Link from 'next/link';
import { SecurityArchDiagram } from '@/components/Diagrams';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'How This Portfolio Is Secured',
  description:
    'A public case study in application security: threat model, defense in depth, secure headers, input validation, rate limiting, and responsible disclosure.',
  alternates: { canonical: '/security' },
};

const layers = [
  {
    n: 'Layer 1 — Edge',
    title: 'Cloud / network edge',
    items: ['TLS everywhere (HSTS, preload-ready)', 'WAF + DDoS absorption at the CDN', 'Bot controls and edge rate limits'],
  },
  {
    n: 'Layer 2 — Application',
    title: 'Application',
    items: ['CSP: per-request script nonces; untrusted inline scripts and event handlers blocked', 'Secure headers on every route', 'Validated rendering — React escaping + schema checks'],
  },
  {
    n: 'Layer 3 — API',
    title: 'API',
    items: ['Zod schema validation, server-authoritative', 'Rate limits + 10 KB request caps', 'Safe errors: no stack traces, paths, or internals'],
  },
  {
    n: 'Layer 4 — Data',
    title: 'Data',
    items: ['Minimal collection: contact fields only', 'No database of visitors; no tracking profiles', 'Secrets server-side only, never NEXT_PUBLIC_'],
  },
  {
    n: 'Layer 5 — Development',
    title: 'Development',
    items: ['Secret scanning in CI + pre-push', 'Dependency audit on every build', 'CodeQL SAST + Dependabot updates'],
  },
  {
    n: 'Layer 6 — Operations',
    title: 'Operations',
    items: ['Metadata-only audit logging (no bodies/secrets)', 'Abuse logging for rate limits + honeypot trips', 'Documented disclosure + incident path'],
  },
];

const threats = [
  'Automated scanners & bots',
  'Credential stuffing / brute force',
  'Cross-site scripting (XSS)',
  'CSRF on state-changing routes',
  'Injection (NoSQL, command, path)',
  'SSRF via fetched URLs',
  'Malicious uploads',
  'API abuse & spam',
  'Scraping & enumeration',
  'DDoS / resource exhaustion',
  'Dependency vulnerabilities',
  'Supply-chain attacks',
  'Credential compromise',
  'Configuration errors',
];

export default function SecurityPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Security</p>
        <p className="eyebrow">Case study</p>
        <h1>How this portfolio is secured.</h1>
        <p className="lede">
          This page is part of the portfolio&apos;s evidence: a public threat model
          and control set for the site you&apos;re reading. No site is unhackable —
          but every layer here exists for a named threat, and the code is built so
          you (or a reviewer) can verify each claim.
        </p>
      </div>

      <section aria-labelledby="arch-h">
        <div className="container">
          <h2 className="h2" id="arch-h">Architecture</h2>
          <p className="lede" style={{ marginBottom: '1.5rem' }}>
            Traffic flows through independent layers; each assumes the one above it
            can fail. Controls are simple and strong — no security theater.
          </p>
          <SecurityArchDiagram />
        </div>
      </section>

      <section className="section-alt" aria-labelledby="threat-h">
        <div className="container">
          <h2 className="h2" id="threat-h">Threat model</h2>
          <p className="lede" style={{ marginBottom: '1.5rem' }}>
            Realistic internet threats for a public portfolio with a contact form.
            Controls target <strong>behavior and technique</strong> — never origin,
            nationality, or identity.
          </p>
          <div className="tag-row">
            {threats.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="note-box">
            <strong>Out of scope by design:</strong> there is no user authentication,
            no file upload, no admin panel, and no database of visitors — the
            highest-risk features were removed rather than secured, because a
            portfolio doesn&apos;t need them. The smallest attack surface is the one
            you never build.
          </div>
        </div>
      </section>

      <section aria-labelledby="defense-h">
        <div className="container">
          <h2 className="h2" id="defense-h">Defense in depth</h2>
          <p className="lede" style={{ marginBottom: '1.5rem' }}>
            Six layers, each independently valuable. A failure in any single layer
            degrades gracefully instead of collapsing the whole posture.
          </p>
          <div className="phil-grid">
            {layers.map((l) => (
              <div key={l.n} className="phil">
                <span className="step">{l.n}</span>
                <h3>{l.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {l.items.map((i) => (
                    <li key={i} style={{ fontSize: '0.86rem', color: 'var(--text-muted)', paddingLeft: '1.1rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--ok)' }}>✓</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="headers-h">
        <div className="container two-col">
          <div>
            <h2 className="h2" id="headers-h">Headers &amp; hardening specifics</h2>
            <div className="prose">
              <ul>
                <li><strong>CSP:</strong> each HTML response receives a cryptographically random script nonce; production script-src has no unsafe-inline or unsafe-eval, and script event handlers are blocked. HTML is dynamic and no-store so the nonce cannot be reused from a cached page. Existing React style attributes remain temporarily permitted through style-src-attr unsafe-inline; stylesheet elements remain restricted to approved origins.</li>
                <li><strong>HSTS:</strong> long max-age with subdomains; preload-ready for the production domain.</li>
                <li><strong>Framing:</strong> X-Frame-Options DENY plus CSP frame-ancestors — no clickjacking host.</li>
                <li><strong>Contact API:</strong> JSON-only, 10 KB cap, Zod validation, honeypot, 5/hour/IP rate limit with Retry-After.</li>
                <li><strong>Errors:</strong> generic messages only; request IDs for correlation without leaking internals.</li>
                <li><strong>CI:</strong> typecheck, tests, npm audit, secret scan, and production build on every push.</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="h2">Reviewed against</h2>
            <div className="prose">
              <ul>
                <li>OWASP Top 10 (injection, XSS, misconfig, vulnerable components, logging failures)</li>
                <li>API abuse: validation, limits, method allow-listing</li>
                <li>Information disclosure: error paths, headers, verbose failures</li>
                <li>Dependency risk: audit + Dependabot + lockfile discipline</li>
                <li>Secret hygiene: .env.example shape-only, .env never committed</li>
              </ul>
            </div>
            <div className="btn-row">
              <Link className="btn btn-ghost" href="/disclosure">Disclosure policy →</Link>
              {site.github ? (
                <a className="btn btn-ghost" href={site.github} target="_blank" rel="noopener noreferrer">Inspect the code ↗</a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
