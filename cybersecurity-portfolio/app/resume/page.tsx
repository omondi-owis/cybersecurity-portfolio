import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Capabilities',
  description: 'VYRA capability overview for scoped cybersecurity services and technical foundations.',
  alternates: { canonical: '/resume' },
};

const capabilities = [
  { group: 'Security monitoring', items: ['Wazuh / SIEM setup support', 'Alert-rule tuning', 'Telemetry review', 'Triage notes', 'Operational documentation'] },
  { group: 'Linux security', items: ['Ubuntu Server', 'SSH hardening', 'UFW', 'systemd', 'Logging', 'Configuration review'] },
  { group: 'Network review', items: ['TCP/IP', 'DNS / DHCP', 'Firewall posture', 'Segmentation', 'Wireshark', 'Authorized Nmap use'] },
  { group: 'Automation & documentation', items: ['Python log utilities', 'Audit logging', 'Runbooks', 'Incident timelines', 'Technical writing'] },
];

export default function ResumePage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Capabilities</p>
        <p className="eyebrow">VYRA CAPABILITIES</p>
        <h1>Technical foundations for scoped security work.</h1>
        <p className="lede">This page replaces the previous résumé route for visitors using an older link. It summarizes VYRA&apos;s service-relevant capabilities without presenting a personal CV or identity.</p>
        <div className="btn-row"><Link className="btn btn-primary" href="/services">View services</Link><Link className="btn btn-ghost" href="/contact">Discuss a scope</Link></div>
      </div>
      <section aria-label="Capability overview">
        <div className="container two-col">
          <div>
            <h2 className="h2" style={{ fontSize: '1.4rem' }}>How the capabilities are applied</h2>
            <div className="prose">
              <p>VYRA applies these capabilities to authorized, clearly defined tasks such as SIEM and Wazuh setup or tuning, Linux security configuration review, network security review, Python log automation and incident-triage documentation.</p>
              <p>Available services are not a claim of completed work for a client. Each request is considered against its scope, authorization, access requirements and intended output.</p>
            </div>
            <h2 className="h2" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Technical reference</h2>
            <div className="prose"><ul><li><Link href="/projects">Technical work</Link> — implementation notes and architecture references.</li><li><Link href="/knowledge">Knowledge base</Link> — practical guidance on hardening, SIEM tuning and automation.</li><li><Link href="/services">Services</Link> — engagement scope and boundaries.</li></ul></div>
          </div>
          <div>
            <h2 className="h2" style={{ fontSize: '1.4rem' }}>Capability areas</h2>
            {capabilities.map((group) => <div key={group.group} className="side-card" style={{ marginBottom: '0.9rem' }}><h2>{group.group}</h2><div className="tag-row">{group.items.map((item) => <span key={item} className="tag">{item}</span>)}</div></div>)}
            <div className="note-box"><strong>Clear limits, no inflated claims.</strong> VYRA does not publish fabricated clients, credentials, awards, guarantees or service levels.</div>
          </div>
        </div>
      </section>
    </>
  );
}
