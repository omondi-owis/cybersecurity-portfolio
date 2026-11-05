import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact VYRA about a scoped, authorized cybersecurity service request.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Contact</p>
        <p className="eyebrow">CONTACT VYRA</p>
        <h1>Start with the scope.</h1>
        <p className="lede">Tell VYRA what you are authorized to manage, the security outcome you need and any relevant constraints. The contact form is the public channel for service enquiries.</p>
      </div>
      <section aria-label="Contact options">
        <div className="container two-col">
          <div>
            <h2 className="h2" style={{ fontSize: '1.3rem' }}>Before you send</h2>
            <div className="side-card" style={{ marginTop: '1rem' }}>
              <h2>Useful enquiry details</h2>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
                <li>The system or environment in scope</li>
                <li>Your authorization to request the work</li>
                <li>The objective and desired deliverable</li>
                <li>Relevant tools, access limitations or deadlines</li>
              </ul>
            </div>
            <div className="note-box" style={{ marginTop: '1rem' }}>
              <strong>Authorized work only.</strong> Do not send credentials or sensitive secrets through this form. VYRA does not provide emergency or 24/7 response services.
            </div>
            <p className="form-note" style={{ marginTop: '1rem' }}>To report a vulnerability in this website, please use the <Link href="/disclosure">security disclosure policy</Link>.</p>
          </div>
          <div>
            <h2 className="h2" style={{ fontSize: '1.3rem' }}>Send an enquiry</h2>
            <div style={{ marginTop: '1rem' }}><ContactForm directEmail="" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
