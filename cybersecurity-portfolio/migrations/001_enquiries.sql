-- Apply once with the Neon SQL console or a restricted migration role. Do not run at request time.
CREATE TABLE IF NOT EXISTS enquiries (
 id uuid PRIMARY KEY, idempotency_key uuid NOT NULL UNIQUE, name varchar(80) NOT NULL, email varchar(254) NOT NULL,
 subject varchar(120) NOT NULL, message text NOT NULL, status varchar(16) NOT NULL CHECK (status IN ('new','replied','closed')),
 email_status varchar(16) NOT NULL CHECK (email_status IN ('pending','sent','failed')),
 created_at timestamptz NOT NULL DEFAULT now(), reviewed_at timestamptz
);
-- Upgrade installations created before idempotent contact retries were introduced.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS idempotency_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS enquiries_idempotency_key_idx ON enquiries (idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries (created_at);
DROP INDEX IF EXISTS enquiries_created_unreviewed_idx;
CREATE TABLE IF NOT EXISTS admin_auth_challenges (
 id uuid PRIMARY KEY, code_hash char(64) NOT NULL, expires_at timestamptz NOT NULL, attempts smallint NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 5),
 used_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_auth_challenges_expiry_idx ON admin_auth_challenges (expires_at);
CREATE TABLE IF NOT EXISTS admin_sessions (
 token_hash char(64) PRIMARY KEY, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions (expires_at);
