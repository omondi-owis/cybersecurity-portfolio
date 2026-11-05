import type { Metadata } from 'next';
import Link from 'next/link';
import KnowledgeExplorer from '@/components/KnowledgeExplorer';
import { articles, articleCategories } from '@/content/articles';

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description:
    'Technical writing on cybersecurity, networking, Linux, SOC operations, SIEM tuning, Python automation, and secure development.',
  alternates: { canonical: '/knowledge' },
};

export default function KnowledgePage() {
  return (
    <>
      <div className="container page-head">
        <p className="breadcrumb"><Link href="/">Home</Link> / Knowledge</p>
        <p className="eyebrow">Technical writing</p>
        <h1>Notes worth reading twice.</h1>
        <p className="lede">
          Practical guides to defensive security, Linux, networking and secure
          development. These explain methods and tradeoffs; completed project
          results belong in the case studies. Search by topic or filter by category.
        </p>
      </div>
      <section aria-label="Articles">
        <div className="container">
          <KnowledgeExplorer articles={articles} categories={articleCategories} />
        </div>
      </section>
    </>
  );
}
