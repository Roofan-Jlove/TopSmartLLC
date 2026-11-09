import type { LiveConfig, SmtpConfig } from './config';
import { EmailSendError, formatAddress, type EmailMessage, type EmailTransport } from './types';

type FetchLike = typeof fetch;

const DEFAULT_RESEND_URL = 'https://api.resend.com';

/**
 * Resend over plain HTTPS, so no SDK is needed. Field names follow Resend's "Send Email" reference:
 * `from`, `to`, `subject`, `html`, `text`, `reply_to`, and `attachments[].filename|content` (base64).
 * The attachment content type is derived by Resend from the filename, which we keep correct.
 */
export function createResendTransport(options: {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}): EmailTransport {
  const { apiKey, baseUrl = DEFAULT_RESEND_URL, fetchImpl = fetch, timeoutMs = 15_000 } = options;

  return {
    async send(message: EmailMessage) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/emails`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: formatAddress(message.from),
            to: message.to.map(formatAddress),
            ...(message.replyTo ? { reply_to: formatAddress(message.replyTo) } : {}),
            subject: message.subject,
            html: message.html,
            text: message.text,
            ...(message.attachments?.length
              ? {
                  attachments: message.attachments.map((file) => ({
                    filename: file.filename,
                    content: file.content.toString('base64'),
                  })),
                }
              : {}),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          // Resend error bodies carry a machine name and a message. Never include the request or the key.
          const detail = (await response.json().catch(() => null)) as { name?: string; message?: string } | null;
          throw new EmailSendError(
            `Resend rejected the email (HTTP ${response.status}${detail?.name ? `, ${detail.name}` : ''})${
              detail?.message ? `: ${detail.message}` : ''
            }`,
            response.status,
          );
        }

        const data = (await response.json().catch(() => null)) as { id?: string } | null;
        return { id: data?.id };
      } catch (error) {
        if (error instanceof EmailSendError) throw error;
        if (error instanceof Error && error.name === 'AbortError') {
          throw new EmailSendError(`Resend did not respond within ${timeoutMs / 1000}s`);
        }
        throw new EmailSendError(`Could not reach Resend: ${error instanceof Error ? error.message : 'unknown error'}`);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

type SendMailLike = {
  sendMail(options: Record<string, unknown>): Promise<{ messageId?: string }>;
};

/** SMTP through nodemailer. `mailer` can be replaced in tests to build the message without a network. */
export function createSmtpTransport(config: SmtpConfig, mailer?: SendMailLike): EmailTransport {
  return {
    async send(message: EmailMessage) {
      try {
        const transporter =
          mailer ??
          (await import('nodemailer')).default.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            ...(config.user ? { auth: { user: config.user, pass: config.pass } } : {}),
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 20_000,
          });

        const info = await transporter.sendMail({
          from: formatAddress(message.from),
          to: message.to.map(formatAddress),
          ...(message.replyTo ? { replyTo: formatAddress(message.replyTo) } : {}),
          subject: message.subject,
          html: message.html,
          text: message.text,
          attachments: (message.attachments ?? []).map((file) => ({
            filename: file.filename,
            content: file.content,
            contentType: file.contentType,
          })),
        });
        return { id: info.messageId };
      } catch (error) {
        throw new EmailSendError(`SMTP send failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    },
  };
}

export function createTransportFromConfig(config: LiveConfig): EmailTransport {
  return config.provider.kind === 'resend'
    ? createResendTransport({ apiKey: config.provider.apiKey, baseUrl: config.provider.baseUrl })
    : createSmtpTransport(config.provider.smtp);
}
