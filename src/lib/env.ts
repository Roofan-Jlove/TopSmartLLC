import { z } from 'zod';
import { DEFAULT_MAX_UPLOAD_MB } from './schemas/files';

const envSchema = z.object({
  LEAD_DISPATCH_MODE: z.enum(['mock', 'live']).default('mock'),
  EMAIL_PROVIDER: z.enum(['resend', 'smtp']).default('resend'),
  RESEND_API_KEY: z.string().optional(),
  /** Only for testing against a local stand-in server. Defaults to the real Resend API. */
  RESEND_API_URL: z.string().url().optional(),
  CONTACT_TO_EMAIL: z.string().optional(),
  CONTACT_FROM_EMAIL: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.enum(['true', 'false']).optional(),
  SEND_CLIENT_CONFIRMATION: z.enum(['true', 'false']).default('true'),
  WEBHOOK_URL: z.string().optional(),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(1000).default(5),
  MAX_UPLOAD_MB: z.coerce.number().positive().max(25).default(DEFAULT_MAX_UPLOAD_MB),
  SHOW_IP_IN_EMAIL: z.enum(['true', 'false']).default('false'),
});

/** Server-only configuration. Read lazily so a missing variable never breaks `next build`. */
export function getServerEnv() {
  const parsed = envSchema.safeParse(
    Object.fromEntries(
      // Treat empty strings (as written in .env.example) as "not set".
      Object.entries(process.env).filter(([, value]) => value !== ''),
    ),
  );
  const env = parsed.success ? parsed.data : envSchema.parse({});
  return {
    ...env,
    mode: env.LEAD_DISPATCH_MODE,
    rateLimitPerMinute: env.RATE_LIMIT_PER_MINUTE,
    maxUploadBytes: Math.round(env.MAX_UPLOAD_MB * 1024 * 1024),
    sendClientConfirmation: env.SEND_CLIENT_CONFIRMATION === 'true',
  };
}

export type ServerEnv = ReturnType<typeof getServerEnv>;
