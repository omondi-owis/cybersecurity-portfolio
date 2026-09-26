# Architecture

## System overview

```
                    INTERNET (untrusted)
                           |
                           v
              ┌────────────────────────┐
              │  CDN / Edge            │  TLS, WAF, DDoS, bot controls,
              │  (Cloudflare)          │  edge rate limits, HSTS
              └───────────┬────────────┘
                          |
                          v
              ┌────────────────────────┐
              │  Next.js App Router    │  SSG pages, streaming, strict CSP,
              │  (SSG + route handlers)│  secure headers, safe rendering
              └───────────┬────────────┘
                          |
              ┌───────────┴────────────┐
              v                        v
   ┌──────────────────┐     ┌──────────────────┐
   │ /api/contact     │     │ /api/github      │
   │ Zod, honeypot,   │     │ optional proxy,  │
   │ 5/hr/IP, 10KB cap│     │ cached, fail-soft│
   └────────┬─────────┘     └────────┬─────────┘
            v                        v
   ┌──────────────────┐     ┌──────────────────┐
   │ Resend (opt.) /  │     │ api.github.com   │
   │ manual review    │     │ (server token)   │
   └──────────────────┘     └──────────────────┘
```

No database, no auth, no uploads, no admin panel — by design. The attack
surface is intentionally minimal (see `SECURITY.md`).

## Rendering & performance

- **SSG by default:** all content pages pre-render at build time via
  `generateStaticParams()` over `content/*.ts`. Only `/api/*` is dynamic.
- **Minimal JS:** interactive islands are limited to the header menu, theme
  toggle, SOC pipeline tabs, contact form, and knowledge search. Everything
  else is static HTML + CSS.
- **Fonts:** Google Fonts stylesheets with `preconnect`; system fallbacks keep
  the site fully usable offline/blocked.
- **Images:** SVG-only assets (favicon, OG, diagrams) — zero raster weight,
  infinitely scalable.
- **CSS:** single hand-built design system (`app/globals.css`), no framework
  runtime, `prefers-reduced-motion` respected throughout.

## Data flow: contact form

```
Browser (UX validation) → POST /api/contact (JSON, ≤10KB)
  → middleware size guard → Zod validation (authoritative)
  → honeypot check (fake success) → rate limit 5/hr/IP
  → metadata-only audit log → Resend delivery (if configured)
  → { ok: true } | safe, generic errors (no internals)
```

## GitHub enrichment (optional)

`/api/github?user=` proxies public repo summaries using a **server-side**
token, 4s timeout, 1h cache, and fail-soft `{ repos: null }`. With no token
configured the route returns null and the UI renders static content with
**zero external calls**. The token never leaves the server.

## Key decisions

| Decision | Reason |
|---|---|
| Next.js SSG over SPA | SEO, performance, security headers, sitemap/robots as code |
| Content as typed TS, not MDX | Type safety, zero MD parser attack surface, trivial to extend |
| No Tailwind / UI kit | Full visual control, smaller CSS, no dependency risk |
| Zod shared schema | One contract, client UX + server enforcement |
| In-memory rate limit | Correct for single-instance; Redis/Upstash documented for scale |
| No inline scripts | Preserves strict CSP (theme via mount effect, no JSON-LD) |
| No auth/uploads/admin | Features removed > features secured |

## Scaling path

- Multi-instance: move rate limits to Upstash Redis.
- Delivery: Resend already supported via env; add queue if volume grows.
- i18n: content files are the seam — namespace by locale when needed.
- PWA: manifest ships; add a service worker only if offline reading proves valuable.
