export type EmailAddress = { name?: string; address: string };

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type EmailMessage = {
  from: EmailAddress;
  to: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
};

export type EmailTransport = {
  /** Resolves when the provider has accepted the message. Throws EmailSendError otherwise. */
  send(message: EmailMessage): Promise<{ id?: string }>;
};

export class EmailSendError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'EmailSendError';
  }
}

/** Strips characters that could break out of a header or an RFC 5322 display name. */
export function cleanHeaderText(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** `"Display Name" <address>`, safe against header injection and quote or bracket tricks in the name. */
export function formatAddress({ name, address }: EmailAddress): string {
  const cleanName = cleanHeaderText(name ?? '').replace(/["<>\\]/g, '');
  const cleanAddress = cleanHeaderText(address).replace(/[<>"\s]/g, '');
  return cleanName ? `"${cleanName}" <${cleanAddress}>` : cleanAddress;
}
