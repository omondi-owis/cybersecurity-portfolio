import Link from 'next/link';
import type { Project } from '@/content/projects';
import type { Lab } from '@/content/labs';
import type { Article } from '@/content/articles';
import { formatDate } from '@/lib/utils';

const toneClass: Record<string, string> = {
  active: 'badge-active',
  building: 'badge-building',
  research: 'badge-research',
  academic: 'badge-academic',
  ongoing: 'badge-ongoing',
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card reveal">
      <div className="card-top">
        <span className="card-cat">{project.category}</span>
        <span className={`badge ${toneClass[project.statusTone] ?? ''}`}>{project.status}</span>
      </div>
      <h3>
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </h3>
      <p>{project.summary}</p>
      <p className="evidence-caption">{project.evidence.map((e) => e.kind).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}</p>
      <div className="tag-row" aria-label="Technologies">
        {project.stack.slice(0, 4).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <div className="card-links">
        <Link href={`/projects/${project.slug}`}>Explore project →</Link>
        {project.github ? (
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            View GitHub evidence ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function LabCard({ lab }: { lab: Lab }) {
  return (
    <article className="card reveal">
      <div className="card-top">
        <span className="card-cat">{lab.category}</span>
        <span className="badge">{lab.difficulty}</span>
      </div>
      <h3>
        <Link href={`/lab/${lab.slug}`}>{lab.title}</Link>
      </h3>
      <p>{lab.objective}</p>
      <div className="meta">
        <span>{formatDate(lab.date)}</span>
        <span>{lab.minutes} min</span>
      </div>
      <div className="card-links">
        <Link href={`/lab/${lab.slug}`}>Lab notes →</Link>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="card reveal">
      <div className="card-top">
        <span className="card-cat">{article.category}</span>
        <span className="badge">{article.minutes} min read</span>
      </div>
      <h3>
        <Link href={`/knowledge/${article.slug}`}>{article.title}</Link>
      </h3>
      <p>{article.excerpt}</p>
      <div className="meta">
        <span>{formatDate(article.date)}</span>
      </div>
      <div className="card-links">
        <Link href={`/knowledge/${article.slug}`}>Read article →</Link>
      </div>
    </article>
  );
}
