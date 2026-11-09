import { services } from '@/data/services';
import type { LeadRecord } from '../schemas/lead';

type FetchLike = typeof fetch;

const SERVICE_NAME = Object.fromEntries(services.map((s) => [s.key, s.name]));

/** Body for Slack, Zapier, Make or a CRM. `text` makes it work as a Slack incoming webhook; file contents are never included. */
export function buildWebhookPayload(lead: LeadRecord) {
  const names = lead.services.map((key) => SERVICE_NAME[key] ?? key).join(', ');
  const files = lead.attachments.length;
  return {
    text: `New order request ${lead.referenceId}: ${lead.name} (${lead.email}) wants ${names}. Budget ${lead.budget}, timeline ${lead.timeline}, ${files} ${files === 1 ? 'attachment' : 'attachments'}.`,
    ...lead,
  };
}

export function isValidWebhookUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** POSTs JSON with a timeout and one retry. Throws if every attempt fails. */
export async function sendWebhook(
  url: string,
  lead: LeadRecord,
  options: { fetchImpl?: FetchLike; timeoutMs?: number; retries?: number } = {},
): Promise<void> {
  const { fetchImpl = fetch, timeoutMs = 5000, retries = 1 } = options;
  if (!isValidWebhookUrl(url)) throw new Error('WEBHOOK_URL is not a valid http(s) URL');

  const body = JSON.stringify(buildWebhookPayload(lead));
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });
      if (response.ok) return;
      lastError = new Error(`webhook responded with HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('webhook failed');
}
