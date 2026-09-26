/**
 * Decorative network-topology visualization.
 * Purely illustrative — aria-hidden, no fake telemetry or statistics.
 * Motion is CSS-only and disabled under prefers-reduced-motion.
 */
export default function HeroNetwork() {
  return (
    <svg
      className="netviz"
      viewBox="0 0 420 260"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nw-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ea8fe" stopOpacity="0.55" />
          <stop offset="1" stopColor="#6ea8fe" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="nw-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#6ea8fe" stopOpacity="0.35" />
          <stop offset="1" stopColor="#6ea8fe" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="210" cy="130" r="95" fill="url(#nw-core)" />

      {/* edges */}
      <g stroke="url(#nw-edge)" strokeWidth="1.2">
        <line x1="210" y1="130" x2="90" y2="60" />
        <line x1="210" y1="130" x2="330" y2="60" />
        <line x1="210" y1="130" x2="70" y2="170" />
        <line x1="210" y1="130" x2="350" y2="175" />
        <line x1="210" y1="130" x2="150" y2="220" />
        <line x1="210" y1="130" x2="275" y2="225" />
        <line x1="90" y1="60" x2="330" y2="60" strokeDasharray="3 6" opacity="0.5" />
        <line x1="70" y1="170" x2="150" y2="220" strokeDasharray="3 6" opacity="0.5" />
        <line x1="350" y1="175" x2="275" y2="225" strokeDasharray="3 6" opacity="0.5" />
      </g>

      {/* traveling pulses (decorative) */}
      <g
        className="pulse-dot"
        stroke="#9cc2ff"
        strokeWidth="2"
        strokeDasharray="4 180"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      >
        <line x1="210" y1="130" x2="90" y2="60" />
        <line x1="210" y1="130" x2="350" y2="175" />
        <line x1="210" y1="130" x2="275" y2="225" />
      </g>

      {/* nodes */}
      <g>
        <circle cx="210" cy="130" r="17" fill="#0e1626" stroke="#6ea8fe" strokeWidth="1.5" />
        <circle cx="210" cy="130" r="5" fill="#6ea8fe" />
        {[
          [90, 60, 'SRC'],
          [330, 60, 'EDGE'],
          [70, 170, 'HOST'],
          [350, 175, 'SIEM'],
          [150, 220, 'LAB'],
          [275, 225, 'OPS'],
        ].map(([x, y, label]) => (
          <g key={label as string}>
            <circle cx={x as number} cy={y as number} r="11" fill="#0d1626" stroke="#2a3a4f" strokeWidth="1.2" />
            <circle cx={x as number} cy={y as number} r="3" fill="#57d9a3" opacity="0.85" />
            <text
              x={x as number}
              y={(y as number) + 26}
              textAnchor="middle"
              fill="#64748c"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="1.5"
            >
              {label}
            </text>
          </g>
        ))}
        <text
          x="210"
          y="162"
          textAnchor="middle"
          fill="#9aa9bd"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="2"
        >
          CORE
        </text>
      </g>
    </svg>
  );
}
