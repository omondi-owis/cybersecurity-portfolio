/** Sanitized, accessible SVG architecture diagrams. No real infrastructure data. */

export function SecurityArchDiagram() {
  return (
    <figure className="diagram">
      <svg viewBox="0 0 640 460" role="img" aria-labelledby="secarch-title secarch-desc">
        <title id="secarch-title">Portfolio defense-in-depth architecture</title>
        <desc id="secarch-desc">
          Layered diagram: internet at top, then Cloudflare edge with TLS WAF and rate
          limiting, then the application with security headers, then the API with
          validation and limits, then database and services at the bottom.
        </desc>
        <defs>
          <linearGradient id="sa-box" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#131c28" />
            <stop offset="1" stopColor="#0e151f" />
          </linearGradient>
        </defs>
        {[
          { y: 8, label: 'INTERNET — untrusted, scanned constantly', accent: '#f0757a' },
          { y: 76, label: 'EDGE — TLS • WAF • DDoS • bot controls • rate limits', accent: '#6ea8fe' },
          { y: 170, label: 'APPLICATION — CSP • secure headers • validation • safe rendering', accent: '#6ea8fe' },
          { y: 264, label: 'API — schema validation • rate limits • request caps • safe errors', accent: '#57d9a3' },
          { y: 358, label: 'DATA & SERVICES — least privilege • minimal collection • TLS', accent: '#57d9a3' },
        ].map((b) => (
          <g key={b.y}>
            <rect x="40" y={b.y} width="560" height="62" rx="10" fill="url(#sa-box)" stroke="#2a3a4f" />
            <rect x="40" y={b.y} width="4" height="62" rx="2" fill={b.accent} />
            <text x="60" y={b.y + 37} fill="#e8eef5" fontSize="12.5" fontFamily="JetBrains Mono, monospace">
              {b.label}
            </text>
          </g>
        ))}
        {[70, 164, 258, 352].map((y) => (
          <g key={y} stroke="#2a3a4f" strokeWidth="1.5">
            <line x1="320" y1={y} x2="320" y2={y - 0} />
            <line x1="320" y1={y - 0} x2="320" y2={y + 6} />
          </g>
        ))}
        {[70, 164, 258, 352].map((y) => (
          <text key={'a' + y} x="320" y={y + 4} textAnchor="middle" fill="#64748c" fontSize="11">▼</text>
        ))}
      </svg>
      <figcaption>Defense in depth: every layer assumes the one above it can fail. Illustrative — no vendor internals shown.</figcaption>
    </figure>
  );
}

export function LabTopology() {
  return (
    <figure className="diagram">
      <svg viewBox="0 0 640 340" role="img" aria-labelledby="lab-title lab-desc">
        <title id="lab-title">Security lab topology</title>
        <desc id="lab-desc">
          Three boxes top to bottom: Kali for authorized testing, Ubuntu Server as the
          defended target with a Wazuh agent, and Wazuh SIEM collecting alerts.
        </desc>
        {[
          { y: 20, t: 'KALI', s: 'authorized testing • scoped • time-boxed', c: '#b39df5' },
          { y: 130, t: 'UBUNTU SERVER', s: 'defended target • hardened • agent enrolled', c: '#6ea8fe' },
          { y: 240, t: 'WAZUH SIEM', s: 'telemetry • rules • triage • tuning', c: '#57d9a3' },
        ].map((b) => (
          <g key={b.t}>
            <rect x="150" y={b.y} width="340" height="70" rx="10" fill="#101722" stroke="#2a3a4f" />
            <circle cx="176" cy={b.y + 35} r="7" fill={b.c} />
            <text x="194" y={b.y + 31} fill="#e8eef5" fontSize="13" fontWeight="700" fontFamily="Space Grotesk, sans-serif" letterSpacing="1">
              {b.t}
            </text>
            <text x="194" y={b.y + 50} fill="#9aa9bd" fontSize="11" fontFamily="JetBrains Mono, monospace">
              {b.s}
            </text>
          </g>
        ))}
        <g stroke="#2a3a4f" strokeWidth="1.5">
          <line x1="320" y1="90" x2="320" y2="130" />
          <line x1="320" y1="200" x2="320" y2="240" />
        </g>
        <text x="336" y="114" fill="#64748c" fontSize="10" fontFamily="JetBrains Mono, monospace">tests →</text>
        <text x="336" y="224" fill="#64748c" fontSize="10" fontFamily="JetBrains Mono, monospace">ships →</text>
      </svg>
      <figcaption>Lab topology (sanitized): isolated virtual network. Test traffic never leaves owned systems.</figcaption>
    </figure>
  );
}

export function FlowList({ items }: { items: { name: string; detail: string }[] }) {
  return (
    <div className="flow" role="list" aria-label="Architecture layers">
      {items.map((it, i) => (
        <div key={it.name}>
          <div className="flow-node" role="listitem">
            <span className="fn">{it.name}</span>
            <span className="fd">{it.detail}</span>
          </div>
          {i < items.length - 1 && (
            <div className="flow-arrow" aria-hidden="true">▼</div>
          )}
        </div>
      ))}
    </div>
  );
}
