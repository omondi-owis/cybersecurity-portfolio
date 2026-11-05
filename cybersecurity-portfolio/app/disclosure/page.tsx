import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Security Disclosure',
  description:
    'Responsible vulnerability disclosure policy for the VYRA website, including scope and reporting expectations.',
  alternates: { canonical: '/disclosure' },
};

export default function DisclosurePage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Disclosure</p>
        <p className="eyebrow">Security disclosure</p>
        <h1>Found a vulnerability? Thank you.</h1>
        <p className="lede">
          Security researchers make this site better. This policy explains how to
          report issues responsibly — and commits to treating good-faith research
          with respect.
        </p>
      </div>
      <section aria-label="Disclosure policy">
        <div className="container prose">
          <h2>How to report</h2>
          {site.email ? (
            <p>
              Email <a href={`mailto:${site.email}?subject=${encodeURIComponent('[SECURITY] Vulnerability report')}`}>{site.email}</a> with
              the subject line <strong>[SECURITY]</strong>. PGP is not currently
              offered — please do not include sensitive personal data beyond what
              the report needs.
            </p>
          ) : (
            <p>
              Use the <Link href="/contact">contact form</Link> with the subject
              line starting with <strong>[SECURITY]</strong>. (Direct email is being
              set up; the form is monitored the same way.)
            </p>
          )}

          <h2>Please include</h2>
          <ul>
            <li>Description of the issue and its potential impact</li>
            <li>Steps to reproduce (URLs, payloads, configuration)</li>
            <li>Your assessment of severity, if you have one</li>
            <li>Whether the issue is already publicly known</li>
          </ul>

          <h2>Scope</h2>
          <ul>
            <li><strong>In scope:</strong> this portfolio website and its contact API — the code in the linked repository when published.</li>
            <li><strong>Out of scope:</strong> third-party services (hosting, CDN, fonts), the owner&apos;s private lab infrastructure, and any system not explicitly listed here. <strong>Do not test systems you do not own.</strong></li>
          </ul>

          <h2>Ground rules</h2>
          <ul>
            <li>Do not access, modify, or delete data beyond what is needed to demonstrate the issue.</li>
            <li>Do not degrade availability (no DoS testing) and do not spam the contact form.</li>
            <li>Do not publicly disclose before a fix is deployed and a reasonable coordination window has passed.</li>
            <li>Social engineering, physical attacks, and attacks on visitors are never in scope.</li>
          </ul>

          <h2>What to expect</h2>
          <ul>
            <li>Acknowledgement of your report as soon as reasonably possible.</li>
            <li>Triage, fix, and verification — with credit offered (name or handle, your choice) unless you prefer anonymity.</li>
            <li>No bounties are offered; this is a personal portfolio, not a bug-bounty program.</li>
          </ul>

          <div className="note-box">
            <strong>Good-faith commitment:</strong> research conducted within this
            policy, without harm to users or systems, will be treated as helpful —
            not hostile. If you&apos;re unsure whether something is in scope, ask
            first.
          </div>
        </div>
      </section>
    </>
  );
}
