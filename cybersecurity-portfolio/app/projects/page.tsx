import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCard } from '@/components/Cards';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Inspect public GitHub source, test definitions, investigation reports and lab documentation for MlinziOps, Wazuh investigations, Security Lab and JARVIS.',
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
          Go beyond the overview. Open the repository, inspect the implementation, read the investigation and review the limitations. Each reference is labelled as source, tests, report or setup documentation.
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
            <strong>Reviewable work, not borrowed credibility.</strong> These are public engineering and lab references, not client engagements. Source code, written reports and deployed validation are different kinds of evidence. Each project explains what is available.
          </div>
        </div>
      </section>
    </>
  );
}
