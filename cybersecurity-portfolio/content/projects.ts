/**
 * Projects — data-driven case studies.
 * Adding a project = adding one object here. No app rewrite needed.
 *
 * HONESTY RULE: repo/demo URLs are empty until the owner configures them.
 * The UI hides missing links instead of inventing destinations.
 */

export interface Project {
  slug: string;
  title: string;
  codename?: string;
  category: string;
  status: string;
  statusTone: 'active' | 'building' | 'research' | 'academic' | 'ongoing';
  featured: boolean;
  summary: string;
  problem: string;
  motivation: string;
  stack: string[];
  architecture: { name: string; detail: string }[];
  architectureNote: string;
  implementation: string[];
  security: string[];
  challenges: string[];
  decisions: { decision: string; reason: string }[];
  lessons: string[];
  future: string[];
  tags: string[];
  /** Empty until owner sets the real repo URL. */
  github: string;
  demo: string;
  docs: string;
}

export const projects: Project[] = [
  {
    slug: 'mlinziops',
    title: 'MlinziOps',
    codename: 'Personal Security Operations Project',
    category: 'Security Operations • Infrastructure',
    status: 'In development',
    statusTone: 'building',
    featured: true,
    summary:
      'A personal security-operations environment: a hardened Ubuntu host, GitHub-driven deploys, private remote access, and monitoring wired in from day one. Built to practice operating infrastructure the way a small security-conscious team would.',
    problem:
      'Tutorials teach tools in isolation; real operations fail at the seams — deploys, access, patching, logging and recovery. I needed one environment where all of those decisions exist together and can be reviewed honestly.',
    motivation:
      'To stop treating "deployment" as an afterthought and start treating operations as a security discipline: every open port justified, every access path private, every change traceable to a commit.',
    stack: ['Ubuntu Server', 'Bash', 'Git & GitHub Actions', 'Tailscale', 'UFW', 'systemd', 'Wazuh agent'],
    architecture: [
      { name: 'Source', detail: 'GitHub repository. All changes via commits; no ad-hoc edits on the server.' },
      { name: 'Delivery', detail: 'Small deploy pipeline (pull or action-driven) with a restart-and-verify step.' },
      { name: 'Host', detail: 'Hardened Ubuntu: non-root user, key-only SSH, UFW default-deny, unattended upgrades.' },
      { name: 'Access', detail: 'Private overlay network (Tailscale). No SSH or admin ports exposed to the internet.' },
      { name: 'Visibility', detail: 'System + auth logs collected; Wazuh agent forwards telemetry to the lab SIEM.' },
    ],
    architectureNote:
      'Diagram is illustrative and sanitized. Hostnames, addresses, keys and network identifiers are never published.',
    implementation: [
      'Provisioned Ubuntu with a non-root sudo user; disabled password SSH authentication entirely.',
      'Configured UFW default-deny with only explicitly justified allowances, documented in the repo.',
      'Joined the host to a private Tailscale network so administration never traverses the public internet.',
      'Set up unattended security upgrades plus a weekly manual review of pending updates.',
      'Created a deploy path from GitHub so the server state always traces back to a reviewed commit.',
      'Installed and enrolled a Wazuh agent to forward auth, system and file-integrity telemetry.',
      'Wrote runbooks: deploy, rollback, rotate keys, investigate an alert, rebuild from scratch.',
    ],
    security: [
      'Key-only SSH, root login disabled, fail-safe firewall ordering verified before enabling.',
      'Zero inbound admin ports on the public interface; administration over the private mesh only.',
      'Secrets live in environment files on the host — never in git; .env.example documents shape only.',
      'Services run as unprivileged users with minimal filesystem permissions.',
      'Audit trail: auth logs, sudo usage and deploy events are all retained and reviewable.',
    ],
    challenges: [
      'Early firewall lockout taught me to always verify allow-rules and keep console access before enabling UFW.',
      'Balancing unattended upgrades (patch fast) against unplanned restarts (stability) — solved with maintenance windows.',
      'Keeping runbooks honest: rewriting them after every real incident instead of describing an ideal flow.',
    ],
    decisions: [
      { decision: 'Private mesh over public SSH', reason: 'Removes the most-scanned port on the internet from the attack surface entirely.' },
      { decision: 'Git-traced deploys over manual edits', reason: 'Every server change becomes reviewable, revertable and attributable.' },
      { decision: 'Agent-based telemetry from day one', reason: 'You cannot detect what you never collected; logging is a prerequisite, not a phase two.' },
    ],
    lessons: [
      'Operations is security: patching, access and logging decisions matter more than any single tool.',
      'Small, documented infrastructure beats ambitious, undocumented infrastructure.',
      'Rebuildability is the real backup strategy — I test rebuilding, not just restoring.',
    ],
    future: [
      'Signed, versioned releases with changelog per deploy.',
      'Centralized alert routing with severity tuning to kill noise.',
      'Periodic restore drill: wipe and rebuild from repo + secrets backup.',
    ],
    tags: ['SOC', 'Linux', 'Hardening', 'Tailscale', 'Wazuh', 'DevSecOps'],
    github: '',
    demo: '',
    docs: '',
  },
  {
    slug: 'secureops',
    title: 'SecureOps',
    codename: 'Security Monitoring & Defensive Automation Platform',
    category: 'Detection Engineering • SIEM',
    status: 'In development',
    statusTone: 'building',
    featured: true,
    summary:
      'A security-operations workspace: Linux telemetry collection, Wazuh-backed detection, authorized reconnaissance records, incident notes and audit-logged defensive automation — one loop from signal to documented response.',
    problem:
      'Lab alerts without workflow are just noise. I wanted a place where a detection becomes a triaged, investigated, documented incident — with automation that is fenced in by authorization and audit logging.',
    motivation:
      'To practice detection engineering end-to-end: write the rule, trigger it safely, triage it, tune it, and prove the improvement with before/after evidence.',
    stack: ['Python', 'Wazuh / SIEM', 'Linux (journald, auditd)', 'Bash', 'Nmap (authorized)', 'REST APIs'],
    architecture: [
      { name: 'Collect', detail: 'Linux hosts ship auth, system and audit telemetry via agents and syslog.' },
      { name: 'Detect', detail: 'Wazuh rules + custom detection logic map telemetry to alerts with severity.' },
      { name: 'Triage', detail: 'Alert queue: acknowledge, investigate, link evidence, disposition (true/false positive).' },
      { name: 'Respond', detail: 'Approved defensive actions only (block IP via firewall, isolate note, rotate credential) — each gated and logged.' },
      { name: 'Learn', detail: 'Findings feed tuning: thresholds, allowlists and new rules with dated rationale.' },
    ],
    architectureNote:
      'All reconnaissance targets are lab systems I own. No third-party scanning, ever — scope is documented per engagement.',
    implementation: [
      'Deployed Wazuh manager and enrolled lab agents (Ubuntu + Kali) with file-integrity and auth monitoring.',
      'Wrote custom rules for SSH brute-force patterns, new sudo users and unexpected outbound connections.',
      'Built a Python triage helper: pulls alerts, enriches with host context, generates an investigation checklist.',
      'Created an authorized-recon log: target, scope document, command, time window and output location.',
      'Added audit logging to every helper script: who ran what, against which scope, with what result.',
      'Tuned noisy rules over two weeks; tracked false-positive rate per rule in a tuning journal.',
    ],
    security: [
      'Recon helpers refuse to run without a scope file naming owned lab targets — fail-closed by default.',
      'Automation allowlists exact commands; no shell passthrough of alert-derived strings (injection-safe).',
      'Every defensive action requires explicit approval input and writes an immutable audit entry.',
      'API keys and credentials via environment only; scripts abort loudly when secrets are missing.',
      'Least privilege: lab service accounts can read telemetry but cannot alter firewall rules directly.',
    ],
    challenges: [
      'Alert fatigue in week one: three noisy rules produced 80% of volume — fixed with thresholds and context filters.',
      'Correlating auth failures across hosts required normalizing timestamps — solved with UTC-everywhere discipline.',
      'Resisting over-automation: response actions stay human-approved; only enrichment is fully automatic.',
    ],
    decisions: [
      { decision: 'Wazuh as the SIEM core', reason: 'Open, well-documented, agent-based — ideal for learning real detection workflows on lab hardware.' },
      { decision: 'Fail-closed scope enforcement', reason: 'A recon tool that runs without scope is a liability; refusal is the safe default.' },
      { decision: 'Human approval for all response actions', reason: 'Automation proposes, humans dispose — containment mistakes are worse than slow containment.' },
    ],
    lessons: [
      'Detection engineering is mostly tuning: the rule is 20% of the work, the other 80% is killing noise without blinding yourself.',
      'An incident without notes is an anecdote; with notes it becomes reusable knowledge.',
      'Audit logging changes behavior — knowing an action is recorded makes every action more deliberate.',
    ],
    future: [
      'MITRE ATT&CK mapping per rule with coverage heatmap.',
      'Scheduled detection-validation: safely re-trigger each rule monthly to prove it still fires.',
      'Report generator: weekly one-page SOC summary from triage data.',
    ],
    tags: ['Wazuh', 'Detection', 'Python', 'SIEM', 'Incident response', 'Audit logging'],
    github: '',
    demo: '',
    docs: '',
  },
  {
    slug: 'jarvis',
    title: 'J.A.R.V.I.S.',
    codename: 'Private AI-Assisted Operations Experiment',
    category: 'AI Orchestration • Guardrailed Automation',
    status: 'Private experiment',
    statusTone: 'research',
    featured: true,
    summary:
      'A strictly fenced experiment: an AI assistant that can propose infrastructure and security operations — but may only execute pre-approved, least-privilege tools behind human approval gates, with every step audit-logged.',
    problem:
      'AI assistants are powerful operators and terrible gatekeepers. I wanted to test whether AI help could exist inside a control frame strong enough that a confused or misled model still cannot cause harm.',
    motivation:
      'To learn AI-orchestration security by building the guardrails first: authorization, approval, least privilege and audit — and treating the model as untrusted input.',
    stack: ['Python', 'Tool-use orchestration', 'Allowlisted shell tools', 'Approval gates', 'Audit log (JSONL)'],
    architecture: [
      { name: 'Ask', detail: 'Operator states intent in natural language; model drafts a plan — plans are text, not execution.' },
      { name: 'Constrain', detail: 'Only tools on an explicit allowlist exist (read log, check service, lint config). No general shell.' },
      { name: 'Approve', detail: 'Every tool call renders as a diff-like preview requiring explicit human approval.' },
      { name: 'Execute', detail: 'Approved calls run as an unprivileged user with timeouts and output caps.' },
      { name: 'Record', detail: 'Prompt, plan, approval decision, command, output hash and result append to JSONL audit log.' },
    ],
    architectureNote:
      'The model has no credentials, no network egress beyond the lab, and no standing permissions. Deny-by-default at every layer.',
    implementation: [
      'Defined a tool manifest: 8 read-mostly tools with fixed argument schemas validated before execution.',
      'Built the approval gate: each proposed call prints command + risk note and waits for typed approval.',
      'Ran tools under a dedicated unprivileged account with a 30-second timeout and 64 KB output cap.',
      'Logged every interaction as append-only JSONL with timestamps; tested tamper-evidence via hash chaining.',
      'Red-teamed my own setup: prompt-injection attempts ("ignore previous instructions") must fail to escalate.',
      'Documented refusals: cases where the harness correctly declined are recorded as positive results.',
    ],
    security: [
      'Model output is treated as untrusted: never executed, only proposed; schemas reject anything unexpected.',
      'No secrets in context: credentials are never pasted into prompts; tools use server-side env only.',
      'Egress control: the harness host has no route to the internet beyond package updates.',
      'Human-in-the-loop is non-bypassable: no --auto-approve flag exists in the codebase.',
      'Full audit trail enables after-action review of every AI-suggested operation.',
    ],
    challenges: [
      'Models constantly propose plausible-but-forbidden commands — the allowlist had to reject gracefully with explanations.',
      'Prompt injection via log content (malicious strings inside logs the model reads) — mitigated by output framing and read-only tools.',
      'Keeping the toolset small: every new tool multiplies review burden, so additions require a written justification.',
    ],
    decisions: [
      { decision: 'Read-mostly toolset', reason: 'Observation is safe to accelerate; mutation stays manual until controls are proven.' },
      { decision: 'No auto-approve, ever', reason: 'The moment approval is skippable, the entire control frame is theater.' },
      { decision: 'Hash-chained audit log', reason: 'Experiments about trust need evidence that survives the experiment.' },
    ],
    lessons: [
      'AI safety is a systems problem: the harness matters more than the model.',
      'Refusals are features — I now count and celebrate correctly-refused actions.',
      'Small allowlists beat clever prompts: enforcement beats instruction.',
    ],
    future: [
      'Second-approver mode for medium-risk tools (two humans, one action).',
      'Replay mode: re-run any audit entry in dry-run to verify reproducibility.',
      'Publish the harness design (sanitized) as a reference for safe lab AI use.',
    ],
    tags: ['AI safety', 'Python', 'Least privilege', 'Audit logging', 'Prompt injection'],
    github: '',
    demo: '',
    docs: '',
  },
  {
    slug: 'smartrecovery',
    title: 'SmartRecovery',
    codename: 'Automated Alert System for Short-Window Food Donation Logistics — Academic Capstone',
    category: 'Full-Stack • Academic Project',
    status: 'Academic — complete',
    statusTone: 'academic',
    featured: false,
    summary:
      'University capstone: when a donor posts surplus food with a short expiry window, nearby recipients get instant alerts on a live map and can claim and coordinate pickup before the food spoils.',
    problem:
      'Good food is thrown away daily because donation logistics move slower than spoilage. Donors, recipients and volunteers lack a shared, real-time coordination channel for time-critical pickups.',
    motivation:
      'To prove I can take a real-world problem from requirements to deployed full-stack system: data model, auth, realtime, maps and a demo-able workflow — built like software that must actually run.',
    stack: ['Node.js', 'Express', 'MongoDB', 'React', 'Vite', 'JWT', 'Socket.IO', 'Leaflet'],
    architecture: [
      { name: 'Client', detail: 'React + Vite SPA: donation feed, Leaflet map, claim flow, realtime toasts.' },
      { name: 'Realtime', detail: 'Socket.IO rooms per region so alerts reach only nearby recipients.' },
      { name: 'API', detail: 'Express REST: auth, donations, claims, users — validated and rate-limited.' },
      { name: 'Data', detail: 'MongoDB: users, donations with geo + expiry, claims with state machine.' },
    ],
    architectureNote:
      'Academic project: built to demonstrate software-engineering competence, with security basics applied throughout.',
    implementation: [
      'Modeled donations with geo-coordinates, quantity, pickup window and expiry; TTL-adjacent logic surfaces urgency.',
      'Implemented JWT auth with hashed passwords (bcrypt), protected routes and role checks (donor/recipient/admin).',
      'Built Socket.IO alert rooms keyed by area so a new donation notifies the right recipients instantly.',
      'Rendered live donation map with Leaflet: markers colored by urgency, popups with claim actions.',
      'Designed claim state machine (available → claimed → picked-up / expired) to prevent double-claims.',
      'Validated all inputs server-side; centralized error handler returns safe, generic messages.',
    ],
    security: [
      'Passwords hashed with bcrypt; JWTs short-lived and stored outside localStorage where feasible.',
      'Authorization checks on every mutation: users can only modify their own donations/claims.',
      'Input validation on all endpoints; NoSQL-injection-safe queries (no raw $where, typed schemas).',
      'Rate limiting on auth endpoints to blunt credential-stuffing and brute force.',
      'Least-data principle: location precision limited to what pickup coordination actually needs.',
    ],
    challenges: [
      'Double-claim races under realtime load — solved with atomic claim updates and state validation.',
      'Map + realtime performance on low-end phones — marker clustering and room-scoped events.',
      'Expiry edge cases (claim at the last minute) — explicit expired-state handling with user messaging.',
    ],
    decisions: [
      { decision: 'Socket.IO rooms per area', reason: 'Broadcasting every donation to every user would not scale and would leak location data.' },
      { decision: 'Claim state machine', reason: 'Explicit states eliminated an entire class of race and double-spend bugs.' },
      { decision: 'Leaflet over paid map SDKs', reason: 'Free, open, and fully sufficient for marker + radius workflows.' },
    ],
    lessons: [
      'Realtime features multiply edge cases — state machines are worth the upfront design.',
      'Security basics (auth, validation, rate limits) are cheaper during construction than after.',
      'A capstone is a deadline-driven lesson in scope control: I cut two features to ship one great flow.',
    ],
    future: [
      'SMS fallback for recipients without smartphones (with opt-in consent).',
      'Donor analytics: spoilage prevented, average claim time.',
      'Hardening pass: security headers, CSRF review, dependency audit.',
    ],
    tags: ['Node.js', 'React', 'MongoDB', 'Socket.IO', 'Leaflet', 'JWT'],
    github: '',
    demo: '',
    docs: '',
  },
  {
    slug: 'security-lab',
    title: 'Security Lab',
    codename: 'Kali → Ubuntu → Wazuh Defensive Laboratory',
    category: 'Lab • Defensive Testing',
    status: 'Ongoing',
    statusTone: 'ongoing',
    featured: true,
    summary:
      'My hands-on lab: Kali for authorized testing, Ubuntu Server as the defended target, Wazuh SIEM watching everything. Every exercise ends in notes — objective, method, evidence, findings, mitigation.',
    problem:
      'Reading about attacks teaches vocabulary; defending requires reps. I needed a safe, repeatable range where I can attack my own systems, watch detection fire, then fix and re-test.',
    motivation:
      'To build defensive intuition through controlled offense: each technique I test becomes a detection I write and a hardening step I document.',
    stack: ['Kali Linux', 'Ubuntu Server', 'Wazuh', 'Wireshark', 'Nmap (authorized)', 'UFW', 'Virtualization'],
    architecture: [
      { name: 'Attack (Kali)', detail: 'Authorized testing tools against lab targets only. Scope file required per exercise.' },
      { name: 'Target (Ubuntu)', detail: 'Hardened server with agents: the system under test and under protection.' },
      { name: 'Watch (Wazuh)', detail: 'SIEM collects agent + network telemetry; rules fire; I triage and tune.' },
      { name: 'Record', detail: 'Every exercise produces a journal entry: evidence, analysis, mitigation, lessons.' },
    ],
    architectureNote:
      'Host-only / NAT lab networking. Lab systems are isolated; no lab traffic targets external networks.',
    implementation: [
      'Built isolated lab networking so test traffic cannot leak beyond owned virtual machines.',
      'Hardened the Ubuntu target progressively: each exercise starts from a known-baseline snapshot.',
      'Ran authorized Nmap inventories of lab targets; recorded open ports vs. expected baseline.',
      'Captured SSH and web traffic in Wireshark to study handshakes, failures and anomalies.',
      'Deployed Wazuh agents; wrote and tuned rules for brute-force, new-user and FIM events.',
      'Practiced log-driven investigation: alert → raw logs → timeline → finding → mitigation note.',
    ],
    security: [
      'Strict scope discipline: only lab-owned systems are ever tested; scope noted per exercise.',
      'Snapshots before offensive exercises so targets restore to known-good state.',
      'No real credentials in lab notes; all evidence excerpts are sanitized before publishing.',
      'Lab credentials unique to the lab and rotated after shared-screen demos.',
      'Testing tools never installed on production or shared systems.',
    ],
    challenges: [
      'Noisy first Wazuh week: default rules + lab scanning = alert storm; tuning journal fixed it.',
      'Distinguishing my own test traffic from genuinely suspicious patterns — solved with exercise time-windows.',
      'Keeping journal quality high when an exercise "fails" — failed detections became the best entries.',
    ],
    decisions: [
      { decision: 'Snapshot-driven exercises', reason: 'Repeatability: any exercise can be re-run from the same baseline to verify a fix.' },
      { decision: 'Defense-first framing', reason: 'Every offensive test must end in a defensive artifact: rule, patch, or hardening note.' },
      { decision: 'Sanitized public notes', reason: 'Evidence is shared for learning; identifiers that aid attackers are never shared.' },
    ],
    lessons: [
      'Detection is a hypothesis until tested — I re-run attacks after tuning to prove the rule fires.',
      'Baselines are everything: you cannot spot "unusual" without documented "usual".',
      'The journal is the lab\'s real output; the VMs are just where the learning happens.',
    ],
    future: [
      'Add a Windows target VM for cross-platform telemetry (Sysmon + Wazuh).',
      'Automated exercise runner: snapshot → attack → collect → restore.',
      'Publish a sanitized rule pack with tuning notes for other learners.',
    ],
    tags: ['Kali', 'Wazuh', 'Wireshark', 'Nmap', 'Hardening', 'Blue team'],
    github: '',
    demo: '',
    docs: '',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export const projectSlugs: string[] = projects.map((p) => p.slug);
