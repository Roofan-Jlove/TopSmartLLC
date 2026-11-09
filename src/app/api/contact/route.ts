import { NextResponse } from 'next/server';
import { site } from '@/data/site';
import type { ApiErrorCode, ContactResponse } from '@/lib/api-types';
import { dispatchLead, type DispatchAttachment } from '@/lib/email/dispatch';
import { getServerEnv } from '@/lib/env';
import { matchesFileSignature } from '@/lib/magic-bytes';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { generateReferenceId } from '@/lib/reference-id';
import { sanitizeFilename, uniqueFilenames } from '@/lib/sanitize';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES,
  fileMessages,
  getExtension,
  isAllowedExtension,
} from '@/lib/schemas/files';
import { leadSchema, type LeadRecord } from '@/lib/schemas/lead';
import { omit } from '@/lib/utils';

export const runtime = 'nodejs';
export const maxDuration = 30;

/** Allowance for text fields and multipart framing on top of the attachment limit. */
const FORM_OVERHEAD_BYTES = 100 * 1024;

function respond(body: ContactResponse, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

function fail(
  status: number,
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string>,
  headers?: Record<string, string>,
) {
  return respond({ ok: false, error: { code, message, ...(fields ? { fields } : {}) } }, status, headers);
}

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const env = getServerEnv();

  // 1. Rate limit.
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip, env.rateLimitPerMinute);
  if (!limit.allowed) {
    return fail(429, 'RATE_LIMITED', 'Too many requests. Please wait a minute and try again.', undefined, {
      'Retry-After': String(limit.retryAfterSeconds),
    });
  }

  // 2. Reject oversized bodies before reading them.
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > env.maxUploadBytes + FORM_OVERHEAD_BYTES) {
    return fail(413, 'PAYLOAD_TOO_LARGE', fileMessages.size(env.maxUploadBytes));
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'INVALID_REQUEST', 'We could not read your request. Please try again.');
  }

  // 3. Honeypot: look successful to bots, send nothing.
  if (text(form, 'website').trim() !== '') {
    return respond({ ok: true, referenceId: generateReferenceId(), attachmentsReceived: 0 }, 200);
  }

  // 4. Validate fields.
  const parsed = leadSchema.safeParse({
    name: text(form, 'name'),
    email: text(form, 'email'),
    phone: text(form, 'phone'),
    company: text(form, 'company'),
    services: form.getAll('services').filter((value): value is string => typeof value === 'string'),
    budget: text(form, 'budget'),
    timeline: text(form, 'timeline'),
    description: text(form, 'description'),
    links: text(form, 'links'),
    estimateSummary: text(form, 'estimateSummary'),
    consent: text(form, 'consent') === 'true',
    source: text(form, 'source') || 'contact',
  });

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!(key in fields)) fields[key] = issue.message;
    }
    return fail(400, 'VALIDATION_ERROR', 'Please fix the highlighted fields.', fields);
  }
  const lead = omit(parsed.data, 'consent');

  // 5. Validate attachments.
  const files = form
    .getAll('attachments')
    .filter((value): value is File => typeof value !== 'string' && value.size > 0);

  if (files.length > MAX_FILES) return fail(413, 'PAYLOAD_TOO_LARGE', fileMessages.count, { attachments: fileMessages.count });
  if (files.reduce((sum, file) => sum + file.size, 0) > env.maxUploadBytes) {
    const message = fileMessages.size(env.maxUploadBytes);
    return fail(413, 'PAYLOAD_TOO_LARGE', message, { attachments: message });
  }

  const safeNames = uniqueFilenames(files.map((file) => sanitizeFilename(file.name)));
  const attachments: DispatchAttachment[] = [];

  for (const [index, file] of files.entries()) {
    const filename = safeNames[index] ?? sanitizeFilename(file.name);
    if (!isAllowedExtension(filename)) {
      const message = fileMessages.type(filename);
      return fail(415, 'FILE_TYPE_NOT_ALLOWED', message, { attachments: message });
    }
    const content = Buffer.from(await file.arrayBuffer());
    if (!matchesFileSignature(filename, content)) {
      const message = fileMessages.corrupt(filename);
      return fail(415, 'FILE_TYPE_NOT_ALLOWED', message, { attachments: message });
    }
    attachments.push({ filename, contentType: ALLOWED_FILE_TYPES[getExtension(filename)]!, content });
  }

  // 6. Deliver.
  const now = new Date().toISOString();
  const record: LeadRecord = {
    ...lead,
    referenceId: generateReferenceId(),
    receivedAt: now,
    consentAt: now,
    attachments: attachments.map((file) => ({
      filename: file.filename,
      sizeBytes: file.content.length,
      contentType: file.contentType,
    })),
    ...(env.SHOW_IP_IN_EMAIL === 'true' ? { ip } : {}),
  };

  try {
    const result = await dispatchLead(record, attachments, env);
    if (!result.ok) {
      console.error('[contact] dispatch failed', { referenceId: record.referenceId, reason: result.reason });
      return fail(502, 'DISPATCH_FAILED', `We couldn't send your request. Please try again or email ${site.email}.`);
    }
  } catch (error) {
    console.error('[contact] dispatch error', {
      referenceId: record.referenceId,
      message: error instanceof Error ? error.message : 'unknown',
    });
    return fail(500, 'DISPATCH_FAILED', `We couldn't send your request. Please try again or email ${site.email}.`);
  }

  return respond({ ok: true, referenceId: record.referenceId, attachmentsReceived: attachments.length }, 200);
}
