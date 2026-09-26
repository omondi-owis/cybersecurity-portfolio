import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCard } from '@/components/Cards';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies in security operations, detection engineering, hardened infrastructure, and full-stack development: MlinziOps, SecureOps, JARVIS, SmartRecovery, Security Lab.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Projects</p>
        <p className="eyebrow">What I actually build</p>
        <h1>Projects with receipts.</h1>
        <p className="lede">
          Every project is a full case study — problem, architecture, security
          decisions, failures, and lessons. Statuses are honest: things in
          development are labeled as such, experiments are labeled as experiments.
        </p>
      </div>
      <section aria-label="All projects">
        <div className="container">
          <div className="card-grid">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <div className="note-box">
            <strong>Repository links appear as they&apos;re published.</strong> Each
            case study documents the real system; GitHub links are added only for
            repositories the owner has actually made public — never invented.
          </div>
        </div>
      </section>
    </>
  );
}
