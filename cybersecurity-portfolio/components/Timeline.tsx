import { milestones } from '@/content/timeline';

const glyph: Record<string, string> = { done: '✓', active: '●', next: '○' };

export default function Timeline({ limit }: { limit?: number }) {
  const items = limit ? milestones.slice(0, limit) : milestones;
  return (
    <ol className="timeline" style={{ listStyle: 'none', padding: 0 }}>
      {items.map((m, i) => (
        <li key={m.id} className="tl-item reveal" data-status={m.status}>
          <div className="tl-rail" aria-hidden="true"><span className="tl-node">{glyph[m.status] ?? i + 1}</span><span className="tl-line" /></div>
          <div className="tl-body">
            <span className="tl-phase">{m.phase} • {m.status === 'done' ? 'Foundation' : m.status === 'active' ? 'Available area' : 'Direction'}</span>
            <h3>{m.title}</h3><p>{m.summary}</p>
            <div className="tag-row">{m.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
