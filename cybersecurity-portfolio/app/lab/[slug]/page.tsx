import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { labs, getLab } from '@/content/labs';
import { site } from '@/content/site';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = getLab(slug);
  if (!l) return { title: 'Lab entry not found' };
  return {
    title: l.title,
    description: l.objective,
    alternates: { canonical: `/lab/${l.slug}` },
    openGraph: {
      title: `${l.title} • ${site.name}`,
      description: l.objective,
      url: `${site.siteUrl}/lab/${l.slug}`,
    },
  };
}

export default async function LabEntryPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const others = labs.filter((x) => x.slug !== lab.slug).slice(0, 2);

  return (
    <>
      <div className="container case-hero">
        <Link className="back-link" href="/lab">← Lab journal</Link>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/lab">Security Lab</Link> / {lab.title}
        </p>
        <div className="meta-row">
          <span className="card-cat">{lab.category}</span>
          <span className="badge">{lab.difficulty}</span>
        </div>
        <h1>{lab.title}</h1>
        <div className="meta" style={{ marginTop: '0.75rem' }}>
          <span>{formatDate(lab.date)}</span>
          <span>{lab.minutes} min reference</span>
        </div>
      </div>

      <section aria-label={`${lab.title} notes`}>
        <div className="container case-grid">
          <div className="prose">
            <h2 id="objective">Objective</h2>
            <p>{lab.objective}</p>

            <h2 id="environment">Environment</h2>
            <ul>{lab.environment.map((e) => <li key={e}>{e}</li>)}</ul>

            <h2 id="method">Method</h2>
            <ol>{lab.method.map((m) => <li key={m}>{m}</li>)}</ol>

            <h2 id="evidence">Evidence</h2>
            <ul>{lab.evidence.map((e) => <li key={e}>{e}</li>)}</ul>

            <h2 id="observations">Observations</h2>
            <ul>{lab.observations.map((o) => <li key={o}>{o}</li>)}</ul>

            <h2 id="analysis">Analysis</h2>
            <p>{lab.analysis}</p>

            <h2 id="findings">Findings</h2>
            <ul>{lab.findings.map((f) => <li key={f}>{f}</li>)}</ul>

            <h2 id="mitigation">Mitigation</h2>
            <ul>{lab.mitigation.map((m) => <li key={m}>{m}</li>)}</ul>

            <h2 id="lessons">Lessons learned</h2>
            <ul>{lab.lessons.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>

          <aside className="case-side" aria-label="Entry facts">
            <div className="side-card">
              <h2>Facts</h2>
              <dl>
                <dt>Date</dt><dd>{formatDate(lab.date)}</dd>
                <dt>Category</dt><dd>{lab.category}</dd>
                <dt>Difficulty</dt><dd>{lab.difficulty}</dd>
                <dt>Reference length</dt><dd>{lab.minutes} min</dd>
              </dl>
            </div>
            <div className="side-card">
              <h2>Tags</h2>
              <div className="tag-row">
                {lab.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="side-card">
              <h2>On this page</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.35rem', fontSize: '0.86rem' }}>
                {[
                  ['objective', 'Objective'],
                  ['environment', 'Environment'],
                  ['method', 'Method'],
                  ['evidence', 'Evidence'],
                  ['observations', 'Observations'],
                  ['analysis', 'Analysis'],
                  ['findings', 'Findings'],
                  ['mitigation', 'Mitigation'],
                  ['lessons', 'Lessons'],
                ].map(([id, label]) => (
                  <li key={id}><a href={`#${id}`}>{label}</a></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-alt" aria-label="More lab entries">
        <div className="container">
          <h2 className="h2">Explore more entries</h2>
          <div className="card-grid" style={{ marginTop: '1.5rem' }}>
            {others.map((o) => (
              <article key={o.slug} className="card">
                <span className="card-cat">{o.category}</span>
                <h3><Link href={`/lab/${o.slug}`}>{o.title}</Link></h3>
                <p>{o.objective}</p>
                <div className="card-links">
                  <Link href={`/lab/${o.slug}`}>Lab notes →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
