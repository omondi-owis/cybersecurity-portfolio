import type { Metadata } from 'next';
import Link from 'next/link';
import CurrentFocus from '@/components/CurrentFocus';
import Timeline from '@/components/Timeline';

export const metadata: Metadata = {
  title: 'About VYRA',
  description: 'About VYRA: a cybersecurity services practice focused on authorized, scoped security work and clear technical documentation.',
  alternates: { canonical: '/about' },
};

const areas = ['SIEM / Wazuh', 'Linux hardening', 'Network security', 'Log analysis', 'Python automation', 'Incident documentation'];

export default function AboutPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / About</p>
        <p className="eyebrow">ABOUT VYRA</p>
        <h1>Cybersecurity work with a clear scope and a practical output.</h1>
        <p className="lede">VYRA is a service-led cybersecurity practice for focused work on security monitoring, system configuration, network exposure, log automation and incident documentation. The emphasis is on authorized access, defined boundaries and useful handover material.</p>
      </div>

      <section aria-labelledby="approach-h">
        <div className="container two-col">
          <div>
            <h2 className="h2" id="approach-h">A straightforward engagement approach</h2>
            <div className="prose">
              <p>Security work is most useful when everyone agrees what is being reviewed, why it matters and what actions are permitted. VYRA starts there: establish scope, understand the environment and document what is observed.</p>
              <p>The work is designed around practical deliverables: configuration observations, prioritized recommendations, tuning notes, automation utilities or evidence-ready incident documentation.</p>
              <p>VYRA does not invent credentials, client stories, certifications or outcomes. It does not claim a 24/7 SOC, managed detection service, company registration or guaranteed security results.</p>
            </div>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/services">Explore services</Link>
              <Link className="btn btn-ghost" href="/contact">Discuss a scope</Link>
            </div>
          </div>
          <div>
            <CurrentFocus />
            <div className="side-card" style={{ marginTop: '1rem' }}>
              <h2>Service areas</h2>
              <div className="tag-row">{areas.map((area) => <span key={area} className="tag">{area}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="capabilities-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Capability map</p>
            <h2 className="h2" id="capabilities-h">Technical areas VYRA draws on</h2>
            <p className="lede">These areas describe the technical foundations relevant to VYRA&apos;s services, not a record of client engagements or a promise that every capability fits every request.</p>
          </div>
          <Timeline />
        </div>
      </section>

      <section aria-labelledby="boundaries-h">
        <div className="container container-narrow">
          <p className="eyebrow">Working boundaries</p>
          <h2 className="h2" id="boundaries-h">Authorization is not optional.</h2>
          <div className="prose">
            <p>VYRA works only on systems the requester owns or is explicitly authorized to manage. Any review or testing is limited to the agreed environment and approved activities.</p>
            <p>Recommendations support decisions; responsibility for production changes, approvals and operational response remains with the system owner unless a different written scope is agreed.</p>
          </div>
          <div className="btn-row"><Link className="btn btn-ghost" href="/security">How this site is secured →</Link><Link className="btn btn-ghost" href="/contact">Contact VYRA →</Link></div>
        </div>
      </section>
    </>
  );
}
