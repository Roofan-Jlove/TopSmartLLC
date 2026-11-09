// @vitest-environment node
import nodemailer from 'nodemailer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkLiveConfig, parseAddress } from '@/lib/email/config';
import { dispatchLead, type DispatchAttachment } from '@/lib/email/dispatch';
import { renderClientConfirmation, renderHostEmail } from '@/lib/email/templates';
import { createResendTransport, createSmtpTransport } from '@/lib/email/transport';
import { EmailSendError, formatAddress, type EmailMessage, type EmailTransport } from '@/lib/email/types';
import { buildWebhookPayload, sendWebhook } from '@/lib/email/webhook';
import { getServerEnv } from '@/lib/env';
import type { LeadRecord } from '@/lib/schemas/lead';

const makeLead = (overrides: Partial<LeadRecord> = {}): LeadRecord => ({
  name: 'Amelia Hart',
  email: 'amelia@example.com',
  phone: '+1 555 010 2040',
  company: 'Northwind Coffee',
  services: ['web', 'content'],
  budget: '5k-15k',
  timeline: '1-3-months',
  description: 'We need a new online store with product pages and a blog.\nSecond line.',
  links: 'https://drive.example.com/brief.',
  estimateSummary: 'Web Design & Development (Growth, 5 pages): $3,500',
  source: 'calculator',
  referenceId: 'TSL-20261109-ABC234',
  receivedAt: '2026-11-09T10:00:00.000Z',
  consentAt: '2026-11-09T10:00:00.000Z',
  attachments: [
    { filename: 'brief.pdf', sizeBytes: 2048, contentType: 'application/pdf' },
    { filename: 'logo.png', sizeBytes: 150_000, contentType: 'image/png' },
  ],
  ...overrides,
});

const files: DispatchAttachment[] = [
  { filename: 'brief.pdf', contentType: 'application/pdf', content: Buffer.from('%PDF-1.4 hello') },
  { filename: 'logo.png', contentType: 'image/png', content: Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 255, 0, 128]) },
];

describe('host email template', () => {
  const lead = makeLead();
  const mail = renderHostEmail(lead);

  it('builds the subject from name, services, budget and reference', () => {
    expect(mail.subject).toBe(
      '[New Order Request] Amelia Hart — Web Design & Development, Content Writing & Copywriting — $5,000 – $15,000 — TSL-20261109-ABC234',
    );
  });

  it('includes every detail in both the HTML and the plain-text versions', () => {
    for (const part of ['Amelia Hart', 'amelia@example.com', '+1 555 010 2040', 'Northwind Coffee', '1 – 3 months', 'Cost calculator', 'TSL-20261109-ABC234', 'brief.pdf', 'logo.png']) {
      expect(mail.html, `html: ${part}`).toContain(part.replace(/&/g, '&amp;'));
      expect(mail.text, `text: ${part}`).toContain(part);
    }
    expect(mail.html).toContain('We need a new online store');
    expect(mail.text).toContain('Second line.');
    expect(mail.text).toContain('Web Design & Development (Growth, 5 pages): $3,500');
  });

  it('makes email, phone and links clickable', () => {
    expect(mail.html).toContain('href="mailto:amelia@example.com"');
    expect(mail.html).toContain('href="tel:+15550102040"');
    expect(mail.html).toContain('<a href="https://drive.example.com/brief" ');
    // trailing full stop stays outside the link
    expect(mail.html).toContain('</a>.');
  });

  it('shows the attachment sizes', () => {
    expect(mail.html).toContain('2 KB'); // 2048 bytes
    expect(mail.html).toContain('146 KB'); // 150000 bytes
  });

  it('plain text has no HTML tags', () => {
    expect(mail.text).not.toMatch(/<\/?(table|div|td|a|strong)\b/i);
  });

  it('omits optional blocks that are empty', () => {
    const bare = renderHostEmail(makeLead({ phone: '', company: '', links: '', estimateSummary: '', attachments: [] }));
    expect(bare.html).not.toContain('Reference links');
    expect(bare.html).not.toContain('Calculator estimate');
    expect(bare.html).not.toContain('tel:');
    expect(bare.html).toContain('No attachments.');
    expect(bare.text).toContain('ATTACHMENTS (0)');
    expect(bare.text).not.toContain('Phone:');
  });

  it('warns about archives, and only when one is attached', () => {
    const zipped = renderHostEmail(makeLead({ attachments: [{ filename: 'assets.zip', sizeBytes: 10, contentType: 'application/zip' }] }));
    expect(zipped.html).toContain('Archives (.zip) are not opened or scanned');
    expect(zipped.text).toContain('archives (.zip) are not opened or scanned');
    expect(mail.html).not.toContain('Archives (.zip)');
  });

  it('escapes HTML a visitor tries to inject', () => {
    const hostile = renderHostEmail(
      makeLead({
        name: '<script>alert("x")</script>',
        company: '"><img src=x onerror=alert(1)>',
        description: '<b onmouseover=alert(1)>hi</b> <iframe src="https://evil.test"></iframe>',
        links: 'javascript:alert(1) and https://ok.example.com/path?a=1&b=2',
        estimateSummary: '<style>body{display:none}</style>',
        attachments: [{ filename: '<svg onload=alert(1)>.pdf', sizeBytes: 1, contentType: 'application/pdf' }],
      }),
    );
    for (const dangerous of ['<script>alert', '<img src=x', '<iframe', '<b onmouseover', '<style>body', '<svg onload']) {
      expect(hostile.html, dangerous).not.toContain(dangerous);
    }
    expect(hostile.html).toContain('&lt;script&gt;');
    // javascript: is never turned into a link; a normal https link still is, with the ampersand escaped
    expect(hostile.html).not.toContain('href="javascript');
    expect(hostile.html).toContain('href="https://ok.example.com/path?a=1&amp;b=2"');
  });

  it('cannot be used for header injection through the name', () => {
    const injected = renderHostEmail(makeLead({ name: 'Eve\r\nBcc: attacker@evil.test\nX-Evil: 1' }));
    expect(injected.subject).not.toMatch(/[\r\n]/);
  });
});

