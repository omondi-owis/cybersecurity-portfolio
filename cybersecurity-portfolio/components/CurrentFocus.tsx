const evidence = [
  { label: 'Platform source', detail: 'MlinziOps', href: 'https://github.com/omondi-owis/MlinziOps', external: true },
  { label: 'Investigation report', detail: 'Wazuh port change', href: 'https://github.com/omondi-owis/soc-investigation-wazuh/blob/main/SOC-Investigation-Report-Wazuh-Port-Change.md', external: true },
] as const;

export default function CurrentFocus() {
  return (
    <section className="evidence-console reveal" aria-labelledby="evidence-console-title">
      <div className="evidence-console__bar">
        <div>
          <p className="evidence-console__eyebrow">VYRA / EVIDENCE INDEX</p>
          <h2 id="evidence-console-title">Technical work, clearly referenced.</h2>
        </div>
        <span className="evidence-console__badge">PUBLIC REFERENCES</span>
      </div>

      <div className="evidence-console__visual" aria-hidden="true">
        <svg viewBox="0 0 640 174" role="img">
          <defs>
            <linearGradient id="evidence-line" x1="0" x2="1">
              <stop stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="0.5" stopColor="currentColor" stopOpacity="0.85" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="evidence-fill" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="evidence-console__grid" d="M0 28.5H640M0 87.5H640M0 146.5H640M80 0V174M200 0V174M320 0V174M440 0V174M560 0V174" />
          <path className="evidence-console__area" d="M0 135 L70 121 L125 129 L182 81 L245 104 L308 61 L368 74 L428 37 L494 65 L560 47 L640 22 V174 H0Z" />
          <path className="evidence-console__trace" d="M0 135 L70 121 L125 129 L182 81 L245 104 L308 61 L368 74 L428 37 L494 65 L560 47 L640 22" />
          <g className="evidence-console__points">
            <circle cx="182" cy="81" r="4" /><circle cx="308" cy="61" r="4" /><circle cx="428" cy="37" r="4" /><circle cx="640" cy="22" r="4" />
          </g>
        </svg>
        <div className="evidence-console__legend">
          <span><i />Documented artifacts</span>
          <span>Reference map · not live telemetry</span>
        </div>
      </div>

      <div className="evidence-console__references">
        {evidence.map((item, index) => (
          <a className="evidence-console__reference" href={item.href} target="_blank" rel="noreferrer" key={item.label}>
            <span className="evidence-console__number">0{index + 1}</span>
            <span>
              <small>{item.label}</small>
              <strong>{item.detail}</strong>
            </span>
            <span className="evidence-console__arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>

      <div className="evidence-console__footer">
        <span>Public source and report — not a live dashboard.</span>
        <a href="/projects">View project references <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
