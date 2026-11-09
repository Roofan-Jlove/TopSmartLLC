// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/dev/email-preview/route';

afterEach(() => vi.unstubAllEnvs());

const call = (query = '') => GET(new Request(`http://localhost/api/dev/email-preview${query}`));

describe('email preview route', () => {
  it('is disabled in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const res = await call();
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain('Amelia');
  });

  it('renders the host email as HTML in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const res = await call('?type=host');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('New order request');
  });

  it('renders the client confirmation and the plain-text version', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(await (await call('?type=client')).text()).toContain('Request received');
    const text = await (await call('?type=text')).text();
    expect(text.startsWith('Subject: [New Order Request]')).toBe(true);
  });
});
