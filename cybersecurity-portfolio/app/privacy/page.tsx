import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Privacy policy: what this portfolio collects (almost nothing), why, and your rights.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Privacy</p>
        <p className="eyebrow">Privacy</p>
        <h1>Almost nothing is collected. Here&apos;s the list.</h1>
      </div>
      <section aria-label="Privacy policy">
        <div className="container prose">
          <p><em>Last updated: September 2026.</em></p>

          <h2>Summary</h2>
          <p>
            This portfolio has no accounts, no analytics trackers, no advertising,
            and no third-party scripts. The only personal data that reaches the
            server is what you deliberately submit through the contact form —
            and abuse-prevention metadata (rate-limit counters) that cannot
            identify you beyond your network address.
          </p>

          <h2>What is collected</h2>
          <ul>
            <li><strong>Contact form:</strong> name, email, subject and message — used solely to read and reply. When the optional enquiry system is enabled, submissions are stored in a private database before delivery is attempted; delivery failure does not discard a stored enquiry. New or closed enquiries are retained for no more than 90 days unless reviewed. You can request deletion.</li>
            <li><strong>Abuse prevention:</strong> rate-limit counters keyed by network address, plus metadata-only security logs (timestamps, counters, request IDs). Message bodies and full addresses are never written to these logs.</li>
            <li><strong>Theme preference:</strong> stored in your own browser&apos;s localStorage only. It never leaves your device.</li>
          </ul>

          <h2>What is NOT collected</h2>
          <ul>
            <li>No analytics, fingerprints, or cross-site tracking.</li>
            <li>No cookies other than those strictly required by the hosting platform (if any).</li>
            <li>No visitor database, no marketing lists, no data sales — there is nothing to sell.</li>
          </ul>

          <h2>Fonts</h2>
          <p>
            Pages load font stylesheets from Google Fonts (fonts.googleapis.com /
            fonts.gstatic.com). Your browser requests those files directly; referrer
            information is minimized via Referrer-Policy. If you prefer zero
            third-party requests, the site remains fully usable with fonts blocked —
            system fallbacks apply automatically.
          </p>

          <h2>Your rights</h2>
          <p>
            If you submitted the contact form and want your message deleted, request
            deletion via the <Link href="/contact">contact page</Link> from the same
            email address. Approved deletion removes the stored enquiry; backup retention is governed by the hosting provider&apos;s normal backup lifecycle.
          </p>

          <h2>Changes</h2>
          <p>
            If analytics or additional processing is ever added, this page will be
            updated first — with what, why, and how to opt out. No silent expansion.
          </p>
        </div>
      </section>
    </>
  );
}
