# Omondi Raphael Owino — Cybersecurity Portfolio

A production-quality cybersecurity engineering portfolio: project case studies,
a security-lab journal, a technical knowledge base, a public security case study
of the site itself, and a hardened contact system.

**Stack:** Next.js 15 (App Router, TypeScript) · React 19 · Zod · hand-built CSS
design system · Vitest · GitHub Actions (typecheck, tests, audit, secret scan, build, CodeQL).

> Positioning: **Cybersecurity & Network Security Engineer** — practical
> infrastructure, network security, monitoring, automation, defensive
> experimentation. Honest statuses everywhere; nothing invented.

---

## Quick start

```bash
cp .env.example .env   # fill ONLY with real values; empty hides the link
npm install
npm run dev            # http://localhost:3000
```

| Command              | Purpose                                              |
|----------------------|------------------------------------------------------|
| `npm run dev`        | Local development                                    |
| `npm run build`      | Production build (must pass before pushing)          |
| `npm start`          | Serve the production build                           |
| `npm run typecheck`  | `tsc --noEmit`                                       |
| `npm run test`       | Vitest unit tests                                    |
| `npm run audit`      | `npm audit` (moderate+)                              |
| `npm run secret-scan`| Local secret / private-infra scan (also runs in CI)  |

## Owner configuration

Single source of truth: **`content/site.ts`** reads environment variables —
no personal URL is hardcoded. Configure via `.env` (see `.env.example`):

```
NEXT_PUBLIC_OWNER_NAME / NEXT_PUBLIC_OWNER_TITLE / NEXT_PUBLIC_SITE_URL
CONTACT_EMAIL
NEXT_PUBLIC_GITHUB_URL / LINKEDIN / INSTAGRAM / YOUTUBE / TIKTOK / WHATSAPP
NEXT_PUBLIC_CV_URL
```

**Rules:** never invent values; leave empty to hide gracefully. Server secrets
(`RESEND_API_KEY`, `GITHUB_TOKEN`, `CONTACT_TO_EMAIL`) never carry the
`NEXT_PUBLIC_` prefix and never reach the browser.

Per-project repo/demo/docs links live in `content/projects.ts` as empty strings
until the owner publishes each repository.

## Content system (data-driven)

```
content/
├── site.ts       # identity + links (env-backed)
├── projects.ts   # case studies (add an object = new page)
├── labs.ts       # lab journal entries
├── articles.ts   # knowledge-base articles (sections power the TOC)
└── timeline.ts   # engineering journey milestones
```

Adding a project, lab, or article requires **zero app changes** — routes use
`generateStaticParams()` over these files.

## Security highlights

- Strict CSP (`script-src 'self'`, zero inline scripts), HSTS, framing denial,
  hardened `Permissions-Policy` — see `next.config.js`.
- Edge middleware: scanner-path blocking, API size caps, request IDs.
- Contact API: Zod validation, honeypot (fake-success), 5/hour/IP rate limit,
  metadata-only audit logs, optional Resend delivery via server secret.
- CI: typecheck → tests → `npm audit` → secret scan → CodeQL → prod build.
- `npm audit` is **zero-vulnerability** at release; a `postcss` override in
  `package.json` pins the transitive copy (via Next.js) to the patched line.
- Public disclosure policy at `/disclosure`; full model in `SECURITY.md` and `/security`.

**CSP & theme note:** the theme toggle applies from `localStorage` on mount
(dark default) precisely so no inline `<script>` weakens the CSP. First paint
for light-mode users may flash dark once — an accepted, documented tradeoff.

**Structured data note:** inline JSON-LD was intentionally omitted to preserve
`script-src 'self'`. If rich results matter later, add it with a CSP hash
(`'sha256-…'`) rather than `'unsafe-inline'`.

## Project structure

```
app/            # routes (about, projects/[slug], lab/[slug], knowledge/[slug],
                # security, contact, privacy, disclosure, resume, api/*)
components/     # header, footer, hero viz, SOC pipeline, cards, forms, diagrams
content/        # site config, projects, labs, articles, timeline
lib/            # validation, rate-limit, utils, github enrichment
public/         # favicon, OG image, PWA manifest
tests/          # vitest unit tests
.github/        # CI, CodeQL, Dependabot
scripts/        # secret-scan.sh
```

## Deployment

See `DEPLOYMENT.md` (Cloudflare + any Next.js host, env checklist, domain
readiness). See `ARCHITECTURE.md` for system design and `SECURITY.md` for the
threat model, review checklist, and pre-push safety steps.

## License

All rights reserved — portfolio source of Omondi Raphael Owino. If reusing
patterns from this repo, write your own content; do not clone the identity.
