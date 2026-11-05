import Link from 'next/link';
import HeroNetwork from '@/components/HeroNetwork';
import SocPipeline from '@/components/SocPipeline';
import { ProjectCard, ArticleCard } from '@/components/Cards';
import Philosophy from '@/components/Philosophy';
import CurrentFocus from '@/components/CurrentFocus';
import { featuredProjects } from '@/content/projects';
import { articles } from '@/content/articles';
import { site } from '@/content/site';

const services = [
  ['SIEM & Wazuh', 'Scoped setup, onboarding support, alert-rule tuning and documentation for environments you are authorized to manage.'],
  ['Linux security review', 'Configuration-focused review of access, patching, SSH, firewall and logging controls with practical findings.'],
  ['Network security review', 'Authorized review of network exposure, segmentation, DNS, firewall posture and actionable next steps.'],
  ['Python log automation', 'Small, maintainable utilities for parsing, normalizing and reporting on security-relevant logs.'],
  ['Incident triage support', 'Evidence-led triage support and clear incident notes, timelines and handover documentation.'],
];

export default function Home() {
  const featured = featuredProjects();
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3);

  return (
    <>
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-kicker">CYBERSECURITY SERVICES</span>
            <h1>
              {site.name}
              <br />
              <span className="thin">Practical security, clearly scoped.</span>
            </h1>
            <p className="hero-sub">
              <strong>Stronger systems. Clearer visibility. Actionable security.</strong>{' '}
              VYRA helps businesses strengthen Linux systems, improve security monitoring and automate log analysis, with practical findings and clear documentation.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/services">View services</Link>
              <Link className="btn btn-ghost" href="/contact">Discuss a scope</Link>
            </div>
            <div className="hero-meta" aria-label="Service areas">
              {['SIEM / Wazuh', 'Linux security', 'Network review', 'Python automation', 'Incident triage'].map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          </div>
          <CurrentFocus />
        </div>
        <div className="container" style={{ marginTop: '3rem', position: 'relative' }}>
          <div className="diagram reveal" style={{ background: 'rgba(14,21,31,0.6)' }}>
            <HeroNetwork />
            <p className="hero-viz-caption" style={{ marginTop: '0.5rem' }}>
              Illustrative topology — a visual explanation of service areas, not live telemetry or client infrastructure.
            </p>
          </div>
        </div>
      </div>

      <section aria-labelledby="services-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Services</p>
            <h2 className="h2" id="services-h">Focused help where it matters</h2>
            <p className="lede">
              Choose focused support for your infrastructure and security operations. Each engagement starts with agreed objectives, authorized access and clear deliverables.
            </p>
          </div>
          <div className="card-grid">
            {services.map(([title, body]) => (
              <article className="card reveal" key={title}>
                <p className="eyebrow">VYRA SERVICE</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="btn-row reveal">
            <Link className="btn btn-primary" href="/services">Explore service scope →</Link>
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="process-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Process</p>
            <h2 className="h2" id="process-h">A clear security workflow</h2>
            <p className="lede">
              Define the authorized scope, understand the environment, review evidence, document findings and agree practical next actions. The operational loop below illustrates that approach.
            </p>
          </div>
          <SocPipeline />
        </div>
      </section>

      <section aria-labelledby="work-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Technical work</p>
            <h2 className="h2" id="work-h">Methods and implementation notes</h2>
            <p className="lede">
              Public technical material explains the approaches and tooling behind VYRA&apos;s service areas. It is reference material, not a claim of work performed for a client.
            </p>
          </div>
          <div className="card-grid">
            {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
          <div className="btn-row reveal">
            <Link className="btn btn-ghost" href="/projects">View technical work →</Link>
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="phil-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Principles</p>
            <h2 className="h2" id="phil-h">How VYRA approaches security work</h2>
            <p className="lede">A documented, authorization-first process designed to make technical decisions easier to review and act on.</p>
          </div>
          <Philosophy />
        </div>
      </section>

      <section aria-labelledby="know-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Knowledge base</p>
            <h2 className="h2" id="know-h">Practical security guidance</h2>
            <p className="lede">Notes on threat modeling, hardening, SIEM tuning and safe automation, written to support better security decisions.</p>
          </div>
          <div className="card-grid">
            {featuredArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
          <div className="btn-row reveal">
            <Link className="btn btn-ghost" href="/knowledge">Browse guidance →</Link>
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="cta-h">
        <div className="container two-col">
          <div className="reveal">
            <p className="eyebrow">Trust</p>
            <h2 className="h2" id="cta-h">Security-minded by design</h2>
            <p className="lede">This site uses a strict content security policy, validated inputs, rate-limited APIs and a public disclosure policy. Security controls and limitations are documented openly.</p>
            <div className="btn-row"><Link className="btn btn-ghost" href="/security">How this site is secured →</Link></div>
          </div>
          <div className="reveal">
            <p className="eyebrow">Start with scope</p>
            <h2 className="h2">Discuss the work</h2>
            <p className="lede" style={{ marginBottom: '1.25rem' }}>Describe the system, objective and authorization you have. VYRA will use that context to determine whether the requested work is an appropriate fit.</p>
            <div className="btn-row"><Link className="btn btn-primary" href="/contact">Contact VYRA</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
