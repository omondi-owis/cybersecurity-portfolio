'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Signature interaction: the Security Operations loop.
 * Infrastructure → Telemetry → Detection → Analysis → Response → Improvement.
 * Keyboard-accessible tab interface (arrow keys + tablist semantics).
 */

const stages = [
  {
    id: 'infrastructure',
    n: '01',
    label: 'Infrastructure',
    title: 'Harden what you run',
    body: 'Every reference-lab host starts from a verified baseline: key-only SSH, default-deny firewall, unattended security patches. Infrastructure is the first control, not the backdrop.',
    points: ['Ubuntu hardening baseline', 'UFW default-deny policies', 'MlinziOps private access'],
    links: [
      { href: '/projects/mlinziops', label: 'MlinziOps case study' },
      { href: '/lab/linux-hardening-baseline', label: 'Hardening lab' },
    ],
  },
  {
    id: 'telemetry',
    n: '02',
    label: 'Telemetry',
    title: 'Collect before you need it',
    body: 'You cannot detect what you never collected. Agents ship auth, system and file-integrity telemetry to the isolated lab SIEM continuously — logging is a prerequisite, never a phase two.',
    points: ['Wazuh agents on every host', 'Auth + auditd + syscheck', 'UTC-everywhere timestamps'],
    links: [
      { href: '/lab/wazuh-deployment-tuning', label: 'Wazuh deployment lab' },
      { href: '/projects/security-lab', label: 'Security Lab' },
    ],
  },
  {
    id: 'detection',
    n: '03',
    label: 'Detection',
    title: 'Rules are hypotheses',
    body: 'Each detection rule states a belief about attacker behavior — then gets tested safely, tuned against noise, and re-validated monthly so it still fires when it matters.',
    points: ['Custom Wazuh rules', 'Tuning journal with rationale', 'Monthly re-validation'],
    links: [
      { href: '/lab/detection-rule-lifecycle', label: 'Rule lifecycle lab' },
      { href: '/knowledge/siem-tuning-without-blinding', label: 'Tuning write-up' },
    ],
  },
  {
    id: 'analysis',
    n: '04',
    label: 'Analysis',
    title: 'Alerts become timelines',
    body: 'Triage converts alerts into decisions: scope, timeline, evidence, blast radius. Two independent sources — logs plus packets — make a finding solid instead of speculative.',
    points: ['Five-step triage checklist', 'Log + packet correlation', 'Cold-read incident notes'],
    links: [
      { href: '/lab/incident-note-drill', label: 'Incident drill lab' },
      { href: '/knowledge/from-logs-to-findings', label: 'Triage write-up' },
    ],
  },
  {
    id: 'response',
    n: '05',
    label: 'Response',
    title: 'Humans approve, tools assist',
    body: 'Automation enriches; humans contain. Every defensive action is allowlisted, explicitly approved, and audit-logged — because containment mistakes are worse than slow containment.',
    points: ['Approval-gated actions', 'Fail-closed scope files', 'Immutable audit trail'],
    links: [
      { href: '/projects/secureops', label: 'SecureOps case study' },
      { href: '/projects/jarvis', label: 'Guardrailed AI experiment' },
    ],
  },
  {
    id: 'improvement',
    n: '06',
    label: 'Improvement',
    title: 'Every incident teaches',
    body: 'Findings feed back into rules, baselines and runbooks. The journal preserves the reference evidence for the lab — each entry informs the next detection and response review.',
    points: ['Runbooks rewritten after incidents', 'Baselines re-snapshotted', 'Knowledge base grows'],
    links: [
      { href: '/lab', label: 'Lab journal' },
      { href: '/knowledge', label: 'Knowledge base' },
    ],
  },
];

export default function SocPipeline() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((a) => (a + 1) % stages.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((a) => (a - 1 + stages.length) % stages.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(stages.length - 1);
    }
  }

  return (
    <div className="soc">
      <div className="soc-stages" role="tablist" aria-label="Security operations loop" onKeyDown={onKeyDown}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === active}
            aria-controls="soc-panel"
            id={`soc-tab-${s.id}`}
            tabIndex={i === active ? 0 : -1}
            className="soc-stage"
            onClick={() => setActive(i)}
          >
            <span className="n" aria-hidden="true">{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div
        className="soc-panel"
        role="tabpanel"
        id="soc-panel"
        aria-labelledby={`soc-tab-${stage.id}`}
      >
        <div>
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
          <div className="soc-links">
            {stage.links.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
        <ul className="soc-list">
          {stage.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
