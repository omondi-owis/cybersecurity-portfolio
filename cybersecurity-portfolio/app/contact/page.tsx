import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Omondi Raphael Owino: email, GitHub, LinkedIn, and a secure contact form. Serious inquiries get serious replies.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Contact</p>
        <p className="eyebrow">Let&apos;s connect</p>
        <h1>Start a conversation.</h1>
        <p className="lede">
          Internships, junior SOC and security roles, collaborations, lab feedback,
          or corrections to the knowledge base. Only real, configured channels are
          listed — nothing here is a dead link.
        </p>
      </div>

      <section aria-label="Contact options">
        <div className="container two-col">
          <div>
            <h2 className="h2" style={{ fontSize: '1.3rem' }}>Direct channels</h2>
            <div style={{ margin: '1rem 0 1.5rem' }}>
              <SocialLinks />
            </div>
            {site.email ? (
              <div className="side-card">
                <h2>Professional email</h2>
                <p style={{ fontSize: '0.95rem' }}>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <p className="form-note" style={{ marginTop: '0.5rem' }}>
                  For vulnerability reports, please read the{' '}
                  <Link href="/disclosure">disclosure policy</Link> first.
                </p>
              </div>
            ) : (
              <div className="note-box">
                <strong>Use the contact form to reach me.</strong> Your email address is used
                only to reply. If sending is temporarily unavailable, the form will
                say so and keep your message so you can retry or use a listed direct channel.
              </div>
            )}
            <div className="side-card" style={{ marginTop: '1rem' }}>
              <h2>What gets a fast reply</h2>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
                <li>Specific roles or opportunities with details</li>
                <li>Technical questions about a named project or lab</li>
                <li>Corrections with evidence (thank you in advance)</li>
                <li>Collaboration proposals with a clear scope</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="h2" style={{ fontSize: '1.3rem' }}>Send a message</h2>
            <div style={{ marginTop: '1rem' }}>
              <ContactForm directEmail={site.email} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
