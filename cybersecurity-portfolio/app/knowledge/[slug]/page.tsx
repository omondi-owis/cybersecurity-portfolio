import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticle, relatedArticles } from '@/content/articles';
import { site } from '@/content/site';
import CodeBlock from '@/components/CodeBlock';
import { ArticleCard } from '@/components/Cards';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: 'Article not found' };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/knowledge/${a.slug}` },
    openGraph: {
      type: 'article',
      title: `${a.title} • ${site.name}`,
      description: a.excerpt,
      url: `${site.siteUrl}/knowledge/${a.slug}`,
      publishedTime: a.date,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = relatedArticles(article);

  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(`${site.siteUrl}/knowledge/${article.slug}`);

  return (
    <>
      <div className="container case-hero">
        <Link className="back-link" href="/knowledge">← Knowledge base</Link>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/knowledge">Knowledge</Link> / {article.title}
        </p>
        <div className="meta-row">
          <span className="card-cat">{article.category}</span>
          <span className="badge">{article.minutes} min read</span>
        </div>
        <h1>{article.title}</h1>
        <p className="lede" style={{ marginTop: '0.75rem' }}>{article.excerpt}</p>
        <div className="meta" style={{ marginTop: '0.75rem' }}>
          <span>By {site.name}</span>
          <span>Published {formatDate(article.date)}</span>
          {article.updated && <span>Updated {formatDate(article.updated)}</span>}
        </div>
        <div className="tag-row" style={{ marginTop: '1rem' }}>
          {article.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      <section aria-label={article.title}>
        <div className="container article-layout">
          <nav className="toc" aria-label="Table of contents">
            <h2>Contents</h2>
            <ol>
              {article.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>
              ))}
            </ol>
          </nav>

          <article className="prose">
            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {s.code && <CodeBlock lang={s.code.lang} code={s.code.code} caption={s.code.caption} />}
              </section>
            ))}

            <hr className="divider" />
            <div className="meta-row" style={{ justifyContent: 'space-between' }}>
              <span className="meta">Share this article:</span>
              <span style={{ display: 'flex', gap: '1rem', fontSize: '0.88rem', fontWeight: 600 }}>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer">X</a>
              </span>
            </div>
            <p className="form-note" style={{ marginTop: '1rem' }}>
              Found an error or disagree with a take? <Link href="/contact">Tell me</Link> —
              corrections make the knowledge base better for everyone.
            </p>
          </article>
        </div>
      </section>

      <section className="section-alt" aria-label="Related articles">
        <div className="container">
          <h2 className="h2">Related reading</h2>
          <div className="card-grid" style={{ marginTop: '1.5rem' }}>
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