describe('client confirmation template', () => {
  const mail = renderClientConfirmation(makeLead(), 'owner@topsmartllc.com');

  it('greets by first name, quotes the reference and never lists file names', () => {
    expect(mail.subject).toBe('We received your request (TSL-20261109-ABC234)');
    expect(mail.html).toContain('Hi Amelia');
    expect(mail.html).toContain('TSL-20261109-ABC234');
    expect(mail.text).toContain('Attached files received: 2');
    expect(mail.html).not.toContain('brief.pdf');
    expect(mail.text).not.toContain('brief.pdf');
  });

  it('escapes the visitor name', () => {
    const hostile = renderClientConfirmation(makeLead({ name: '<script>x</script>' }), 'o@x.com');
    expect(hostile.html).not.toContain('<script>x');
  });
});

describe('address formatting', () => {
  it('formats a safe display name and removes injection characters', () => {
    expect(formatAddress({ name: 'Amelia Hart', address: 'a@b.com' })).toBe('"Amelia Hart" <a@b.com>');
    expect(formatAddress({ name: 'Eve" <x@evil.test>\r\nBcc: y', address: 'a@b.com' })).toBe('"Eve x@evil.test Bcc: y" <a@b.com>');
    expect(formatAddress({ address: 'plain@b.com' })).toBe('plain@b.com');
  });

  it('parses plain and named addresses', () => {
    expect(parseAddress('a@b.com')).toEqual({ address: 'a@b.com' });
    expect(parseAddress('a@b.com', 'Site')).toEqual({ name: 'Site', address: 'a@b.com' });
    expect(parseAddress('"Orders Desk" <orders@b.com>')).toEqual({ name: 'Orders Desk', address: 'orders@b.com' });
    expect(parseAddress('not-an-email')).toBeNull();
    expect(parseAddress('a@b')).toBeNull();
    expect(parseAddress(undefined)).toBeNull();
  });
});

