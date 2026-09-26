import Link from 'next/link';
import HeroNetwork from '@/components/HeroNetwork';
import SocPipeline from '@/components/SocPipeline';
import { ProjectCard, ArticleCard } from '@/components/Cards';
import Timeline from '@/components/Timeline';
import Philosophy from '@/components/Philosophy';
import CurrentFocus from '@/components/CurrentFocus';
import SocialLinks from '@/components/SocialLinks';
import { featuredProjects } from '@/content/projects';
import { articles } from '@/content/articles';
import { site } from '@/content/site';

export default function Home() {
  const featured = featuredProjects();
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3);

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-kicker">CYBERSECURITY / NETWORK SECURITY</span>
            <h1>
              {site.name}
              <br />
              <span className="thin">Building secure systems.</span>
            </h1>
            <p className="hero-sub">
              <strong>Learning through real infrastructure, security engineering and
              experimentation.</strong>{' '}
              I build defended systems, monitor them with a SIEM, test them in an
              isolated lab — and document everything so each experiment compounds.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/projects">Explore projects</Link>
              <Link className="btn btn-ghost" href="/lab">Security Lab</Link>
              {site.github ? (
                <a className="btn btn-ghost" href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              ) : (
                <Link className="btn btn-ghost" href="/contact">Contact me</Link>
              )}
            </div>
            <div className="hero-meta" aria-label="Focus areas">
              {['Network defense', 'SOC / SIEM', 'Linux', 'Python', 'Wazuh', 'Secure infra'].map((c) => (
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
              Illustrative topology — decorative visualization, not live telemetry or real infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* ================= SIGNATURE: SOC LOOP ================= */}
      <section aria-labelledby="soc-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">How I work</p>
            <h2 className="h2" id="soc-h">The security operations loop</h2>
            <p className="lede">
              One loop connects everything I build: infrastructure feeds telemetry,
              telemetry feeds detection, detection feeds analysis, analysis feeds
              response — and every cycle improves the system. Select a stage to see
              how it maps to real projects and lab work.
            </p>
          </div>
          <SocPipeline />
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section className="section-alt" aria-labelledby="proj-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Evidence, not claims</p>
            <h2 className="h2" id="proj-h">Featured projects</h2>
            <p className="lede">
              Each project is a case study: the problem, the architecture, the security
              decisions, what broke, and what I learned. No inflated metrics — just
              systems you can inspect and reasoning you can follow.
            </p>
          </div>
          <div className="card-grid">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <div className="btn-row reveal">
            <Link className="btn btn-ghost" href="/projects">All projects →</Link>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section aria-labelledby="phil-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Principles</p>
            <h2 className="h2" id="phil-h">How I approach security</h2>
            <p className="lede">
              Nine steps, applied to every system I touch — from a fresh Ubuntu install
              to an AI experiment that must never act unsupervised.
            </p>
          </div>
          <Philosophy />
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="section-alt" aria-labelledby="journey-h">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="section-head reveal">
                <p className="eyebrow">Engineering journey</p>
                <h2 className="h2" id="journey-h">Software → networks → security</h2>
                <p className="lede">
                  I came to security through building: software taught me how systems
                  work, networking taught me how they connect, and security taught me
                  how they fail. The trajectory now runs through SOC operations toward
                  security engineering and architecture.
                </p>
              </div>
              <Timeline limit={4} />
              <div className="btn-row reveal">
                <Link className="btn btn-ghost" href="/about">Full story →</Link>
              </div>
            </div>
            <div className="reveal">
              <div className="side-card" style={{ marginBottom: '1rem' }}>
                <h2>Why this order matters</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Security advice is cheap; security judgment comes from operating
                  systems. Because I deploy, break, monitor and fix my own
                  infrastructure, my controls are grounded in what actually fails —
                  not in checklists I have never tested.
                </p>
              </div>
              <div className="side-card">
                <h2>What I am studying now</h2>
                <div className="tag-row">
                  {['Detection engineering', 'ATT&CK mapping', 'Secure APIs', 'SIEM tuning', 'Incident writing'].map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KNOWLEDGE ================= */}
      <section aria-labelledby="know-h">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Knowledge base</p>
            <h2 className="h2" id="know-h">Writing that shows thinking</h2>
            <p className="lede">
              Long-form notes from the lab and the codebase: threat modeling,
              hardening, SIEM tuning and safe automation. Written to be useful to
              other learners — and to prove I understand what I claim.
            </p>
          </div>
          <div className="card-grid">
            {featuredArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
          <div className="btn-row reveal">
            <Link className="btn btn-ghost" href="/knowledge">Browse all writing →</Link>
            <Link className="btn btn-ghost" href="/lab">Lab journal →</Link>
          </div>
        </div>
      </section>

      {/* ================= SECURITY + CONTACT ================= */}
      <section className="section-alt" aria-labelledby="cta-h">
        <div className="container two-col">
          <div className="reveal">
            <p className="eyebrow">Trust</p>
            <h2 className="h2" id="cta-h">This site is itself a case study</h2>
            <p className="lede">
              Strict content security policy, validated inputs, rate-limited APIs,
              minimal attack surface — and a public disclosure policy. I document
              how this portfolio is secured because the site should demonstrate the
              mindset it claims.
            </p>
            <div className="btn-row">
              <Link className="btn btn-ghost" href="/security">How this site is secured →</Link>
            </div>
          </div>
          <div className="reveal">
            <p className="eyebrow">Let&apos;s connect</p>
            <h2 className="h2">Start a conversation</h2>
            <p className="lede" style={{ marginBottom: '1.25rem' }}>
              Internships, junior SOC and security roles, collaborations, or feedback
              on the lab work — serious messages get serious replies.
            </p>
            <SocialLinks />
            <div className="btn-row">
              <Link className="btn btn-primary" href="/contact">Contact me</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
