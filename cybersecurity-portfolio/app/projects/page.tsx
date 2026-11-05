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
        <p className="eyebrow">Technical case studies</p>
        <h1>Projects with evidence.</h1>
        <p className="lede">
          Each project is a technical case study covering the problem, architecture, security
          decisions, constraints, and outcomes. Status labels remain explicit: systems
          in development, research, academic work, and lab references are identified as such.
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
            repositories that have been published — never invented.
          </div>
        </div>
      </section>
    </>
  );
}
