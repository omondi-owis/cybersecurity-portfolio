import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description: 'VYRA offers scoped, authorized cybersecurity services for SIEM and Wazuh, Linux security, network review, Python log automation and incident triage documentation.',
  alternates: { canonical: '/services' },
};

const services = [
  {
    title: 'SIEM & Wazuh setup and tuning',
    scope: 'Assist with a scoped Wazuh or SIEM deployment, agent onboarding, data-source review, alert-rule tuning and clear operational documentation.',
    output: 'A documented implementation or review with prioritized tuning and operating recommendations.',
  },
  {
    title: 'Linux security configuration review',
    scope: 'Review agreed Linux hosts for access controls, SSH posture, patching, firewall configuration, logging and service exposure.',
    output: 'A practical findings summary with recommended remediation steps for the reviewed scope.',
  },
  {
    title: 'Network security review',
    scope: 'Review authorized network exposure, segmentation, DNS, firewall posture and discovered security-relevant configuration issues.',
    output: 'A scoped review summary and prioritized next actions. No testing takes place without explicit authorization.',
  },
  {
    title: 'Python log automation',
    scope: 'Design or improve focused Python utilities for parsing, normalizing, filtering or reporting on security-relevant log data.',
    output: 'Maintainable code and usage documentation appropriate to the agreed task.',
  },
  {
    title: 'Incident triage support & documentation',
    scope: 'Help organize available evidence, create a timeline, document triage observations and prepare a clear handover or incident record.',
    output: 'Structured documentation that supports your internal decision-making; VYRA does not promise emergency or 24/7 response.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Services</p>
        <p className="eyebrow">VYRA SERVICES</p>
        <h1>Practical cybersecurity support, clearly scoped.</h1>
        <p className="lede">VYRA offers focused support for teams and system owners who need a defined security task assessed, configured, documented or improved. Services are offered subject to fit, scope and written authorization.</p>
      </div>

      <section aria-labelledby="services-list">
        <div className="container">
          <div className="card-grid">
            {services.map((service) => (
              <article className="card reveal" key={service.title}>
                <p className="eyebrow">SCOPED SERVICE</p>
                <h2 style={{ fontSize: '1.2rem' }}>{service.title}</h2>
                <p><strong>Scope:</strong> {service.scope}</p>
                <p><strong>Typical output:</strong> {service.output}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="boundaries-h">
        <div className="container two-col">
          <div className="reveal">
            <p className="eyebrow">Authorization first</p>
            <h2 className="h2" id="boundaries-h">Work only within an agreed boundary</h2>
            <div className="prose">
              <p>Before technical work begins, the system owner and VYRA should agree the systems in scope, permitted activities, access method, intended outcome and point of contact.</p>
              <p>VYRA does not perform unauthorized testing, access systems without permission, represent itself as a managed SOC, or guarantee that a review will identify every issue.</p>
            </div>
          </div>
          <div className="reveal side-card">
            <h2>What to include in an enquiry</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
              <li>The system or environment you own or are authorized to manage</li>
              <li>The outcome you need and any relevant deadline</li>
              <li>Your current tooling and available access</li>
              <li>Any sensitivity, change-control or documentation requirements</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-h">
        <div className="container container-narrow">
          <p className="eyebrow">Next step</p>
          <h2 className="h2" id="cta-h">Start with the context.</h2>
          <p className="lede">A short description of the authorized scope is enough to begin a useful conversation. If the work is not a fit, VYRA will not overstate what can be provided.</p>
          <div className="btn-row"><Link className="btn btn-primary" href="/contact">Discuss a service</Link></div>
        </div>
      </section>
    </>
  );
}
