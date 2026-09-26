import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, getProject } from '@/content/projects';
import { site } from '@/content/site';
import { FlowList } from '@/components/Diagrams';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: 'Project not found' };
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: `${p.title} • ${site.name}`,
      description: p.summary,
      url: `${site.siteUrl}/projects/${p.slug}`,
    },
  };
}

const toneClass: Record<string, string> = {
  active: 'badge-active',
  building: 'badge-building',
  research: 'badge-research',
  academic: 'badge-academic',
  ongoing: 'badge-ongoing',
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const others = projects.filter((x) => x.slug !== p.slug).slice(0, 2);

  return (
    <>
      <div className="container case-hero">
        <Link className="back-link" href="/projects">← All projects</Link>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/projects">Projects</Link> / {p.title}
        </p>
        <div className="meta-row">
          <span className="card-cat">{p.category}</span>
          <span className={`badge ${toneClass[p.statusTone] ?? ''}`}>{p.status}</span>
        </div>
        <h1>{p.title}</h1>
        {p.codename && (
          <p className="lede" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{p.codename}</p>
        )}
        <p className="lede" style={{ marginTop: '0.75rem' }}>{p.summary}</p>
        <div className="btn-row">
          {p.github ? (
            <a className="btn btn-primary" href={p.github} target="_blank" rel="noopener noreferrer">
              GitHub repository ↗
            </a>
          ) : null}
          {p.demo ? (
            <a className="btn btn-ghost" href={p.demo} target="_blank" rel="noopener noreferrer">
              Live demo ↗
            </a>
          ) : null}
          {p.docs ? (
            <a className="btn btn-ghost" href={p.docs} target="_blank" rel="noopener noreferrer">
              Documentation ↗
            </a>
          ) : null}
        </div>
      </div>

      <section aria-label={`${p.title} case study`}>
        <div className="container case-grid">
          <div className="prose">
            <h2 id="problem">The problem</h2>
            <p>{p.problem}</p>

            <h2 id="motivation">Why I built it</h2>
            <p>{p.motivation}</p>

            <h2 id="architecture">Architecture</h2>
            <FlowList items={p.architecture} />
            <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}><em>{p.architectureNote}</em></p>

            <h2 id="implementation">How it was implemented</h2>
            <ol>
              {p.implementation.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <h2 id="security">Security considerations</h2>
            <ul>
              {p.security.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <h2 id="challenges">Challenges</h2>
            <ul>
              {p.challenges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h2 id="decisions">Key decisions</h2>
            <dl className="kv">
              {p.decisions.map((d) => (
                <div key={d.decision} style={{ display: 'contents' }}>
                  <dt>{d.decision}</dt>
                  <dd>{d.reason}</dd>
                </div>
              ))}
            </dl>

            <h2 id="lessons">Lessons learned</h2>
            <ul>
              {p.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>

            <h2 id="future">What&apos;s next</h2>
            <ul>
              {p.future.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <aside className="case-side" aria-label="Project facts">
            <div className="side-card">
              <h2>Facts</h2>
              <dl>
                <dt>Status</dt>
                <dd>{p.status}</dd>
                <dt>Category</dt>
                <dd>{p.category}</dd>
              </dl>
            </div>
            <div className="side-card">
              <h2>Stack</h2>
              <div className="tag-row">
                {p.stack.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="side-card">
              <h2>On this page</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.35rem', fontSize: '0.86rem' }}>
                {[
                  ['problem', 'The problem'],
                  ['motivation', 'Why it exists'],
                  ['architecture', 'Architecture'],
                  ['implementation', 'Implementation'],
                  ['security', 'Security'],
                  ['challenges', 'Challenges'],
                  ['decisions', 'Decisions'],
                  ['lessons', 'Lessons'],
                  ['future', "What's next"],
                ].map(([id, label]) => (
                  <li key={id}><a href={`#${id}`}>{label}</a></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-alt" aria-label="More projects">
        <div className="container">
          <h2 className="h2">Keep exploring</h2>
          <div className="card-grid" style={{ marginTop: '1.5rem' }}>
            {others.map((o) => (
              <article key={o.slug} className="card">
                <span className="card-cat">{o.category}</span>
                <h3><Link href={`/projects/${o.slug}`}>{o.title}</Link></h3>
                <p>{o.summary}</p>
                <div className="card-links">
                  <Link href={`/projects/${o.slug}`}>Case study →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
