import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/validation';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Junior SOC role',
  message: 'Hello, I would like to discuss an opportunity with you.',
  website: '',
};

describe('contactSchema', () => {
  it('accepts valid input', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects short names and bad emails', () => {
    expect(contactSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects angle brackets in name/subject (XSS defense in depth)', () => {
    expect(contactSchema.safeParse({ ...valid, name: '<img>' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: '<script>' }).success).toBe(false);
  });

  it('rejects oversized and spammy messages', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'x'.repeat(4001) }).success).toBe(false);
    expect(
      contactSchema.safeParse({
        ...valid,
        message: 'see http://a.io http://b.io http://c.io now',
      }).success
    ).toBe(false);
  });

  it('trips on filled honeypot', () => {
    const r = contactSchema.safeParse({ ...valid, website: 'http://spam.io' });
    expect(r.success).toBe(false);
  });
});
