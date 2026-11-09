import { createHash, createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from 'crypto';
import { neon } from '@neondatabase/serverless';

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  emailStatus: 'pending' | 'sent' | 'failed';
  createdAt: string;
};

const enabled = () => process.env.ENQUIRY_DASHBOARD_ENABLED === 'true';
const authSecret = () => process.env.ADMIN_AUTH_SECRET?.trim() || '';
const isHttpsOrigin = (value: string | undefined) => {
  if (!value?.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && url.origin === value.trim() && !url.username && !url.password;
  } catch {
    return false;
  }
};

/** Storage is enabled only when every dependency needed for a safe workflow exists. */
export const featureReady = () =>
  enabled()
  && Boolean(process.env.DATABASE_URL?.trim())
  && Boolean(process.env.ADMIN_EMAIL?.trim())
  && authSecret().length >= 32
  && isHttpsOrigin(process.env.SITE_URL)
  && Boolean(process.env.RESEND_API_KEY?.trim())
  && Boolean(process.env.CONTACT_TO_EMAIL?.trim());

export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex');
export const randomToken = () => randomBytes(32).toString('base64url');
export const otp = () => String(randomInt(100000, 1_000_000));
export const otpHash = (value: string) => createHmac('sha256', authSecret()).update(value).digest('hex');
export const equal = (left: string, right: string) => {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
};

async function sql(query: string, params: unknown[] = []): Promise<any[]> {
  if (!featureReady()) throw new Error('DATABASE_UNAVAILABLE');
  try {
    return await neon(process.env.DATABASE_URL!.trim()).query(query, params);
  } catch {
    throw new Error('DATABASE_UNAVAILABLE');
  }
}

/** Insert before delivery. The client-provided UUID makes retrying one submission safe. */
export async function createEnquiry(
  input: { name: string; email: string; subject: string; message: string },
  idempotencyKey: string,
) {
  const id = randomUUID();
  const inserted = await sql(
    "INSERT INTO enquiries (id,idempotency_key,name,email,subject,message,status,email_status) VALUES ($1,$2,$3,$4,$5,$6,'new','pending') ON CONFLICT (idempotency_key) DO NOTHING RETURNING id",
    [id, idempotencyKey, input.name, input.email, input.subject, input.message],
  );
  if (inserted.length) return { id: inserted[0].id as string, inserted: true };

  const existing = await sql('SELECT id FROM enquiries WHERE idempotency_key=$1', [idempotencyKey]);
  if (existing.length === 1) return { id: existing[0].id as string, inserted: false };
  throw new Error('IDEMPOTENCY_LOOKUP_FAILED');
}

export async function markDelivery(id: string, status: 'sent' | 'failed') {
  await sql('UPDATE enquiries SET email_status=$2 WHERE id=$1', [id, status]);
}
export async function listEnquiries() {
  return sql('SELECT id,name,email,subject,message,status,email_status AS "emailStatus",created_at AS "createdAt" FROM enquiries ORDER BY created_at DESC LIMIT 100');
}
export async function updateEnquiry(id: string, status: 'new' | 'replied' | 'closed') {
  await sql('UPDATE enquiries SET status=$2, reviewed_at=NOW() WHERE id=$1', [id, status]);
}
export async function deleteEnquiry(id: string) { await sql('DELETE FROM enquiries WHERE id=$1', [id]); }
/** The retention limit applies to every stored enquiry, regardless of status. */
export async function cleanup() { await sql("DELETE FROM enquiries WHERE created_at < NOW() - INTERVAL '90 days'"); }
export async function cleanupAuth() {
  await sql('DELETE FROM admin_auth_challenges WHERE expires_at < NOW() OR used_at IS NOT NULL');
  await sql('DELETE FROM admin_sessions WHERE expires_at < NOW()');
}

export async function createChallenge(code: string) {
  const id = randomUUID();
  await sql("INSERT INTO admin_auth_challenges (id,code_hash,expires_at,attempts) VALUES ($1,$2,NOW()+INTERVAL '10 minutes',0)", [id, otpHash(code)]);
  return id;
}
/** One atomic update covers expiry, attempt budget, and single use across instances. */
export async function consumeChallenge(id: string, code: string) {
  const hash = otpHash(code);
  const rows = await sql(
    'UPDATE admin_auth_challenges SET attempts=attempts+1,used_at=CASE WHEN code_hash=$2 THEN NOW() ELSE used_at END WHERE id=$1 AND used_at IS NULL AND expires_at>NOW() AND attempts<5 RETURNING code_hash,used_at',
    [id, hash],
  );
  return rows.length === 1 && equal(rows[0].code_hash, hash) && Boolean(rows[0].used_at);
}
export async function createSession(token: string) {
  await sql("INSERT INTO admin_sessions (token_hash,expires_at) VALUES ($1,NOW()+INTERVAL '8 hours')", [hashToken(token)]);
}
export async function validSession(token: string | undefined) {
  if (!token) return false;
  const rows = await sql('SELECT 1 FROM admin_sessions WHERE token_hash=$1 AND expires_at>NOW()', [hashToken(token)]);
  return rows.length === 1;
}
export async function endSession(token: string | undefined) {
  if (token) await sql('DELETE FROM admin_sessions WHERE token_hash=$1', [hashToken(token)]);
}
