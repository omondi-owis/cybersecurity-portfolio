/**
 * CURRENT FOCUS — honest status labels, never fake percentages.
 * The owner edits these labels directly; they are not metrics.
 */
const focus = [
  { area: 'NETWORK SECURITY', state: 'ACTIVE', tone: 'active' },
  { area: 'LINUX SECURITY', state: 'ACTIVE', tone: 'active' },
  { area: 'SOC OPERATIONS', state: 'ACTIVE', tone: 'active' },
  { area: 'PYTHON AUTOMATION', state: 'DEVELOPING', tone: 'dev' },
  { area: 'SECURITY ENGINEERING', state: 'DEVELOPING', tone: 'dev' },
  { area: 'SECURITY ARCHITECTURE', state: 'STUDYING', tone: 'dev' },
] as const;

export default function CurrentFocus() {
  return (
    <div className="status-card reveal">
      <div className="status-head">
        <span className="status-title">CURRENT FOCUS</span>
        <span className="dot dot-pulse" aria-hidden="true" />
      </div>
      <div className="status-rows">
        {focus.map((f) => (
          <div key={f.area} className="status-row">
            <span className="k">{f.area}</span>
            <span className={`v${f.tone === 'dev' ? ' dev' : ''}`}>{f.state}</span>
          </div>
        ))}
      </div>
      <p className="hero-viz-caption">Status labels set by the owner — not scores or metrics.</p>
    </div>
  );
}
