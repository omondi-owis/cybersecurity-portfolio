// This endpoint is scheduler-only: POST /api/admin/cron/cleanup with
// Authorization: Bearer $CRON_SECRET. It deletes all enquiry states older than 90 days,
// then purges expired sessions and consumed/expired OTP challenges. Never run a client-side cleanup.
export {};
