'use client';

import { useMemo, useState } from 'react';
import type { Article } from '@/content/articles';
import { ArticleCard } from './Cards';

interface Props {
  articles: Article[];
  categories: string[];
}

export default function KnowledgeExplorer({ articles, categories }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (!q) return true;
      const hay = `${a.title} ${a.excerpt} ${a.tags.join(' ')} ${a.category}`.toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [articles, query, category]);

  return (
    <div>
      <div className="toolbar" role="search">
        <div className="search">
          <span className="icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search articles, tags, topics…"
            aria-label="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-row" role="group" aria-label="Filter by category" style={{ marginBottom: '1.75rem' }}>
        {['All', ...categories].map((c) => (
          <button
            key={c}
            className="pill"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="meta" role="status" style={{ marginBottom: '1.25rem' }}>
        {results.length} {results.length === 1 ? 'article' : 'articles'}
        {query.trim() ? ` matching “${query.trim()}”` : ''}
        {category !== 'All' ? ` in ${category}` : ''}
      </p>

      {results.length === 0 ? (
        <div className="note-box">
          <strong>No matches.</strong> Try fewer keywords, or browse a different category.
        </div>
      ) : (
        <div className="card-grid">
          {results.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
