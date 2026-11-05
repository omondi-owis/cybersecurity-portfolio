/**
 * Security Lab journal — structured defensive-lab entries.
 * Every entry follows: objective → environment → method → evidence →
 * observations → analysis → findings → mitigation → lessons.
 * All targets are lab-owned; all identifiers sanitized.
 */

export interface Lab {
  slug: string;
  title: string;
  category: string;
  difficulty: 'Guided' | 'Intermediate' | 'Advanced';
  minutes: number;
  date: string;
  objective: string;
  environment: string[];
  method: string[];
  evidence: string[];
  observations: string[];
  analysis: string;
  findings: string[];
  mitigation: string[];
  lessons: string[];
  tags: string[];
}

export const labs: Lab[] = [
  {
    slug: 'ssh-auth-investigation',
    title: 'SSH Authentication Investigation',
    category: 'Log analysis',
    difficulty: 'Guided',
    minutes: 25,
    date: '2026-03-14',
    objective: 'Reconstruct an SSH brute-force attempt against the lab Ubuntu host purely from auth logs, then verify the Wazuh rule fires.',
    environment: ['Ubuntu Server (target, Wazuh agent)', 'Kali (authorized tester)', 'Wazuh manager'],
    method: [
      'Snapshotted the target; confirmed key-only SSH and UFW baseline.',
      'From Kali, ran a small, time-boxed password-spray against the lab target (owned system, documented window).',
      'Collected /var/log/auth.log for the window; queried Wazuh alerts for the same period.',
      'Built a minute-by-minute timeline of attempts, source, and resulting rule matches.',
    ],
    evidence: [
      'auth.log excerpt: repeated "Failed password" lines from one lab IP (sanitized).',
      'Wazuh alert 5712 (sshd brute force) with aggregated count and source.',
      'Timeline table mapping each attempt burst to its alert.',
    ],
    observations: [
      'Attempts arrived in bursts of ~6/minute from a single source.',
      'No successful login occurred; key-only auth held.',
      'Wazuh fired once with aggregation rather than per-attempt — correct behavior.',
    ],
    analysis:
      'The pattern matches opportunistic password-spraying: many usernames, few passwords, single source. Because the host enforces key-only auth, the residual risk is log noise and resource burn rather than compromise — but the same pattern against a password-enabled host would be critical.',
    findings: [
      'Detection works: rule 5712 fired within the test window with correct attribution.',
      'Control works: key-only SSH made the attack class ineffective by design.',
      'Gap: no automatic triage note — investigation was fully manual.',
    ],
    mitigation: [
      'Kept key-only SSH and documented it as the primary control.',
      'Added SecureOps triage helper to auto-enrich future 5712 alerts with host context.',
      'Recorded threshold note: >5 failures/5 min from one source = investigate.',
    ],
    lessons: [
      'Aggregation in the SIEM is a feature: one good alert beats fifty noisy ones.',
      'Time-boxed tests make timelines trivial — always record the window before testing.',
    ],
    tags: ['SSH', 'Wazuh', 'Log analysis', 'Brute force'],
  },
  {
    slug: 'linux-hardening-baseline',
    title: 'Ubuntu Hardening Baseline',
    category: 'Hardening',
    difficulty: 'Intermediate',
    minutes: 40,
    date: '2026-02-22',
    objective: 'Define and verify a repeatable hardening baseline for lab Ubuntu hosts, with checks that can be re-run after every exercise.',
    environment: ['Ubuntu Server 22.04 (fresh VM)', 'Bash checklist script (read-only checks)'],
    method: [
      'Installed minimal server; created non-root sudo user; disabled root SSH.',
      'Enforced key-only SSH; verified with a password-attempt test.',
      'Enabled UFW default-deny; added only documented allowances.',
      'Enabled unattended security upgrades; configured log retention.',
      'Wrote a read-only verification script that reports pass/fail per control.',
    ],
    evidence: [
      'sshd_config diff: PasswordAuthentication no, PermitRootLogin no.',
      'ufw status verbose output (sanitized).',
      'Verification script output: 14/14 checks passing.',
    ],
    observations: [
      'Default install had no firewall active and password SSH permitted.',
      'Unattended upgrades needed explicit enabling — not default.',
      'The check script caught a missed sysctl setting on first run.',
    ],
    analysis:
      'A fresh install is functional but not defensible. Each control is individually small; the security comes from applying all of them consistently and verifying mechanically rather than from memory.',
    findings: [
      'Baseline of 14 verifiable controls established and snapshotted.',
      'Manual hardening missed 1 control; scripted verification caught it.',
    ],
    mitigation: [
      'Snapshot the hardened baseline as the restore point for all future exercises.',
      'Re-run the verification script weekly and after every change.',
    ],
    lessons: ['Verify, don\'t trust: a 30-line check script beats a confident memory.', 'Baselines compound — every future exercise starts from known-good.'],
    tags: ['Linux', 'Hardening', 'SSH', 'UFW'],
  },
  {
    slug: 'wazuh-deployment-tuning',
    title: 'Wazuh Deployment & First Tuning Pass',
    category: 'SIEM',
    difficulty: 'Intermediate',
    minutes: 60,
    date: '2026-04-05',
    objective: 'Deploy Wazuh, enroll lab agents, survive the first alert storm, and produce a tuned ruleset with a documented false-positive rationale.',
    environment: ['Wazuh manager (VM)', 'Ubuntu + Kali agents', 'File integrity + auth monitoring'],
    method: [
      'Deployed manager; enrolled two agents; confirmed heartbeat and inventory.',
      'Enabled syscheck (FIM), rootcheck policy checks, and auth log decoders.',
      'Ran one week of normal lab activity; exported all alerts by rule.',
      'Ranked rules by volume; investigated top 5; tuned thresholds and filters.',
      'Re-ran lab activity; compared before/after volumes per rule.',
    ],
    evidence: [
      'Agent inventory screenshot (sanitized hostnames).',
      'Before/after alert counts per rule (table).',
      'Tuning journal: rule, change, rationale, date.',
    ],
    observations: [
      'FIM noise and authorized scan traffic are useful starting points for investigating high-volume rules; publish per-rule counts before stating their share of total volume.',
      'My own authorized scans looked identical to hostile recon in raw alerts.',
      'Severity defaults needed lab-context adjustment, not blind acceptance.',
    ],
    analysis:
      'Default SIEM content is a starting point, not a finished detection posture. Tuning is risk work: each suppression must argue why the signal is safe to quiet in this environment — otherwise tuning becomes blinding.',
    findings: [
      'Measured alert reduction and detection re-test results are pending publication of the supporting evidence.',
      'Exercise time-windows let me label self-generated recon vs. unknown activity.',
    ],
    mitigation: [
      'Kept tuning journal as a living doc; every suppression has rationale + reviewer (me) + date.',
      'Scheduled monthly re-validation: re-trigger each tuned rule to prove it still fires.',
    ],
    lessons: ['Tune with evidence, not annoyance: measure first, suppress with rationale.', 'Your own tests are the best tuning data — if you label them.'],
    tags: ['Wazuh', 'SIEM', 'Detection engineering', 'Tuning'],
  },
  {
    slug: 'ufw-firewall-design',
    title: 'UFW Firewall Design & Lockout Recovery',
    category: 'Network defense',
    difficulty: 'Guided',
    minutes: 30,
    date: '2026-01-28',
    objective: 'Design a default-deny UFW policy for the lab server, verify it, and document the lockout I caused — plus the recovery.',
    environment: ['Ubuntu Server (console access available)', 'UFW', 'Nmap from Kali (authorized)'],
    method: [
      'Listed required services and their ports; wrote the allow-list on paper first.',
      'Set default deny incoming / allow outgoing; added explicit allows.',
      'Enabled UFW — and locked myself out (SSH allow added after enable).',
      'Recovered via console; reordered rules; re-enabled safely.',
      'Verified externally with an authorized Nmap scan from Kali.',
    ],
    evidence: [
      'ufw status numbered (sanitized).',
      'Nmap result: only expected ports open.',
      'Lockout timeline: what I ran, what broke, how I recovered.',
    ],
    observations: [
      'Rule order and enable-sequence matter more than rule content.',
      'Console access is the safety net that makes firewall work non-terrifying.',
      'External verification caught nothing extra — but proved the policy.',
    ],
    analysis:
      'The lockout was the lesson: firewall changes are exactly the kind of operation that needs a written sequence and a rollback path. "Allow SSH first, then enable" is now a runbook line, not a memory.',
    findings: ['Policy verified externally: attack surface equals documented allows, nothing more.', 'Lockout root cause: enable-before-allow sequencing error.'],
    mitigation: ['Firewall runbook: console check → allow SSH → enable → verify externally.', 'Never change firewall rules over the only path they protect.'],
    lessons: ['Write the sequence before running it. Firewalls punish improvisation.', 'Document failures — the lockout taught more than the success.'],
    tags: ['UFW', 'Firewall', 'Networking', 'Runbooks'],
  },
  {
    slug: 'nmap-authorized-recon',
    title: 'Authorized Nmap Inventory vs. Baseline',
    category: 'Recon (authorized)',
    difficulty: 'Guided',
    minutes: 30,
    date: '2026-05-10',
    objective: 'Inventory lab targets with Nmap and compare against the documented port baseline — any delta is a finding.',
    environment: ['Kali (scanner)', 'Ubuntu target (owned)', 'Scope file + baseline doc'],
    method: [
      'Wrote scope file: targets, window, scan types, output location.',
      'Ran service/version inventory scan against lab targets only.',
      'Diffed results against the baseline port list.',
      'Investigated one unexpected open port (forgotten test service).',
      'Closed it, rescanned, confirmed baseline restored.',
    ],
    evidence: ['Scope file.', 'Nmap output (sanitized IPs).', 'Baseline diff showing the rogue port, then clean rescan.'],
    observations: [
      'One forgotten test web server was listening — exactly the drift baselines exist to catch.',
      'Version detection flagged an outdated service needing a patch check.',
    ],
    analysis:
      'Recon against your own systems is an audit, not an attack. The value is entirely in the baseline comparison — a port list without an expected state is trivia; with one, it is a control.',
    findings: ['Rogue test service found and removed; baseline restored and verified.', 'One service flagged for update review.'],
    mitigation: ['Monthly authorized rescan scheduled; diffs go to the journal.', 'Test services now require a dated teardown note when started.'],
    lessons: ['Baselines turn scans into controls.', 'Scope files make authorized work provably authorized.'],
    tags: ['Nmap', 'Recon', 'Baselines', 'Audit'],
  },
  {
    slug: 'wireshark-ssh-analysis',
    title: 'Wireshark: Reading an SSH Session on the Wire',
    category: 'Packet analysis',
    difficulty: 'Intermediate',
    minutes: 35,
    date: '2026-05-24',
    objective: 'Capture lab SSH traffic and identify handshake, authentication phases, and failure patterns — without decrypting anything.',
    environment: ['Kali + Wireshark', 'Ubuntu target', 'Isolated lab network'],
    method: [
      'Captured a successful key-auth SSH session; annotated handshake and auth phases.',
      'Captured a failed password attempt; compared packet patterns.',
      'Captured the brute-force test window; identified burst signature.',
      'Wrote display-filter notes for each pattern.',
    ],
    evidence: ['Annotated capture notes (sanitized).', 'Display filters: ssh + tcp.analysis patterns.', 'Side-by-side success vs. failure flow summary.'],
    observations: [
      'Encrypted payload hides content but not behavior: timing, size and direction tell the story.',
      'Failed auth shows a distinct short-session pattern vs. long-lived successful sessions.',
      'Brute-force bursts are visually obvious even before statistical analysis.',
    ],
    analysis:
      'Encryption protects content, not metadata. For defenders, that is enough: session shape, failure rate and timing are robust detection features that work without decryption.',
    findings: ['Three recognizable SSH patterns documented with filters.', 'Burst signature matches the earlier auth.log timeline — two independent confirmations.'],
    mitigation: ['Added capture-pattern notes to the SOC triage helper for SSH investigations.', 'Kept pcaps in lab-only storage with sanitized shared notes.'],
    lessons: ['You rarely need to decrypt to detect.', 'Two independent evidence sources (logs + packets) make findings solid.'],
    tags: ['Wireshark', 'SSH', 'Packets', 'Analysis'],
  },
  {
    slug: 'detection-rule-lifecycle',
    title: 'Detection Rule Lifecycle: Write → Trigger → Tune',
    category: 'Detection engineering',
    difficulty: 'Advanced',
    minutes: 50,
    date: '2026-06-15',
    objective: 'Take one detection (new sudo user created) through the full lifecycle with proof it fires and proof it stays quiet normally.',
    environment: ['Wazuh manager + Ubuntu agent', 'Test user operations in a labeled window'],
    method: [
      'Wrote the rule: alert on new UID-0-capable account or sudoers change.',
      'Tested in a labeled window: created a test sudo user; confirmed the alert.',
      'Removed the test user; confirmed no further firing over 7 days.',
      'Documented true-positive proof and silence proof side by side.',
      'Mapped the rule to ATT&CK persistence concepts in the tuning journal.',
    ],
    evidence: ['Rule definition.', 'Alert for the test creation event.', '7-day silence confirmation query.', 'Cleanup verification.'],
    observations: ['Rule fired on first test with correct fields.', 'No noise over the silence window — high-signal rule.', 'Cleanup verification mattered: leftover test accounts are real risk.'],
    analysis:
      'A detection is a hypothesis with two burdens of proof: it fires when it should (sensitivity) and stays quiet when nothing is wrong (specificity). Most lab rules only ever prove the first half.',
    findings: ['Rule validated both directions; promoted to the permanent ruleset.', 'ATT&CK mapping recorded for future coverage work.'],
    mitigation: ['Test accounts now carry expiry notes; cleanup verified, not assumed.', 'Rule added to monthly re-validation schedule.'],
    lessons: ['Silence proof is half of detection engineering.', 'Test artifacts are attack surface — clean up like it matters.'],
    tags: ['Detection', 'Wazuh', 'ATT&CK', 'Validation'],
  },
  {
    slug: 'incident-note-drill',
    title: 'Incident Note Drill: From Alert to Written Finding',
    category: 'Incident handling',
    difficulty: 'Intermediate',
    minutes: 40,
    date: '2026-07-06',
    objective: 'Practice the full triage loop on a lab alert and produce an incident note good enough that future-me could act on it cold.',
    environment: ['Wazuh alert queue', 'Ubuntu target logs', 'Incident note template'],
    method: [
      'Picked a real lab alert (after-hours sudo usage during an exercise).',
      'Followed the triage checklist: scope, timeline, evidence, blast radius.',
      'Wrote the incident note: summary, timeline, evidence, disposition, follow-ups.',
      'Had the note "reviewed" against a quality checklist (cold-read test).',
      'Filed it with a disposition: true positive (authorized exercise) with tuning note.',
    ],
    evidence: ['Original alert.', 'Timeline reconstruction.', 'Final incident note (sanitized).', 'Quality-checklist score.'],
    observations: [
      'First draft was missing the timeline — the single most useful section.',
      'Writing forced two follow-up checks I would have skipped mentally.',
      'Disposition wording matters: "authorized exercise, detection confirmed working."',
    ],
    analysis:
      'Triage converts alerts into decisions, and notes convert decisions into organizational memory. The drill exposed that my first-pass notes answer "what happened" but under-serve "what should the next person do."',
    findings: ['Incident note template improved: timeline and next-actions are now required sections.', 'Detection confirmed working; no control change needed.'],
    mitigation: ['Updated template; back-filled timeline sections on two older notes.', 'Added cold-read test to the triage checklist.'],
    lessons: ['Write for the next responder, not for yourself.', 'Templates enforce quality under time pressure.'],
    tags: ['Incident response', 'Triage', 'Documentation', 'SOC'],
  },
];

export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}

export const labSlugs: string[] = labs.map((l) => l.slug);