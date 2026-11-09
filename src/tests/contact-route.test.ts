// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/contact/route';

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const PDF = new TextEncoder().encode('%PDF-1.4 sample');
const EXE = Uint8Array.from([0x4d, 0x5a, 0x90, 0x00, 0x03]);

let ipCounter = 0;
const nextIp = () => `10.0.0.${++ipCounter}`;

const validFields: Record<string, string | string[]> = {
  name: 'Amelia Hart',
  email: 'amelia@example.com',
  phone: '+1 555 010 2040',
  company: 'Northwind Coffee',
  services: ['web', 'content'],
  budget: '5k-15k',
  timeline: '1-3-months',
  description: 'We need a new online store with product pages and a blog.',
  links: 'https://drive.example.com/brief',
  consent: 'true',
  source: 'contact',
};

function buildRequest(
  overrides: Record<string, string | string[]> = {},
  files: { name: string; bytes: Uint8Array<ArrayBuffer>; type?: string }[] = [],
  ip = nextIp(),
) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ ...validFields, ...overrides })) {
    if (Array.isArray(value)) value.forEach((v) => form.append(key, v));
    else form.append(key, value);
  }
  for (const file of files) {
    form.append('attachments', new File([file.bytes], file.name, { type: file.type ?? 'application/octet-stream' }));
  }
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    body: form,
    headers: { 'x-forwarded-for': ip },
  });
}

let logSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv('LEAD_DISPATCH_MODE', 'mock');
  vi.stubEnv('RATE_LIMIT_PER_MINUTE', '5');
  vi.stubEnv('MAX_UPLOAD_MB', '4');
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('accepts a valid request and returns a reference id', async () => {
    const res = await POST(buildRequest());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.referenceId).toMatch(/^TSL-\d{8}-[A-Z2-9]{6}$/);
    expect(body.attachmentsReceived).toBe(0);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('accepts valid attachments and logs only a redacted summary in mock mode', async () => {
    const res = await POST(
      buildRequest({}, [
        { name: 'brief.pdf', bytes: PDF },
        { name: 'logo.png', bytes: PNG },
      ]),
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.attachmentsReceived).toBe(2);

    const logged = JSON.stringify(logSpy.mock.calls);
    expect(logged).toContain('brief.pdf');
    expect(logged).not.toContain('Amelia');
    expect(logged).not.toContain('amelia@example.com');
    expect(logged).not.toContain('online store');
  });

  it('returns 400 with per-field messages for invalid input', async () => {
    const res = await POST(buildRequest({ email: 'not-an-email', services: [], description: 'short', consent: 'false' }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.fields.email).toBe('Please enter a valid email address.');
    expect(body.error.fields.services).toBe('Select at least one service.');
    expect(body.error.fields.description).toBe('Tell us a bit more (at least 20 characters).');
    expect(body.error.fields.consent).toBe('Please accept the privacy terms to continue.');
  });

  it('rejects an unknown service or budget value', async () => {
    const res = await POST(buildRequest({ services: ['web', 'hacking'], budget: 'free' }));
    expect(res.status).toBe(400);
  });

  it('treats an optional empty phone and company as valid', async () => {
    const res = await POST(buildRequest({ phone: '', company: '' }));
    expect(res.status).toBe(200);
  });

  it('returns 200 but does nothing when the honeypot is filled', async () => {
    const res = await POST(buildRequest({ website: 'http://spam.example', email: 'bad' }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('returns 415 for a disallowed file type', async () => {
    const res = await POST(buildRequest({}, [{ name: 'setup.exe', bytes: EXE }]));
    const body = await res.json();
    expect(res.status).toBe(415);
    expect(body.error.code).toBe('FILE_TYPE_NOT_ALLOWED');
    expect(body.error.fields.attachments).toContain("isn't an allowed file type");
  });

  it('returns 415 when the content does not match the extension', async () => {
    const res = await POST(buildRequest({}, [{ name: 'photo.png', bytes: EXE }]));
    const body = await res.json();
    expect(res.status).toBe(415);
    expect(body.error.fields.attachments).toContain('corrupted');
  });

  it('returns 413 for more than 5 files', async () => {
    const files = Array.from({ length: 6 }, (_, i) => ({ name: `f${i}.pdf`, bytes: PDF }));
    const res = await POST(buildRequest({}, files));
    expect(res.status).toBe(413);
  });

  it('returns 413 when the total size is over the limit', async () => {
    vi.stubEnv('MAX_UPLOAD_MB', '1');
    const big = new Uint8Array(1024 * 1024 + 10);
    big.set(PDF);
    const res = await POST(buildRequest({}, [{ name: 'big.pdf', bytes: big }]));
    const body = await res.json();
    expect(res.status).toBe(413);
    expect(body.error.message).toContain('1 MB or less');
  });

  it('returns 413 early when content-length is far over the limit', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: 'x',
      headers: { 'content-length': String(50 * 1024 * 1024), 'x-forwarded-for': nextIp(), 'content-type': 'text/plain' },
    });
    const res = await POST(request);
    expect(res.status).toBe(413);
  });

  it('returns 429 with Retry-After after too many requests from one IP', async () => {
    const ip = nextIp();
    for (let i = 0; i < 5; i++) expect((await POST(buildRequest({}, [], ip))).status).toBe(200);
    const res = await POST(buildRequest({}, [], ip));
    const body = await res.json();
    expect(res.status).toBe(429);
    expect(body.error.code).toBe('RATE_LIMITED');
    expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it('returns 502 in live mode until email transport exists, never a false success', async () => {
    vi.stubEnv('LEAD_DISPATCH_MODE', 'live');
    const res = await POST(buildRequest());
    const body = await res.json();
    expect(res.status).toBe(502);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('DISPATCH_FAILED');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('returns 400 for a body that is not form data', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: '{"name":"x"}',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': nextIp() },
    });
    const res = await POST(request);
    expect(res.status).toBe(400);
  });
});
