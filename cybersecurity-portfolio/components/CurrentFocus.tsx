const focus = [
  { area: 'SIEM / WAZUH', state: 'OFFERED', tone: 'active' },
  { area: 'LINUX SECURITY REVIEW', state: 'OFFERED', tone: 'active' },
  { area: 'NETWORK SECURITY REVIEW', state: 'OFFERED', tone: 'active' },
  { area: 'PYTHON LOG AUTOMATION', state: 'OFFERED', tone: 'active' },
  { area: 'INCIDENT TRIAGE DOCUMENTATION', state: 'OFFERED', tone: 'active' },
  { area: 'AUTHORIZED SCOPED WORK', state: 'REQUIRED', tone: 'dev' },
] as const;

export default function CurrentFocus() {
  return (
    <div className="status-card reveal">
      <div className="status-head"><span className="status-title">VYRA SERVICE AREAS</span><span className="dot dot-pulse" aria-hidden="true" /></div>
      <div className="status-rows">{focus.map((f) => <div key={f.area} className="status-row"><span className="k">{f.area}</span><span className={`v${f.tone === 'dev' ? ' dev' : ''}`}>{f.state}</span></div>)}</div>
      <p className="hero-viz-caption">Availability depends on fit, written scope and authorization — not a service-level guarantee.</p>
    </div>
  );
}
