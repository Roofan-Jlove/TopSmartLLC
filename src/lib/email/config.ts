import { site } from '@/data/site';
import type { ServerEnv } from '../env';
import type { EmailAddress } from './types';

export type SmtpConfig = { host: string; port: number; secure: boolean; user?: string; pass?: string };

export type LiveConfig = {
  to: EmailAddress[];
  from: EmailAddress;
  provider:
    | { kind: 'resend'; apiKey: string; baseUrl?: string }
    | { kind: 'smtp'; smtp: SmtpConfig };
};

export type LiveConfigResult = { ok: true; config: LiveConfig } | { ok: false; problems: string[] };

const EMAIL = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

/** Accepts `a@b.com` or `Name <a@b.com>`. */
export function parseAddress(raw: string | undefined, defaultName?: string): EmailAddress | null {
  const value = (raw ?? '').trim();
  const named = /^(.*)<([^<>]+)>$/.exec(value);
  const address = (named ? named[2] : value)?.trim() ?? '';
  if (!EMAIL.test(address)) return null;
  const name = named?.[1]?.trim().replace(/^"|"$/g, '') || defaultName;
  return name ? { name, address } : { address };
}

/**
 * Checks everything live mode needs before any attempt to send, and reports every
 * problem at once by variable name, never by value, so secrets stay out of logs.
 */
export function checkLiveConfig(env: ServerEnv): LiveConfigResult {
  const problems: string[] = [];

  const to = (env.CONTACT_TO_EMAIL ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => parseAddress(part));
  if (to.length === 0) problems.push('CONTACT_TO_EMAIL is not set');
  else if (to.some((a) => a === null)) problems.push('CONTACT_TO_EMAIL contains an invalid email address');
  else if (to.length > 5) problems.push('CONTACT_TO_EMAIL has more than 5 recipients');

  const from = parseAddress(env.CONTACT_FROM_EMAIL, `${site.name} Website`);
  if (!env.CONTACT_FROM_EMAIL) problems.push('CONTACT_FROM_EMAIL is not set');
  else if (!from) problems.push('CONTACT_FROM_EMAIL is not a valid email address');

  let provider: LiveConfig['provider'] | null = null;
  if (env.EMAIL_PROVIDER === 'resend') {
    if (!env.RESEND_API_KEY) problems.push('RESEND_API_KEY is not set');
    else provider = { kind: 'resend', apiKey: env.RESEND_API_KEY, baseUrl: env.RESEND_API_URL };
  } else {
    if (!env.SMTP_HOST) problems.push('SMTP_HOST is not set');
    if (Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASS)) problems.push('SMTP_USER and SMTP_PASS must be set together');
    if (env.SMTP_HOST && Boolean(env.SMTP_USER) === Boolean(env.SMTP_PASS)) {
      const port = env.SMTP_PORT ?? 465;
      const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465;
      provider = { kind: 'smtp', smtp: { host: env.SMTP_HOST, port, secure, user: env.SMTP_USER, pass: env.SMTP_PASS } };
    }
  }

  if (problems.length > 0 || !from || !provider) return { ok: false, problems };
  return { ok: true, config: { to: to as EmailAddress[], from, provider } };
}
