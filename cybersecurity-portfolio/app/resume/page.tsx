import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Résumé / CV',
  description:
    'Résumé of Omondi Raphael Owino: cybersecurity and network security engineer. Skills, projects, and download link when published.',
  alternates: { canonical: '/resume' },
};

const skills: { group: string; items: string[] }[] = [
  { group: 'Security', items: ['Threat modeling', 'Defense in depth', 'Wazuh / SIEM', 'Detection engineering', 'Alert triage', 'Incident notes'] },
  { group: 'Infrastructure', items: ['Ubuntu Server', 'SSH hardening', 'UFW', 'systemd', 'Bash', 'Tailscale'] },
  { group: 'Networking', items: ['TCP/IP', 'DNS / DHCP', 'Wireshark', 'Nmap (authorized)', 'Segmentation thinking'] },
  { group: 'Development', items: ['JavaScript / TypeScript', 'Node.js / Express', 'React', 'MongoDB', 'REST APIs', 'JWT'] },
  { group: 'Practices', items: ['Python automation', 'Audit logging', 'CI/CD security', 'Runbooks', 'Technical writing'] },
];

export default function ResumePage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Résumé</p>
        <p className="eyebrow">Résumé / CV</p>
        <h1>{site.name}</h1>
        <p className="lede">{site.title} — {site.bio}</p>
        <div className="btn-row">
          {site.cvUrl ? (
            <a className="btn btn-primary" href={site.cvUrl} target="_blank" rel="noopener noreferrer">
              Download CV ↗
            </a>
          ) : (
            <span className="form-note" role="note">
              A downloadable CV will appear here once published. Meanwhile, the
              summary below and the linked case studies cover the same ground.
            </span>
          )}
        </div>
      </div>

      <section aria-label="Résumé summary">
        <div className="container two-col">
          <div>
            <h2 className="h2" style={{ fontSize: '1.4rem' }}>Selected work</h2>
            <div className="prose">
              <ul>
                <li><strong>MlinziOps</strong> — personal security-operations environment: hardened Ubuntu, git-traced deploys, private remote access, SIEM telemetry. <Link href="/projects/mlinziops">Case study</Link></li>
                <li><strong>SecureOps</strong> — detection engineering and defensive automation workspace with approval gates and audit logging. <Link href="/projects/secureops">Case study</Link></li>
                <li><strong>J.A.R.V.I.S.</strong> — guardrailed AI-operations experiment: allowlisted tools, human approval, hash-chained audit log. <Link href="/projects/jarvis">Case study</Link></li>
                <li><strong>SmartRecovery</strong> — academic capstone: realtime short-window food-donation logistics (Node, React, Socket.IO, Leaflet). <Link href="/projects/smartrecovery">Case study</Link></li>
                <li><strong>Security Lab</strong> — Kali → Ubuntu → Wazuh defensive range with a structured journal. <Link href="/projects/security-lab">Case study</Link></li>
              </ul>
            </div>
            <h2 className="h2" style={{ fontSize: '1.4rem', marginTop: '2rem' }}>Writing &amp; lab</h2>
            <div className="prose">
              <ul>
                <li><Link href="/knowledge">Knowledge base</Link> — threat modeling, hardening, SIEM tuning, safe automation.</li>
                <li><Link href="/lab">Lab journal</Link> — 8 structured defensive exercises with evidence and mitigations.</li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="h2" style={{ fontSize: '1.4rem' }}>Skills</h2>
            {skills.map((g) => (
              <div key={g.group} className="side-card" style={{ marginBottom: '0.9rem' }}>
                <h2>{g.group}</h2>
                <div className="tag-row">
                  {g.items.map((i) => <span key={i} className="tag">{i}</span>)}
                </div>
              </div>
            ))}
            <div className="note-box">
              <strong>No inflated credentials.</strong> No invented employers,
              certifications, or awards are listed here — or anywhere on this site.
              Verifiable work only.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