describe('live configuration check', () => {
  beforeEach(() => {
    for (const key of ['CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'RESEND_API_KEY', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_SECURE']) vi.stubEnv(key, '');
    vi.stubEnv('LEAD_DISPATCH_MODE', 'live');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('lists every missing variable at once, by name only', () => {
    vi.stubEnv('RESEND_API_KEY', 're_secret_value');
    const result = checkLiveConfig(getServerEnv());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.problems).toEqual(['CONTACT_TO_EMAIL is not set', 'CONTACT_FROM_EMAIL is not set']);
      expect(JSON.stringify(result)).not.toContain('re_secret_value');
    }
  });

  it('accepts a complete Resend setup and names the sender', () => {
    vi.stubEnv('RESEND_API_KEY', 're_x');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@topsmartllc.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'orders@topsmartllc.com');
    const result = checkLiveConfig(getServerEnv());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.from).toEqual({ name: 'TopSmartLLC Website', address: 'orders@topsmartllc.com' });
      expect(result.config.to).toEqual([{ address: 'owner@topsmartllc.com' }]);
      expect(result.config.provider.kind).toBe('resend');
    }
  });

  it('supports several recipients and rejects invalid or too many', () => {
    vi.stubEnv('RESEND_API_KEY', 're_x');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'orders@topsmartllc.com');
    vi.stubEnv('CONTACT_TO_EMAIL', 'a@x.com, b@x.com');
    const ok = checkLiveConfig(getServerEnv());
    expect(ok.ok && ok.config.to).toHaveLength(2);

    vi.stubEnv('CONTACT_TO_EMAIL', 'a@x.com, nope');
    expect(checkLiveConfig(getServerEnv())).toEqual({ ok: false, problems: ['CONTACT_TO_EMAIL contains an invalid email address'] });

    vi.stubEnv('CONTACT_TO_EMAIL', 'a@x.com,b@x.com,c@x.com,d@x.com,e@x.com,f@x.com');
    expect(checkLiveConfig(getServerEnv())).toEqual({ ok: false, problems: ['CONTACT_TO_EMAIL has more than 5 recipients'] });
  });

  it('defaults SMTP to a secure connection on port 465 and honours explicit settings', () => {
    vi.stubEnv('EMAIL_PROVIDER', 'smtp');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@x.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'orders@x.com');
    vi.stubEnv('SMTP_HOST', 'smtp.example.com');
    const defaults = checkLiveConfig(getServerEnv());
    expect(defaults.ok && defaults.config.provider).toEqual({
      kind: 'smtp',
      smtp: { host: 'smtp.example.com', port: 465, secure: true, user: undefined, pass: undefined },
    });

    vi.stubEnv('SMTP_PORT', '587');
    vi.stubEnv('SMTP_SECURE', 'false');
    vi.stubEnv('SMTP_USER', 'u');
    vi.stubEnv('SMTP_PASS', 'p');
    const explicit = checkLiveConfig(getServerEnv());
    expect(explicit.ok && explicit.config.provider).toEqual({
      kind: 'smtp',
      smtp: { host: 'smtp.example.com', port: 587, secure: false, user: 'u', pass: 'p' },
    });
  });

  it('requires SMTP user and password together', () => {
    vi.stubEnv('EMAIL_PROVIDER', 'smtp');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@x.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'orders@x.com');
    vi.stubEnv('SMTP_HOST', 'smtp.example.com');
    vi.stubEnv('SMTP_USER', 'only-user');
    expect(checkLiveConfig(getServerEnv())).toEqual({ ok: false, problems: ['SMTP_USER and SMTP_PASS must be set together'] });
  });
});

