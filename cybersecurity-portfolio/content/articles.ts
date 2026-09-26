/**
 * Knowledge base — long-form technical writing.
 * Structured sections power the table of contents, reading-time
 * estimates and related-article linking. Data-driven: add one
 * object to publish (feature it by setting featured: true).
 */

export interface ArticleCode {
  lang: string;
  caption?: string;
  code: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
  code?: ArticleCode;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updated?: string;
  minutes: number;
  featured: boolean;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'threat-modeling-personal-projects',
    title: 'Threat Modeling for Personal Projects: A Practical Minimum',
    excerpt:
      'You do not need a formal framework to think like an attacker about your own systems. Five questions, one diagram, and a controls list you will actually maintain.',
    category: 'Cybersecurity',
    tags: ['Threat modeling', 'Architecture', 'Defense in depth'],
    date: '2026-04-18',
    minutes: 9,
    featured: true,
    sections: [
      {
        id: 'why',
        heading: 'Why small projects need threat models',
        paragraphs: [
          'Most personal projects are never attacked by a determined adversary — they are attacked by the entire internet at once: scanners, bots, credential-stuffers and opportunistic exploit kits. A threat model for a personal project is not about nation-states; it is about answering, honestly, what happens when automated attention arrives.',
          'The payoff is prioritization. Without a model, every security task feels equally urgent and nothing gets finished. With one, you know your three real risks and can ignore the other thirty with a clear conscience.',
        ],
      },
      {
        id: 'five-questions',
        heading: 'The five questions',
        paragraphs: [
          'I run every project through the same five questions before I harden anything. They take twenty minutes and prevent weeks of misdirected effort.',
        ],
        list: [
          'What am I protecting? (data, access, availability, reputation — be specific)',
          'Who or what could harm it? (bots, scanners, credential stuffing, my own mistakes)',
          'How would they get in? (draw the paths: every open port, form, API and dependency)',
          'What breaks if they succeed? (blast radius: what does one compromise unlock?)',
          'What is the cheapest control per path? (close, authenticate, validate, limit, log)',
        ],
      },
      {
        id: 'diagram',
        heading: 'Draw one diagram',
        paragraphs: [
          'Text lists hide trust boundaries; diagrams reveal them. My project diagrams always show the same layers: internet, edge, application, API, data — with arrows for every flow and a mark on every boundary where validation or authentication happens.',
          'The rule is simple: any arrow crossing a boundary without a control label is a finding. Fix the diagram first, then fix the system to match.',
        ],
      },
      {
        id: 'controls-list',
        heading: 'Keep a controls list you will maintain',
        paragraphs: [
          'A threat model dies the moment its controls list becomes aspirational. Mine has three columns — control, status, verified — and "verified" requires evidence: a header check, a test log, a screenshot. Unverified controls do not count.',
          'Review the list whenever the system changes: new endpoint, new dependency, new port. Five minutes of review beats five hours of incident response.',
        ],
        code: {
          lang: 'text',
          caption: 'controls.md — living checklist per project',
          code: '| Control                    | Status | Verified    |\n|----------------------------|--------|-------------|\n| TLS everywhere             | done   | header check|\n| Key-only SSH               | done   | login test  |\n| UFW default-deny           | done   | nmap scan   |\n| Rate limit /api/contact    | done   | 429 test    |\n| Dependency audit monthly   | active | ci log      |',
        },
      },
      {
        id: 'closing',
        heading: 'Good enough beats comprehensive',
        paragraphs: [
          'A one-page model you review monthly outperforms a twenty-page model you wrote once. Start with the five questions, draw the diagram, keep the list honest — and let real incidents and lab exercises sharpen it over time.',
        ],
      },
    ],
  },
  {
    slug: 'ubuntu-hardening-checklist',
    title: 'Ubuntu Hardening Checklist I Actually Re-Run',
    excerpt:
      'Fourteen verifiable controls for a fresh Ubuntu host — each with a check command, so hardening is a test suite, not a memory exercise.',
    category: 'Linux',
    tags: ['Linux', 'Hardening', 'SSH', 'UFW'],
    date: '2026-02-25',
    updated: '2026-06-02',
    minutes: 11,
    featured: true,
    sections: [
      {
        id: 'philosophy',
        heading: 'Hardening as a test suite',
        paragraphs: [
          'Every hardening guide is a list of things to do; almost none tell you how to confirm you did them. My checklist pairs each control with a verification command, and a small read-only script runs all checks and reports pass/fail.',
          'This changes hardening from a one-time ritual into a repeatable state I can prove — before exercises, after changes, and during incident review.',
        ],
      },
      {
        id: 'access',
        heading: '1. Access: users and SSH',
        paragraphs: [
          'Access controls are the highest-leverage section: most lab compromises in my exercises trace to credential or SSH misconfiguration, not exotic exploits.',
        ],
        list: [
          'Non-root sudo user created; root password locked.',
          'SSH key-only: PasswordAuthentication no, PermitRootLogin no, ChallengeResponse off.',
          'Login test performed: password attempt must fail, key attempt must succeed.',
        ],
        code: {
          lang: 'bash',
          caption: 'verify-ssh.sh (excerpt)',
          code: 'sshd -T | grep -Ei "^(passwordauthentication|permitrootlogin)"\n# expected:\n# passwordauthentication no\n# permitrootlogin no',
        },
      },
      {
        id: 'network',
        heading: '2. Network: firewall first',
        paragraphs: [
          'UFW default-deny incoming, allow outgoing, with explicit allows added before enabling. The sequence matters: allow SSH first, then enable, then verify externally with an authorized scan — never the reverse order.',
        ],
        code: {
          lang: 'bash',
          caption: 'safe UFW sequence',
          code: 'ufw default deny incoming\nufw default allow outgoing\nufw allow from <admin-net> to any port 22 proto tcp\nufw --dry-run enable   # review first\nufw enable\nufw status verbose',
        },
      },
      {
        id: 'maintenance',
        heading: '3. Maintenance: updates and logs',
        paragraphs: [
          'Unattended security upgrades for patches, plus a weekly manual review so nothing surprises me. Log retention configured so investigations have data: auth, syslog and service journals with rotation that keeps at least 30 days on lab hosts.',
        ],
        list: [
          'unattended-upgrades enabled for security pockets.',
          'Weekly manual update review on the calendar.',
          'journald + logrotate retention verified, not assumed.',
        ],
      },
      {
        id: 'verify',
        heading: '4. Verify everything, mechanically',
        paragraphs: [
          'The full check script is read-only: it changes nothing, it only reports. Fourteen checks, one command, thirty seconds. I run it after every hardening session and snapshot the passing state as the baseline for future lab exercises.',
          'If a control cannot be checked by script, it gets a manual test with a recorded result. "I think I set that" is not a control status.',
        ],
      },
    ],
  },
  {
    slug: 'siem-tuning-without-blinding',
    title: 'SIEM Tuning Without Blinding Yourself',
    excerpt:
      'My Wazuh alert volume dropped 78% with zero lost true positives. The method: measure first, suppress with written rationale, re-validate monthly.',
    category: 'SIEM',
    tags: ['Wazuh', 'SIEM', 'Detection engineering'],
    date: '2026-04-09',
    minutes: 10,
    featured: true,
    sections: [
      {
        id: 'storm',
        heading: 'Week one: the alert storm',
        paragraphs: [
          'A fresh Wazuh deployment on active lab hosts is humbling: hundreds of alerts, nearly all benign. File-integrity noise, my own authorized scans, severity defaults tuned for someone else\'s environment. The temptation is to suppress aggressively until the queue is quiet.',
          'Quiet is not the goal. A quiet SIEM that misses real activity is worse than a noisy one — it provides confidence without coverage. So I tuned against a rule: every suppression needs a rationale, and every tuned rule needs re-validation.',
        ],
      },
      {
        id: 'method',
        heading: 'The method: rank, investigate, justify',
        paragraphs: [
          'Each week I export alerts by rule, ranked by volume. For the top rules I investigate a sample against raw logs, then decide: threshold it, filter a known-benign context, or leave it loud because the signal matters.',
        ],
        list: [
          'Rank rules by weekly volume; top 5 get investigated first.',
          'Sample 10+ alerts per rule against raw logs before changing anything.',
          'Write the rationale: what is benign, why, and what would still fire.',
          'Record rule, change, rationale, and date in the tuning journal.',
        ],
      },
      {
        id: 'self-traffic',
        heading: 'Label your own tests',
        paragraphs: [
          'The hardest noise to handle was my own: authorized scans and brute-force tests look identical to hostile activity in raw alerts. The fix is procedural — every exercise gets a documented time window, and triage checks the window before the alert.',
          'This also creates perfect tuning data: labeled true positives with known ground truth, which is exactly what production SOCs wish they had.',
        ],
      },
      {
        id: 'revalidation',
        heading: 'Prove it still fires',
        paragraphs: [
          'Tuning decays: systems change, log formats drift, rules rot. Once a month I re-trigger each tuned rule safely — create the test condition, confirm the alert, clean up — and log the result. A rule that fails re-validation is a finding, not a mystery.',
          'Results after two tuning cycles: 78% less volume, every true-positive test still detected, and a journal that explains every suppression to future-me.',
        ],
      },
    ],
  },
  {
    slug: 'secure-headers-nextjs',
    title: 'Secure Headers in Next.js: What I Ship and Why',
    excerpt:
      'CSP, HSTS, frame protection and friends — the exact header set on this portfolio, what each one buys, and what I deliberately left out.',
    category: 'Secure Development',
    tags: ['Next.js', 'CSP', 'Headers', 'XSS'],
    date: '2026-07-20',
    minutes: 8,
    featured: false,
    sections: [
      {
        id: 'why-headers',
        heading: 'Headers are cheap defense in depth',
        paragraphs: [
          'Secure headers do not fix vulnerabilities; they shrink what a vulnerability can do. A stored-XSS flaw under a strict Content Security Policy is still a bug — but one that cannot exfiltrate to an attacker domain or load external scripts. That containment is worth an afternoon of configuration.',
        ],
      },
      {
        id: 'the-set',
        heading: 'The header set',
        paragraphs: [
          'This portfolio ships a strict, deliberately boring set. Each header below earns its place against a specific threat; anything I could not justify with a threat did not ship.',
        ],
        list: [
          'Content-Security-Policy: self-only scripts, no external script sources, upgrade-insecure-requests.',
          'Strict-Transport-Security: long max-age with subdomains — HTTPS is not optional.',
          'X-Content-Type-Options: nosniff — browsers never guess content types.',
          'X-Frame-Options DENY + frame-ancestors none — no clickjacking host.',
          'Referrer-Policy: strict-origin-when-cross-origin — minimal referrer leakage.',
          'Permissions-Policy: camera, mic, geolocation and payment all disabled.',
        ],
        code: {
          lang: 'javascript',
          caption: 'next.config.js — headers (excerpt)',
          code: "const csp = [\n  \"default-src 'self'\",\n  \"frame-ancestors 'none'\",\n  \"script-src 'self'\",\n  \"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com\",\n  'upgrade-insecure-requests',\n].join('; ');",
        },
      },
      {
        id: 'csp-tradeoffs',
        heading: 'CSP tradeoffs, honestly',
        paragraphs: [
          'The styles exception (unsafe-inline for Next.js-injected styles) is the weakest point of this policy, and I document it as such. The scripts directive stays strict — no inline scripts, no external sources — because script control is where XSS containment actually happens.',
          'Adding analytics later would mean extending connect-src or script-src deliberately, in a reviewed commit, with the privacy page updated to match. The CSP makes silent tracking expansion structurally difficult, which is exactly the point.',
        ],
      },
      {
        id: 'verify',
        heading: 'Verify, then monitor',
        paragraphs: [
          'Headers are verified in CI shape (config review) and manually with header inspection on every deployment. Any new route inherits them automatically via the global header matcher — secure defaults beat per-page memory.',
        ],
      },
    ],
  },
  {
    slug: 'python-soc-automation-safely',
    title: 'Python SOC Automation That Fails Closed',
    excerpt:
      'Enrichment is safe to automate; response is not. How I build SOC helpers with scope enforcement, allowlisted commands, and audit logs.',
    category: 'Python',
    tags: ['Python', 'Automation', 'SOC', 'Audit logging'],
    date: '2026-06-28',
    minutes: 9,
    featured: false,
    sections: [
      {
        id: 'line',
        heading: 'Draw the automation line deliberately',
        paragraphs: [
          'My rule: automation proposes and enriches; humans approve and execute. Alert enrichment (host context, timelines, checklists) runs freely. Anything that changes a system — firewall, account, service — requires typed human approval and writes an audit entry.',
          'This is not lack of ambition; it is blast-radius engineering. A buggy enricher wastes minutes. A buggy auto-responder causes incidents.',
        ],
      },
      {
        id: 'scope',
        heading: 'Scope enforcement: refuse to run',
        paragraphs: [
          'Every helper that touches a target requires a scope file naming owned systems. No scope file, no execution — the tool exits with an explanation. This fail-closed default is the single most important line of code in my recon helpers.',
        ],
        code: {
          lang: 'python',
          caption: 'scope.py — fail-closed guard',
          code: "def require_scope(scope_path: str, target: str) -> Scope:\n    scope = load_scope(scope_path)  # raises if missing/invalid\n    if not scope.allows(target):\n        raise Refusal(f'{target} is not in authorized scope')\n    return scope",
        },
      },
      {
        id: 'injection',
        heading: 'Never let alert data become shell',
        paragraphs: [
          'Alert fields contain attacker-controlled strings: usernames, paths, user-agents. Helpers that interpolate these into shell commands build an injection path from the attacker to the responder\'s host. My tools use argument vectors with fixed commands — no shell=True, no string-built commands, ever.',
        ],
        code: {
          lang: 'python',
          caption: 'safe execution pattern',
          code: "import subprocess\nALLOWED = {'check_service': ['/usr/bin/systemctl', 'is-active']}\n\ndef run_tool(name: str, arg: str) -> str:\n    base = ALLOWED[name]  # KeyError if not allowlisted\n    validate_arg(arg)     # strict allowlist, no metacharacters\n    out = subprocess.run([*base, arg], capture_output=True,\n                         text=True, timeout=30, shell=False)\n    return out.stdout[:65536]",
        },
      },
      {
        id: 'audit',
        heading: 'Audit everything, review regularly',
        paragraphs: [
          'Every run appends who/what/when/result to JSONL. I review the audit log weekly — not because I distrust the tools, but because the log is where automation surprises surface before they become automation incidents.',
        ],
      },
    ],
  },
  {
    slug: 'home-lab-network-isolation',
    title: 'Home Lab Network Isolation on a Budget',
    excerpt:
      'How I keep offensive tooling fenced inside owned VMs with host-only networking, snapshots, and scope discipline — no enterprise gear required.',
    category: 'Networking',
    tags: ['Networking', 'Lab', 'Isolation', 'Virtualization'],
    date: '2026-03-02',
    minutes: 7,
    featured: false,
    sections: [
      {
        id: 'goal',
        heading: 'The goal: test traffic never leaves',
        paragraphs: [
          'A home lab running Kali needs one guarantee above all: test traffic stays inside owned systems. My isolation is layered — virtualization boundaries, network mode, firewall rules, and procedure — so no single mistake exposes anyone else.',
        ],
      },
      {
        id: 'layers',
        heading: 'Four layers, cheapest first',
        paragraphs: ['Each layer is independent; together they make escape require multiple simultaneous failures.'],
        list: [
          'Host-only / NAT lab network: VMs talk to each other, not to the LAN or internet beyond updates.',
          'Host firewall: lab subnets blocked from reaching household devices.',
          'Snapshot discipline: restore to known-good before and after offensive exercises.',
          'Scope files: every exercise names its targets in writing before tools run.',
        ],
      },
      {
        id: 'discipline',
        heading: 'Procedure is the fourth firewall',
        paragraphs: [
          'Technology enforces most isolation, but scope discipline covers what it cannot: typing the wrong address, scanning the wrong subnet, testing at the wrong time. My rule is absolute — only lab-owned systems, documented per exercise, no exceptions for "quick checks."',
          'Total cost of this isolation posture: zero, beyond the machine I already had. Isolation is mostly decisions, not purchases.',
        ],
      },
    ],
  },
  {
    slug: 'from-logs-to-findings',
    title: 'From Logs to Findings: My Triage Checklist',
    excerpt:
      'Alert to written finding in five steps: scope, timeline, evidence, blast radius, disposition. The checklist I follow so time pressure never skips steps.',
    category: 'SOC',
    tags: ['SOC', 'Triage', 'Incident response'],
    date: '2026-07-12',
    minutes: 8,
    featured: false,
    sections: [
      {
        id: 'problem',
        heading: 'Triage fails under pressure, not under complexity',
        paragraphs: [
          'Every triage step is easy in isolation; the failure mode is skipping steps when alerts pile up. A checklist converts a stressful judgment call into a repeatable procedure — the same reason pilots use them.',
        ],
      },
      {
        id: 'checklist',
        heading: 'The five steps',
        paragraphs: ['I work every lab alert through these in order, and the incident note mirrors them section for section.'],
        list: [
          'Scope: which hosts, users, and time window? Is this inside a labeled exercise window?',
          'Timeline: minute-by-minute reconstruction from raw logs, not just the alert text.',
          'Evidence: alert + raw log excerpts + any packet/host artifacts, all sanitized for notes.',
          'Blast radius: what did the activity touch? What would success have unlocked?',
          'Disposition: true/false positive, authorized or not, with follow-up actions named.',
        ],
      },
      {
        id: 'note',
        heading: 'Write for the next responder',
        paragraphs: [
          'The note is the product of triage, not a chore after it. My quality test is the cold read: could someone with no context act correctly from the note alone? If not, the note is incomplete — usually missing the timeline or the next actions.',
          'Templates enforce this under pressure: timeline and next-actions are required sections, not suggestions.',
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function relatedArticles(article: Article, count = 3): Article[] {
  const scored = articles
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      const sharedTags = a.tags.filter((t) => article.tags.includes(t)).length;
      const sameCat = a.category === article.category ? 2 : 0;
      return { a, score: sharedTags + sameCat };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, count).map((s) => s.a);
}

export const articleSlugs: string[] = articles.map((a) => a.slug);

export const articleCategories: string[] = Array.from(new Set(articles.map((a) => a.category))).sort();
export const articleTags: string[] = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();
