import type { ServerEnv } from '../env';
import type { LeadRecord } from '../schemas/lead';
import { checkLiveConfig } from './config';
import { renderClientConfirmation, renderHostEmail } from './templates';
import { createTransportFromConfig } from './transport';
import type { EmailTransport } from './types';
import { sendWebhook } from './webhook';

export type DispatchAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

export type DispatchResult = { ok: true } | { ok: false; reason: string };

/** Seams for tests: swap the real network transports for fakes. */
export type DispatchDeps = {
  createTransport?: (config: import('./config').LiveConfig) => EmailTransport;
  sendWebhook?: typeof sendWebhook;
};

/**
 * The only function the API route calls to deliver a lead.
 *
 *  mock: logs a redacted summary and sends nothing (default for development).
 *  live: the host email is the lead. Success is reported only once the provider has accepted it.
 *        The client confirmation and the webhook are best effort: if they fail we log the reference
 *        id and carry on, because the host already has the lead.
 */
export async function dispatchLead(
  lead: LeadRecord,
  attachments: DispatchAttachment[],
  env: ServerEnv,
  deps: DispatchDeps = {},
): Promise<DispatchResult> {
  if (env.mode === 'mock') {
    // Redacted on purpose: no name, email, phone or message text in logs.
    console.log('[mock-dispatch]', {
      referenceId: lead.referenceId,
      services: lead.services,
      budget: lead.budget,
      timeline: lead.timeline,
      source: lead.source,
      attachments: attachments.map((file) => ({ name: file.filename, bytes: file.content.length })),
    });
    return { ok: true };
  }

  const configured = checkLiveConfig(env);
  if (!configured.ok) {
    return { ok: false, reason: `live mode is not configured: ${configured.problems.join('; ')}` };
  }
  const { config } = configured;
  const transport = (deps.createTransport ?? createTransportFromConfig)(config);

  // 1. The host email. This is the lead, so a failure here fails the whole request.
  const host = renderHostEmail(lead);
  try {
    await transport.send({
      from: config.from,
      to: config.to,
      replyTo: { name: lead.name, address: lead.email },
      subject: host.subject,
      html: host.html,
      text: host.text,
      attachments,
    });
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'email transport failed' };
  }

  // 2. Best-effort extras. Run together, never throw.
  const extras: Promise<void>[] = [];

  if (env.sendClientConfirmation) {
    const confirmation = renderClientConfirmation(lead, config.to[0]!.address);
    extras.push(
      transport
        .send({
          from: config.from,
          to: [{ name: lead.name, address: lead.email }],
          replyTo: config.to[0],
          subject: confirmation.subject,
          html: confirmation.html,
          text: confirmation.text,
        })
        .then(() => undefined)
        .catch((error: unknown) => logExtraFailure('client-confirmation', lead, error)),
    );
  }

  if (env.WEBHOOK_URL) {
    extras.push(
      (deps.sendWebhook ?? sendWebhook)(env.WEBHOOK_URL, lead).catch((error: unknown) =>
        logExtraFailure('webhook', lead, error),
      ),
    );
  }

  await Promise.all(extras);
  return { ok: true };
}

function logExtraFailure(kind: string, lead: LeadRecord, error: unknown) {
  // Reference id and error text only: no personal data.
  console.error(`[contact] ${kind} failed`, {
    referenceId: lead.referenceId,
    message: error instanceof Error ? error.message : 'unknown',
  });
}
