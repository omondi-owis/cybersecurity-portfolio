import type { Metadata } from 'next';
import Link from 'next/link';
import Timeline from '@/components/Timeline';
import CurrentFocus from '@/components/CurrentFocus';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The engineering journey of Omondi Raphael Owino: software development to networking to cybersecurity, SOC operations, and security engineering.',
  alternates: { canonical: '/about' },
};

const interests = [
  'Network security',
  'Cybersecurity',
  'Linux',
  'Python',
  'SOC operations',
  'SIEM',
  'Defensive security',
  'Security monitoring',
  'Secure infrastructure',
  'Automation',
  'Secure software development',
];

export default function AboutPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / About</p>
        <p className="eyebrow">Who is {site.firstName}?</p>
        <h1>An engineer learning security by building defended systems.</h1>
        <p className="lede">
          I&apos;m {site.name}, a {site.title.toLowerCase()} developing practical
          expertise through software engineering, security labs, infrastructure,
          monitoring, automation, and defensive security. This page is the honest
          version of my story — what I&apos;ve built, what I&apos;m studying, and
          where I&apos;m headed.
        </p>
      </div>

      <section aria-labelledby="story-h">
        <div className="container two-col">
          <div>
            <h2 className="h2" id="story-h">Software taught me to build. Security taught me to doubt.</h2>
            <div className="prose">
              <p>
                I started as a software developer — JavaScript, Node.js, React,
                MongoDB — shipping full-stack applications including a university
                capstone with realtime logistics. Building software taught me how
                systems <strong>work</strong>.
              </p>
              <p>
                Networking came next: packets, routing, DNS, firewalls. I captured
                traffic in Wireshark and watched abstractions dissolve into bytes.
                Networking taught me how systems <strong>connect</strong>.
              </p>
              <p>
                Then the question that changed everything: <strong>how do they fail?</strong>{' '}
                That pulled me into cybersecurity — first hardening my own Ubuntu
                hosts, then deploying a Wazuh SIEM, then practicing the full SOC loop:
                telemetry, detection, triage, response, improvement.
              </p>
              <p>
                Today I split my time between <strong>MlinziOps</strong> (operating
                hardened infrastructure), <strong>SecureOps</strong> (detection
                engineering and defensive automation), and the <strong>Security Lab</strong>{' '}
                where every exercise ends in documented evidence. The trajectory runs
                toward security engineering and, eventually, security architecture.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/projects">See the evidence</Link>
              <Link className="btn btn-ghost" href="/lab">Read the lab journal</Link>
            </div>
          </div>
          <div>
            <CurrentFocus />
            <div className="side-card" style={{ marginTop: '1rem' }}>
              <h2>Areas of interest</h2>
              <div className="tag-row">
                {interests.map((i) => (
                  <span key={i} className="tag">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt" aria-labelledby="timeline-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The journey</p>
            <h2 className="h2" id="timeline-h">From code to architecture</h2>
            <p className="lede">
              Each phase builds on the last. Nothing here is skipped — the lab work
              and projects on this site are the receipts for every claim below.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      <section aria-labelledby="honest-h">
        <div className="container container-narrow">
          <p className="eyebrow">Honest by design</p>
          <h2 className="h2" id="honest-h">What I won&apos;t claim</h2>
          <div className="prose">
            <p>
              You won&apos;t find invented employers, fake certifications, fabricated
              incident stories, or vanity metrics on this site. Where information
              isn&apos;t ready to publish — a repository being cleaned up, a channel
              being set up — the link is simply absent rather than faked.
            </p>
            <p>
              What you <em>will</em> find is verifiable work: architectures you can
              critique, lab notes with methods and evidence, code with security
              decisions explained, and a disclosure policy that invites scrutiny.
              I&apos;d rather be judged on a small body of real work than a large
              body of claims.
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-ghost" href="/security">How this site is secured →</Link>
            <Link className="btn btn-ghost" href="/contact">Contact me →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