describe('Resend transport', () => {
  const message: EmailMessage = {
    from: { name: 'TopSmartLLC Website', address: 'orders@topsmartllc.com' },
    to: [{ address: 'owner@topsmartllc.com' }],
    replyTo: { name: 'Amelia Hart', address: 'amelia@example.com' },
    subject: 'Hello',
    html: '<p>Hi</p>',
    text: 'Hi',
    attachments: [{ filename: 'logo.png', contentType: 'image/png', content: files[1]!.content }],
  };

  it('posts the documented request shape with the attachment bytes intact', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'abc-123' }), { status: 200 }));
    const result = await createResendTransport({ apiKey: 're_test', fetchImpl }).send(message);

    expect(result).toEqual({ id: 'abc-123' });
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test');

    const body = JSON.parse(init.body as string);
    expect(body.from).toBe('"TopSmartLLC Website" <orders@topsmartllc.com>');
    expect(body.to).toEqual(['owner@topsmartllc.com']);
    expect(body.reply_to).toBe('"Amelia Hart" <amelia@example.com>');
    expect(body).toMatchObject({ subject: 'Hello', html: '<p>Hi</p>', text: 'Hi' });
    expect(body.attachments).toHaveLength(1);
    expect(body.attachments[0].filename).toBe('logo.png');
    expect(Buffer.from(body.attachments[0].content, 'base64').equals(files[1]!.content)).toBe(true);
  });

  it('omits attachments and reply_to when there are none', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    await createResendTransport({ apiKey: 'k', fetchImpl }).send({ ...message, attachments: [], replyTo: undefined });
    const body = JSON.parse((fetchImpl.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(body).not.toHaveProperty('attachments');
    expect(body).not.toHaveProperty('reply_to');
  });

  it('turns an API rejection into an error with status and reason but never the key', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ name: 'validation_error', message: 'The topsmartllc.com domain is not verified.' }), { status: 403 }),
    );
    const error = await createResendTransport({ apiKey: 're_SECRET', fetchImpl }).send(message).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(EmailSendError);
    expect((error as EmailSendError).status).toBe(403);
    expect((error as Error).message).toContain('validation_error');
    expect((error as Error).message).toContain('domain is not verified');
    expect((error as Error).message).not.toContain('re_SECRET');
  });

  it('copes with a non-JSON error body and a network failure', async () => {
    const html502 = vi.fn().mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }));
    await expect(createResendTransport({ apiKey: 'k', fetchImpl: html502 }).send(message)).rejects.toThrow('HTTP 502');

    const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    await expect(createResendTransport({ apiKey: 'k', fetchImpl: offline }).send(message)).rejects.toThrow('Could not reach Resend: fetch failed');
  });

  it('gives up after the timeout instead of hanging the visitor', async () => {
    const hang = vi.fn((_url: string, init: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    }));
    await expect(
      createResendTransport({ apiKey: 'k', fetchImpl: hang as unknown as typeof fetch, timeoutMs: 20 }).send(message),
    ).rejects.toThrow('did not respond');
  });

  it('can target a stand-in server through baseUrl', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    await createResendTransport({ apiKey: 'k', baseUrl: 'http://127.0.0.1:9999/', fetchImpl }).send(message);
    expect((fetchImpl.mock.calls[0] as [string])[0]).toBe('http://127.0.0.1:9999/emails');
  });
});


/** Reads a header from raw MIME, unfolding lines and decoding RFC 2047 "=?UTF-8?Q?...?=" words like a mail client. */
function readHeader(raw: string, name: string): string {
  const head = raw.split(/\r?\n\r?\n/)[0] ?? '';
  const unfolded = head.replace(/\r?\n[ \t]+/g, ' ');
  const line = unfolded.split(/\r?\n/).find((l) => l.toLowerCase().startsWith(`${name.toLowerCase()}:`)) ?? '';
  const value = line.slice(name.length + 1).trim();
  return value
    .replace(/\?= =\?UTF-8\?Q\?/g, '')
    .replace(/=\?UTF-8\?Q\?([^?]*)\?=/g, (_m, encoded: string) => {
      const bytes: number[] = [];
      for (let i = 0; i < encoded.length; i++) {
        if (encoded[i] === '_') bytes.push(0x20);
        else if (encoded[i] === '=') {
          bytes.push(parseInt(encoded.slice(i + 1, i + 3), 16));
          i += 2;
        } else bytes.push(encoded.charCodeAt(i));
      }
      return Buffer.from(bytes).toString('utf8');
    });
}

