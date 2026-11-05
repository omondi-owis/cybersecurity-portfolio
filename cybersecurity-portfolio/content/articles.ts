/** Practical defensive-security guides. Examples are instructional, not verified project results. */
export interface ArticleCode { lang: string; caption?: string; code: string; }
export interface ArticleSection { id: string; heading: string; paragraphs: string[]; list?: string[]; code?: ArticleCode; }
export interface Article {
  slug: string; title: string; excerpt: string; category: string; tags: string[];
  date: string; updated?: string; minutes: number; featured: boolean; sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'threat-modeling-personal-projects',
    title: 'Threat Modeling for Personal Projects: A Practical Minimum',
    excerpt: 'A defensive design guide for small web apps and security tools: identify assets, trust boundaries and realistic failure paths before choosing controls.',
    category: 'Cybersecurity', tags: ['Threat modeling', 'Architecture', 'Defense in depth'],
    date: '2026-11-05', minutes: 3, featured: true,
    sections: [
      { id: 'scope', heading: 'Start with what needs protecting', paragraphs: [
        'A portfolio, a log collector and a monitoring dashboard have different risks. List the data each system receives, who can access it, and what a compromise would expose. Include credentials, contact messages, log contents and administrator sessions rather than treating every asset as equally important.',
        'This is a design guide, not a claim that a particular project has passed a security assessment. A useful model records assumptions as well as controls.'
      ] },
      { id: 'boundaries', heading: 'Draw the trust boundaries', paragraphs: [
        'Sketch browser, application, external services and storage. Label every data flow. Contact-form input crosses an untrusted boundary; so do log events ingested by a SIEM. Neither should become a shell command or trusted HTML.',
        'Ask what happens if an attacker submits oversized input, replays a request, steals a session, or sends malformed log data. Prioritize reachable paths with a meaningful impact.'
      ], list: ['Validate input on the server, not only in the browser.', 'Keep service credentials out of public client code.', 'Authorize each protected action and limit resource use.', 'Record security-relevant failures without logging secrets.'] },
      { id: 'verify', heading: 'Turn controls into checks', paragraphs: [
        'For each risk, record a control and a way to test it. An authorization control needs a denied-access test; a size limit needs an oversized request. A statement in a README is not verification.',
        'Review the model when a new endpoint, dependency or integration changes the attack surface. Publish sanitized test evidence separately from this general guidance.'
      ] }
    ]
  },
  {
    slug: 'ubuntu-hardening-checklist', title: 'Ubuntu Hardening: A Verification-First Checklist',
    excerpt: 'Practical checks for SSH, firewall policy, updates and logging on an Ubuntu lab server, with safe sequencing and a recovery path.',
    category: 'Linux', tags: ['Linux', 'Hardening', 'SSH', 'UFW'], date: '2026-11-05', minutes: 3, featured: true,
    sections: [
      { id: 'recovery', heading: 'Arrange recovery before changing access', paragraphs: [
        'Use an owned lab machine and keep console access or another recovery path available. Take a snapshot where appropriate. Record the required services and the administrator source network before changing SSH or firewall rules.',
        'Hardening is not a universal command list: distributions, OpenSSH versions and service requirements differ. These are verification principles, not a report of completed checks on this portfolio or a lab host.'
      ] },
      { id: 'ssh', heading: 'Verify the effective SSH configuration', paragraphs: [
        'Use a non-root administration account with tested key access. Validate SSH configuration syntax before reloading the service, then inspect effective settings. Include files and conditional Match blocks can change the result; test the relevant user and source context.',
        'Keep the original session open while testing a second connection. A disabled password setting alone does not prove every interactive authentication path is closed.'
      ], code: { lang: 'bash', caption: 'Read-only syntax and configuration checks, with suitable privileges', code: 'sudo sshd -t\nsudo sshd -T | grep -E "^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication) "' } },
      { id: 'baseline', heading: 'Check the wider baseline', paragraphs: [
        'Allow the required administration path before enabling a default-deny firewall. Verify exposed services from a separate authorized host rather than trusting a local rule listing alone.'
      ], list: ['Review available security updates and automatic-update configuration.', 'Check listening services against the documented baseline.', 'Confirm useful authentication logs exist and retention fits the lab.', 'Record expected and actual results, then recheck after changes.'] }
    ]
  },
  {
    slug: 'siem-tuning-without-blinding', title: 'SIEM Tuning Without Blinding Yourself',
    excerpt: 'A Wazuh-focused guide to reducing repeated noise while preserving useful detections, with explicit validation and evidence requirements.',
    category: 'SIEM', tags: ['Wazuh', 'SIEM', 'Detection engineering'], date: '2026-11-05', minutes: 3, featured: true,
    sections: [
      { id: 'baseline', heading: 'Measure before suppressing', paragraphs: [
        'A quieter alert queue is not automatically a safer environment. Establish a baseline using comparable time windows, agent coverage and activity. Group alerts by rule, host and source; inspect raw events behind high-volume rules before deciding they are benign.',
        'This guide describes a tuning workflow, not measured results from a completed investigation. No alert-reduction percentage or detection-coverage guarantee is asserted.'
      ] },
      { id: 'context', heading: 'Separate context from blanket exclusions', paragraphs: [
        'An authorized scan can resemble hostile reconnaissance. Record exercise targets and time windows so an analyst can explain the activity. Do not permanently trust an address merely because it belonged to a lab tool during one exercise.',
        'Prefer a narrow, documented change over disabling a broad rule. Record the original behavior, proposed change, reason, affected systems and rollback. Test configuration changes in the lab before deploying them elsewhere.'
      ] },
      { id: 'validation', heading: 'Prove both useful firing and expected quiet', paragraphs: [
        'Replay or safely generate a known test condition on owned systems. Confirm the expected alert and its important fields. Then check representative benign activity for unwanted firing. A single successful test does not establish complete coverage.'
      ], list: ['Save sanitized before/after counts and the comparison windows.', 'Keep the exact rule change and relevant raw event examples.', 'Record positive and negative test outcomes, including failures.', 'Re-test after rule, agent or log-format changes.'] },
      { id: 'limits', heading: 'Publish the limits alongside the result', paragraphs: [
        'If a later case study reports fewer alerts, include the denominator and what was tested. Distinguish a reduction in repeated benign alerts from improved detection quality; the two are related but not interchangeable.'
      ] }
    ]
  },
  {
    slug: 'secure-headers-nextjs', title: 'Security Headers in Next.js: Controls and Tradeoffs',
    excerpt: 'How this portfolio uses browser security headers, what its current CSP permits, and why headers complement rather than replace secure application code.',
    category: 'Secure Development', tags: ['Next.js', 'CSP', 'Headers', 'XSS'], date: '2026-11-05', minutes: 3, featured: false,
    sections: [
      { id: 'purpose', heading: 'Containment, not a security certificate', paragraphs: [
        'Response headers can restrict framing, content interpretation and resource loading. They do not replace input validation, authorization, dependency maintenance or secure session handling. A header scan is evidence of configuration, not proof that an application has no vulnerabilities.',
        'This article explains the portfolio configuration and its limitations; it does not claim an independent security audit.'
      ] },
      { id: 'configuration', heading: 'What the portfolio currently configures', paragraphs: [
        'The configuration includes HTTPS enforcement through HSTS, nosniff, frame restrictions, a referrer policy and restrictions on browser capabilities such as camera and microphone. Its Content Security Policy limits resource sources but still permits inline scripts and inline styles.',
        'That inline-script exception weakens protection against script injection. It must not be described as a nonce-based policy or as blocking all inline JavaScript. A nonce/hash-based policy is a future hardening step that needs framework-aware implementation and testing.'
      ], code: { lang: 'text', caption: 'Current script-policy tradeoff, not a recommended universal policy', code: "script-src 'self' 'unsafe-inline'\nobject-src 'none'\nframe-ancestors 'none'" } },
      { id: 'check', heading: 'Check the deployed response and the browser', paragraphs: [
        'Inspect real response headers after deployment, including important routes and error responses. Then check browser behavior: a policy that looks strict can still break required scripts, fonts or form handling.',
        'Review any new third-party resource deliberately. Avoid weakening a policy broadly just to silence a console error; identify the dependency and permit only what is necessary.'
      ] }
    ]
  },
  {
    slug: 'python-soc-automation-safely', title: 'Python SOC Automation That Fails Closed',
    excerpt: 'Safe design patterns for log parsing and alert enrichment: validate inputs, bound resources, preserve evidence and keep response actions under human control.',
    category: 'Python', tags: ['Python', 'Automation', 'SOC', 'Audit logging'], date: '2026-11-05', minutes: 3, featured: false,
    sections: [
      { id: 'scope', heading: 'Start with enrichment, not automatic response', paragraphs: [
        'A useful first SOC script reads an authentication log, groups failures over a defined time window and produces a reviewable summary. It should not block an address or disable an account merely because a count crosses a threshold.',
        'These are implementation guidelines, not evidence of a completed parser or deployed response tool. Synthetic fixtures are appropriate for practice when clearly labeled.'
      ] },
      { id: 'input', heading: 'Treat log data as untrusted input', paragraphs: [
        'Usernames, paths and other fields can contain attacker-controlled text. Do not interpolate them into shell commands. Prefer direct library calls; when a process is necessary, use a fixed executable, argument lists, strict validation and a timeout.',
        'Reject malformed timestamps or record them as parsing failures rather than silently treating them as valid events. Preserve the source data and explain how time zones, duplicate events and out-of-order lines are handled.'
      ] },
      { id: 'boundaries', heading: 'Make resource and scope limits explicit', paragraphs: [
        'Bound file sizes, retained state and output. Network enrichment should use an explicit destination policy, timeouts and rate limits; do not send sensitive logs to an external service by default. A missing scope configuration should stop active operations.'
      ], list: ['Test the exact burst threshold and both edges of the time window.', 'Include malformed lines, empty inputs and repeated events.', 'Separate parsing errors from detection matches in the output.', 'Keep response actions as proposals requiring explicit approval.'] },
      { id: 'evidence', heading: 'Make a run reproducible', paragraphs: [
        'Record the script version, sanitized input description, execution command and expected result. Keep reference solutions separate from independently completed work so a portfolio reader can see what was actually implemented and tested.'
      ] }
    ]
  },
  {
    slug: 'home-lab-network-isolation', title: 'Home Lab Network Isolation: Check the Actual Routes',
    excerpt: 'A VirtualBox-oriented guide to separating defensive-security exercises from household devices, with clear distinctions between internal, host-only, NAT and bridged networks.',
    category: 'Networking', tags: ['Networking', 'Lab', 'Isolation', 'Virtualization'], date: '2026-11-05', minutes: 3, featured: false,
    sections: [
      { id: 'scope', heading: 'Write the allowed paths first', paragraphs: [
        'Before running an exercise, name the owned targets, permitted traffic and maintenance access. A VM boundary alone is not a guarantee that test traffic cannot reach the internet or another device.',
        'This is an isolation design guide, not a verification of a particular home network. Check the actual adapters, routes and host firewall before relying on any network-mode label.'
      ] },
      { id: 'modes', heading: 'Know what each adapter mode permits', paragraphs: [
        'An internal network connects participating VMs without an ordinary host interface. Host-only networking normally permits VM-to-host communication as well as communication between attached VMs. Neither label proves that extra adapters or host routing cannot create another path.',
        'NAT commonly permits outbound access, including routes that may reach local networks through the host. It is not an internet-isolation control. Bridged networking places the guest on the physical network and is usually unsuitable for contained test traffic.'
      ] },
      { id: 'verify', heading: 'Verify isolation safely', paragraphs: [
        'Use an internal exercise segment where appropriate and a separately controlled update path. Disable unnecessary adapters during exercises. Apply firewall restrictions for prohibited destinations, and check IPv6 as well as IPv4.'
      ], list: ['Inspect VM adapter settings, guest routes and host forwarding.', 'Confirm only the intended lab services are reachable.', 'Use non-invasive connection checks to owned endpoints only.', 'Record the configuration and repeat checks after network changes.'] },
      { id: 'cleanup', heading: 'Snapshots do not replace network controls', paragraphs: [
        'Snapshots help restore guest state; they do not undo traffic that already left the machine. Keep scope discipline, isolation controls and cleanup checks separate. Remove test accounts and services after an exercise and retain only sanitized evidence for publication.'
      ] }
    ]
  },
  {
    slug: 'from-logs-to-findings', title: 'From Logs to Findings: A SOC Triage Checklist',
    excerpt: 'A repeatable route from alert to incident note: establish scope, build a timeline, corroborate evidence and explain the next decision without overstating certainty.',
    category: 'SOC', tags: ['SOC', 'Triage', 'Incident response'], date: '2026-11-05', minutes: 3, featured: false,
    sections: [
      { id: 'alert', heading: 'An alert is a starting hypothesis', paragraphs: [
        'An alert indicates a rule matched, not necessarily that a compromise occurred. Start by recording the rule, affected host, account, event time and ingestion time. Check for a documented lab exercise, but do not assume that all activity inside its window is benign.',
        'This checklist is instructional. A completed case study needs its own evidence and investigation record rather than treating the checklist as proof of an incident handled.'
      ] },
      { id: 'timeline', heading: 'Build a timeline from source evidence', paragraphs: [
        'Retrieve relevant raw logs and preserve their time zone and provenance. Distinguish observed facts from interpretations. A failed authentication event is not proof of successful access; a successful login is not by itself proof of malicious intent.',
        'Where available, corroborate with another source such as host events, service logs or packet metadata. Missing evidence should reduce confidence, not be replaced with an invented explanation.'
      ], list: ['Scope: which hosts, accounts and time window are involved?', 'Evidence: what exactly was observed and where did it come from?', 'Impact: what changed, and what remains unknown?', 'Disposition: benign, suspicious or confirmed, with the reason stated?'] },
      { id: 'handover', heading: 'Write a note someone else can act on', paragraphs: [
        'Use a short summary, timestamped timeline, sanitized evidence references, assessment and named next actions. Keep detection validity separate from activity authorization: a rule may correctly detect a technique used in an approved exercise.',
        'State confidence and limitations. Preserve private originals securely, redact sensitive identifiers in public copies, and verify that screenshots do not expose credentials or unrelated personal data. Close with the next check or decision, not just a label.'
      ] }
    ]
  }
];

export function getArticle(slug: string): Article | undefined { return articles.find((a) => a.slug === slug); }
export function relatedArticles(article: Article, count = 3): Article[] {
  return articles.filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, score: a.tags.filter((t) => article.tags.includes(t)).length + (a.category === article.category ? 2 : 0) }))
    .sort((x, y) => y.score - x.score).slice(0, count).map((s) => s.a);
}
export const articleSlugs: string[] = articles.map((a) => a.slug);
export const articleCategories: string[] = Array.from(new Set(articles.map((a) => a.category))).sort();
export const articleTags: string[] = Array.from(new Set(articles.flatMap((a) => a.tags))).sort();
