import { z } from 'zod';

/**
 * Contact form schema — shared by client pre-validation and server enforcement.
 * Server is authoritative; client validation is UX only.
 */

const noUrlSpam = (v: string) => {
  // Crude but effective: messages with 3+ URLs are almost always spam.
  const urls = v.match(/https?:\/\//g) ?? [];
  return urls.length < 3;
};

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be under 80 characters.')
    .regex(/^[^<>]*$/, 'Name contains invalid characters.'),
  email: z
    .string()
    .trim()
    .max(254, 'Email is too long.')
    .email('Please enter a valid email address.'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters.')
    .max(120, 'Subject must be under 120 characters.')
    .regex(/^[^<>]*$/, 'Subject contains invalid characters.'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters.')
    .max(4000, 'Message must be under 4000 characters.')
    .refine(noUrlSpam, 'Message looks like spam (too many links).'),
  // Honeypot — must stay empty. Bots fill it; humans never see it.
  website: z.string().max(0, 'Spam detected.').optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Safe shape returned to clients — never echoes raw input on failure. */
export function safeFieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
