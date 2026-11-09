# Enquiry persistence and private dashboard

**Status:** implemented but disabled by default. This is not a deployment certification.

## Provision and rollout
1. Create a free Neon PostgreSQL database and set `DATABASE_URL` as a server-only environment variable.
2. Apply `migrations/001_enquiries.sql` using Neon SQL editor or a least-privileged migration role. Schema is never created by runtime traffic.
3. Set server-only `ADMIN_EMAIL` (the sole permitted dashboard recipient) and a unique 32+ character `ADMIN_AUTH_SECRET`.
4. Keep existing `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, Redis limiter variables intact. Set `ENQUIRY_DASHBOARD_ENABLED=true` only after the migration and all variables are set.
5. Validate a contact submission, a successful/failing mail delivery status, OTP login, update, deletion and 90-day cleanup in a non-production environment first.

The dashboard is deliberately unlinked and excluded from the sitemap. It is `/admin`; disabled/misconfigured mode fails closed. No secrets, database URL, recipient email, bodies or addresses belong in logs.

## Security behavior
- Contact persistence happens before Resend delivery. A stored enquiry returns success even if delivery later fails; if storage is unavailable, no receipt is claimed.
- OTP code hashes, challenge attempt counters and sessions are stored in PostgreSQL. Codes expire in 10 minutes, allow five atomic attempts and are single-use. Session tokens are random, hashed at rest, 8-hour HttpOnly/Secure/SameSite=Strict cookies.
- Admin mutations require the same Origin host; all dashboard/API responses are no-store.
- Cleanup removes unreviewed enquiries older than 90 days. Run the stated SQL through a separately protected scheduler (with `CRON_SECRET` outside this app) as well as the opportunistic cleanup.

## Rollback
Set `ENQUIRY_DASHBOARD_ENABLED=false`; public contact returns to its existing Resend-only behavior and admin access fails closed. Do not drop tables until retention/legal review is complete.
