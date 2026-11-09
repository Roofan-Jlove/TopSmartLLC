import { NextResponse } from 'next/server';
import { renderClientConfirmation, renderHostEmail } from '@/lib/email/templates';
import type { LeadRecord } from '@/lib/schemas/lead';

export const runtime = 'nodejs';

const sample: LeadRecord = {
  name: 'Amelia Hart',
  email: 'amelia@example.com',
  phone: '+1 555 010 2040',
  company: 'Northwind Coffee',
  services: ['web', 'content'],
  budget: '5k-15k',
  timeline: '1-3-months',
  description:
    'We need a new online store with product pages, a blog and a simple way for staff to update the menu.\n\nOur current site is slow on phones, and customers tell us checkout is confusing.',
  links: 'Current site: https://example.com\nMood board: https://drive.example.com/folder/abc',
  estimateSummary:
    'Web Design & Development (Growth, 15 pages): $3,950\nAdd-on, SEO audit: $350\nEstimated range: $3,870 to $5,160 (calculator midpoint $4,300)',
  source: 'calculator',
  referenceId: 'TSL-20261109-A7K2QX',
  receivedAt: new Date().toISOString(),
  consentAt: new Date().toISOString(),
  attachments: [
    { filename: 'project-brief.pdf', sizeBytes: 482_113, contentType: 'application/pdf' },
    { filename: 'logo-draft.png', sizeBytes: 96_204, contentType: 'image/png' },
  ],
};

/**
 * Development helper: open /api/dev/email-preview?type=host (or client, text) to see the emails as the
 * host and the client will receive them. Disabled in production.
 */
export function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const type = new URL(request.url).searchParams.get('type') ?? 'host';
  const mail = type === 'client' ? renderClientConfirmation(sample, 'owner@topsmartllc.com') : renderHostEmail(sample);

  if (type === 'text') {
    return new NextResponse(`Subject: ${mail.subject}\n\n${mail.text}`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return new NextResponse(mail.html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