describe('SMTP transport (real MIME built by nodemailer, no network)', () => {
  const build = async (message: EmailMessage) => {
    const stream = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
    let raw = '';
    const mailer = {
      sendMail: async (options: Record<string, unknown>) => {
        const info = await stream.sendMail(options);
        raw = (info as unknown as { message: Buffer }).message.toString('utf8');
        return info;
      },
    };
    await createSmtpTransport({ host: 'x', port: 465, secure: true }, mailer).send(message);
    return raw;
  };

  const message: EmailMessage = {
    from: { name: 'TopSmartLLC Website', address: 'orders@topsmartllc.com' },
    to: [{ address: 'owner@topsmartllc.com' }],
    replyTo: { name: 'Amelia Hart', address: 'amelia@example.com' },
    subject: '[New Order Request] Amelia — Web',
    html: '<p>Hello</p>',
    text: 'Hello',
    attachments: [
      { filename: 'brief.pdf', contentType: 'application/pdf', content: files[0]!.content },
      { filename: 'logo.png', contentType: 'image/png', content: files[1]!.content },
    ],
  };

  it('produces a multipart message with headers, both bodies and every attachment', async () => {
    const raw = await build(message);
    expect(raw).toMatch(/^From: "?TopSmartLLC Website"? <orders@topsmartllc.com>/m);
    expect(raw).toMatch(/^To: owner@topsmartllc.com/m);
    expect(raw).toMatch(/^Reply-To: "?Amelia Hart"? <amelia@example.com>/m);
    expect(readHeader(raw, 'Subject')).toBe('[New Order Request] Amelia — Web');
    expect(raw).toContain('multipart/mixed');
    expect(raw).toContain('multipart/alternative');
    expect(raw).toContain('Content-Type: text/plain');
    expect(raw).toContain('Content-Type: text/html');
    expect(raw).toContain('filename=brief.pdf');
    expect(raw).toContain('filename=logo.png');
    expect(raw).toContain('Content-Type: image/png');
    expect(raw).toContain(files[1]!.content.toString('base64'));
    expect(raw).toContain(files[0]!.content.toString('base64'));
  });

  it('wraps transport failures in EmailSendError', async () => {
    const failing = { sendMail: vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED')) };
    await expect(createSmtpTransport({ host: 'x', port: 25, secure: false }, failing).send(message)).rejects.toThrow(
      'SMTP send failed: connect ECONNREFUSED',
    );
  });
});

describe('webhook', () => {
  const lead = makeLead();

  it('builds a Slack-compatible payload that carries file names but never file contents', () => {
    const payload = buildWebhookPayload(lead);
    expect(payload.text).toContain('TSL-20261109-ABC234');
    expect(payload.text).toContain('Web Design & Development, Content Writing & Copywriting');
    expect(payload.referenceId).toBe('TSL-20261109-ABC234');
    expect(payload.attachments).toEqual(lead.attachments);
    expect(JSON.stringify(payload)).not.toContain('base64');
  });

  it('retries once and succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(new Response('', { status: 500 })).mockResolvedValueOnce(new Response('ok', { status: 200 }));
    await expect(sendWebhook('https://hooks.example.com/x', lead, { fetchImpl })).resolves.toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('throws after the retry is used up', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
    await expect(sendWebhook('https://hooks.example.com/x', lead, { fetchImpl })).rejects.toThrow('HTTP 503');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('rejects an invalid or non-http URL without calling out', async () => {
    const fetchImpl = vi.fn();
    await expect(sendWebhook('ftp://x', lead, { fetchImpl })).rejects.toThrow('not a valid http(s) URL');
    await expect(sendWebhook('nonsense', lead, { fetchImpl })).rejects.toThrow('not a valid');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('dispatchLead', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  const liveEnv = (extra: Record<string, string> = {}) => {
    vi.stubEnv('LEAD_DISPATCH_MODE', 'live');
    vi.stubEnv('EMAIL_PROVIDER', 'resend');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('CONTACT_TO_EMAIL', 'owner@topsmartllc.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'orders@topsmartllc.com');
    vi.stubEnv('SEND_CLIENT_CONFIRMATION', 'true');
    vi.stubEnv('WEBHOOK_URL', '');
    for (const [k, v] of Object.entries(extra)) vi.stubEnv(k, v);
    return getServerEnv();
  };

  const fakeTransport = (behaviour: (message: EmailMessage, call: number) => Promise<{ id?: string }> = async () => ({ id: 'ok' })) => {
    const sent: EmailMessage[] = [];
    const transport: EmailTransport = {
      send: vi.fn(async (message: EmailMessage) => {
        sent.push(message);
        return behaviour(message, sent.length);
      }),
    };
    return { transport, sent };
  };

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('mock mode sends nothing and logs no personal data', async () => {
    vi.stubEnv('LEAD_DISPATCH_MODE', 'mock');
    const { transport } = fakeTransport();
    const result = await dispatchLead(makeLead(), files, getServerEnv(), { createTransport: () => transport });
    expect(result).toEqual({ ok: true });
    expect(transport.send).not.toHaveBeenCalled();
    const logged = JSON.stringify(logSpy.mock.calls);
    expect(logged).toContain('brief.pdf');
    for (const pii of ['Amelia', 'amelia@example.com', '555', 'online store']) expect(logged).not.toContain(pii);
  });

  it('live mode with missing settings fails clearly and attempts nothing', async () => {
    vi.stubEnv('LEAD_DISPATCH_MODE', 'live');
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('CONTACT_TO_EMAIL', '');
    vi.stubEnv('CONTACT_FROM_EMAIL', '');
    const createTransport = vi.fn();
    const result = await dispatchLead(makeLead(), files, getServerEnv(), { createTransport });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toContain('CONTACT_TO_EMAIL is not set');
    expect(createTransport).not.toHaveBeenCalled();
  });

  it('live mode delivers the host email with every attachment, then a confirmation to the client', async () => {
    const { transport, sent } = fakeTransport();
    const result = await dispatchLead(makeLead(), files, liveEnv(), { createTransport: () => transport });

    expect(result).toEqual({ ok: true });
    expect(sent).toHaveLength(2);

    const [host, confirmation] = sent as [EmailMessage, EmailMessage];
    expect(host.to).toEqual([{ address: 'owner@topsmartllc.com' }]);
    expect(host.from).toEqual({ name: 'TopSmartLLC Website', address: 'orders@topsmartllc.com' });
    expect(host.replyTo).toEqual({ name: 'Amelia Hart', address: 'amelia@example.com' });
    expect(host.subject).toContain('[New Order Request] Amelia Hart');
    expect(host.html).toContain('Northwind Coffee');
    expect(host.attachments).toHaveLength(2);
    expect(host.attachments![1]!.content.equals(files[1]!.content)).toBe(true);
    expect(host.attachments![0]!.filename).toBe('brief.pdf');

    expect(confirmation.to).toEqual([{ name: 'Amelia Hart', address: 'amelia@example.com' }]);
    expect(confirmation.replyTo).toEqual({ address: 'owner@topsmartllc.com' });
    expect(confirmation.attachments ?? []).toHaveLength(0);
    expect(confirmation.subject).toContain('We received your request');
  });

  it('skips the client confirmation when it is switched off', async () => {
    const { transport, sent } = fakeTransport();
    await dispatchLead(makeLead(), files, liveEnv({ SEND_CLIENT_CONFIRMATION: 'false' }), { createTransport: () => transport });
    expect(sent).toHaveLength(1);
  });

  it('reports failure, and sends no confirmation or webhook, when the host email is rejected', async () => {
    const { transport, sent } = fakeTransport(async () => {
      throw new EmailSendError('Resend rejected the email (HTTP 403, validation_error)', 403);
    });
    const webhook = vi.fn().mockResolvedValue(undefined);
    const result = await dispatchLead(makeLead(), files, liveEnv({ WEBHOOK_URL: 'https://hooks.example.com/x' }), {
      createTransport: () => transport,
      sendWebhook: webhook,
    });
    expect(result).toEqual({ ok: false, reason: 'Resend rejected the email (HTTP 403, validation_error)' });
    expect(sent).toHaveLength(1);
    expect(webhook).not.toHaveBeenCalled();
  });

  it('still succeeds when only the confirmation fails, and logs the reference without personal data', async () => {
    const { transport } = fakeTransport(async (_message, call) => {
      if (call === 2) throw new EmailSendError('client mailbox unavailable');
      return { id: 'ok' };
    });
    const result = await dispatchLead(makeLead(), files, liveEnv(), { createTransport: () => transport });
    expect(result).toEqual({ ok: true });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain('client-confirmation failed');
    expect(logged).toContain('TSL-20261109-ABC234');
    expect(logged).not.toContain('amelia@example.com');
  });

  it('calls the webhook after the host email, and a webhook failure does not fail the request', async () => {
    const { transport } = fakeTransport();
    const okWebhook = vi.fn().mockResolvedValue(undefined);
    const env = liveEnv({ WEBHOOK_URL: 'https://hooks.example.com/x' });
    expect(await dispatchLead(makeLead(), files, env, { createTransport: () => transport, sendWebhook: okWebhook })).toEqual({ ok: true });
    expect(okWebhook).toHaveBeenCalledWith('https://hooks.example.com/x', expect.objectContaining({ referenceId: 'TSL-20261109-ABC234' }));

    const badWebhook = vi.fn().mockRejectedValue(new Error('HTTP 500'));
    expect(await dispatchLead(makeLead(), files, env, { createTransport: () => transport, sendWebhook: badWebhook })).toEqual({ ok: true });
    expect(JSON.stringify(errorSpy.mock.calls)).toContain('webhook failed');
  });
});
