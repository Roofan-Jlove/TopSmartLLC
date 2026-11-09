import { budgetOptions, timelineOptions } from '@/data/options';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { escapeHtml } from '../sanitize';
import { formatBytes, getExtension } from '../schemas/files';
import type { LeadRecord } from '../schemas/lead';
import { cleanHeaderText } from './types';

export type RenderedEmail = { subject: string; html: string; text: string };

const SERVICE_NAME = Object.fromEntries(services.map((s) => [s.key, s.name]));
const BUDGET_LABEL = Object.fromEntries(budgetOptions.map((o) => [o.value, o.label]));
const TIMELINE_LABEL = Object.fromEntries(timelineOptions.map((o) => [o.value, o.label]));
const SOURCE_LABEL: Record<string, string> = {
  contact: 'Contact page',
  calculator: 'Cost calculator',
  'service-page': 'Service or portfolio page',
};

const COLOR = { ink: '#0b1020', muted: '#4b5573', border: '#e3e7f5', page: '#f5f7ff', brand: '#4f46e5', deep: '#3730a3' };
const FONT = "font-family:Arial,Helvetica,sans-serif";

const serviceList = (lead: LeadRecord) => lead.services.map((key) => SERVICE_NAME[key] ?? key);
const formatUtc = (iso: string) => new Date(iso).toUTCString();
const hasArchive = (lead: LeadRecord) => lead.attachments.some((file) => getExtension(file.filename) === 'zip');

/** Turns http(s) URLs in already-escaped text into links. Other schemes (javascript:, data:) are never linked. */
function linkify(escaped: string): string {
  return escaped.replace(/https?:\/\/[^\s<]+/g, (match) => {
    const trailing = /[.,;:!?)\]]+$/.exec(match)?.[0] ?? '';
    const url = trailing ? match.slice(0, -trailing.length) : match;
    return `<a href="${url}" style="color:${COLOR.brand}">${url}</a>${trailing}`;
  });
}

const multiline = (value: string) =>
  `<div style="white-space:pre-wrap;word-wrap:break-word;line-height:1.55">${linkify(escapeHtml(value))}</div>`;

function row(label: string, valueHtml: string): string {
  return `<tr>
<td style="padding:6px 16px 6px 0;vertical-align:top;color:${COLOR.muted};font-size:13px;width:110px">${escapeHtml(label)}</td>
<td style="padding:6px 0;vertical-align:top;font-size:15px;color:${COLOR.ink}">${valueHtml}</td>
</tr>`;
}

function section(title: string, inner: string): string {
  return `<tr><td style="padding:20px 28px 4px 28px">
<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${COLOR.brand};font-weight:bold;padding-bottom:8px;border-bottom:1px solid ${COLOR.border}">${escapeHtml(title)}</div>
<div style="padding-top:10px">${inner}</div>
</td></tr>`;
}

function shell(preheader: string, headerTitle: string, headerSub: string, body: string, footer: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(headerTitle)}</title></head>
<body style="margin:0;padding:0;background:${COLOR.page};${FONT};color:${COLOR.ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.page}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid ${COLOR.border};border-radius:12px;overflow:hidden">
<tr><td style="background:${COLOR.deep};padding:24px 28px;color:#ffffff">
<div style="font-size:13px;opacity:0.85">${escapeHtml(site.name)}</div>
<div style="font-size:24px;font-weight:bold;margin-top:4px">${escapeHtml(headerTitle)}</div>
<div style="font-size:14px;margin-top:6px;opacity:0.9">${headerSub}</div>
</td></tr>
${body}
<tr><td style="padding:24px 28px;font-size:12px;color:${COLOR.muted};border-top:1px solid ${COLOR.border}">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

/** The email the host receives for every order request. */
export function renderHostEmail(lead: LeadRecord): RenderedEmail {
  const names = serviceList(lead);
  const budget = BUDGET_LABEL[lead.budget] ?? lead.budget;
  const timeline = TIMELINE_LABEL[lead.timeline] ?? lead.timeline;
  const source = SOURCE_LABEL[lead.source] ?? lead.source;

  const subject = cleanHeaderText(
    `[New Order Request] ${lead.name} — ${names.join(', ')} — ${budget} — ${lead.referenceId}`,
  );

  const contact = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Name', escapeHtml(lead.name))}
${row('Email', `<a href="mailto:${escapeHtml(lead.email)}" style="color:${COLOR.brand}">${escapeHtml(lead.email)}</a>`)}
${lead.phone ? row('Phone', `<a href="tel:${escapeHtml(lead.phone.replace(/[^+\d]/g, ''))}" style="color:${COLOR.brand}">${escapeHtml(lead.phone)}</a>`) : ''}
${lead.company ? row('Company', escapeHtml(lead.company)) : ''}
</table>`;

  const project = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row('Services', names.map(escapeHtml).join('<br>'))}
${row('Budget', escapeHtml(budget))}
${row('Timeline', escapeHtml(timeline))}
${row('Came from', escapeHtml(source))}
</table>`;

  const attachments =
    lead.attachments.length === 0
      ? `<div style="font-size:14px;color:${COLOR.muted}">No attachments.</div>`
      : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${lead.attachments
  .map(
    (file) =>
      `<tr><td style="padding:5px 0">${escapeHtml(file.filename)}</td><td style="padding:5px 0;color:${COLOR.muted};text-align:right;white-space:nowrap">${formatBytes(file.sizeBytes)}</td></tr>`,
  )
  .join('\n')}
</table>
<div style="margin-top:10px;font-size:12px;color:${COLOR.muted}">Attached to this email. Files were checked for type and content but are not virus-scanned.${
          hasArchive(lead) ? ' <strong>Archives (.zip) are not opened or scanned: open with care.</strong>' : ''
        }</div>`;

  const body = [
    section('Contact', contact),
    section('Project', project),
    section('Description', multiline(lead.description)),
    lead.links ? section('Reference links', multiline(lead.links)) : '',
    lead.estimateSummary ? section('Calculator estimate', multiline(lead.estimateSummary)) : '',
    section(`Attachments (${lead.attachments.length})`, attachments),
  ].join('\n');

  const html = shell(
    `${lead.name} wants ${names.join(', ')}`,
    'New order request',
    `Reference <strong style="font-family:monospace">${escapeHtml(lead.referenceId)}</strong> · reply to this email to answer ${escapeHtml(lead.name)} directly`,
    body,
    `Received ${escapeHtml(formatUtc(lead.receivedAt))}. Consent to the privacy terms was given at ${escapeHtml(formatUtc(lead.consentAt))}.${
      lead.ip ? ` Sender IP: ${escapeHtml(lead.ip)}.` : ''
    }<br>Sent automatically by the ${escapeHtml(site.name)} website. This request is not stored on the website.`,
  );

  const text = [
    `NEW ORDER REQUEST  ${lead.referenceId}`,
    `Reply to this email to answer ${lead.name} directly.`,
    '',
    'CONTACT',
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.phone ? `Phone:   ${lead.phone}` : '',
    lead.company ? `Company: ${lead.company}` : '',
    '',
    'PROJECT',
    `Services: ${names.join(', ')}`,
    `Budget:   ${budget}`,
    `Timeline: ${timeline}`,
    `Came from: ${source}`,
    '',
    'DESCRIPTION',
    lead.description,
    lead.links ? `\nREFERENCE LINKS\n${lead.links}` : '',
    lead.estimateSummary ? `\nCALCULATOR ESTIMATE\n${lead.estimateSummary}` : '',
    '',
    `ATTACHMENTS (${lead.attachments.length})`,
    lead.attachments.length === 0
      ? 'None'
      : lead.attachments.map((f) => `- ${f.filename} (${formatBytes(f.sizeBytes)})`).join('\n'),
    hasArchive(lead) ? 'Warning: archives (.zip) are not opened or scanned. Open with care.' : '',
    '',
    `Received: ${formatUtc(lead.receivedAt)}`,
    `Consent given: ${formatUtc(lead.consentAt)}`,
    lead.ip ? `Sender IP: ${lead.ip}` : '',
  ]
    .filter((line, index, all) => line !== '' || all[index - 1] !== '')
    .join('\n');

  return { subject, html, text };
}

/** Optional receipt sent to the client. Never contains attachments. */
export function renderClientConfirmation(lead: LeadRecord, replyEmail: string): RenderedEmail {
  const names = serviceList(lead);
  const subject = cleanHeaderText(`We received your request (${lead.referenceId})`);
  const firstName = cleanHeaderText(lead.name).split(' ')[0] ?? lead.name;

  const steps = [
    'We read your brief and any files you sent.',
    'We reply with questions, a recommended package and a fixed quote.',
    'You approve the scope and we schedule your project.',
  ];

  const body = `<tr><td style="padding:24px 28px 8px 28px;font-size:16px;line-height:1.6">
<p style="margin:0 0 14px 0">Hi ${escapeHtml(firstName)},</p>
<p style="margin:0 0 14px 0">Thank you for contacting ${escapeHtml(site.name)}. We have your request for <strong>${names.map(escapeHtml).join(', ')}</strong> and will reply ${escapeHtml(site.replyTime)}.</p>
<p style="margin:0 0 6px 0;color:${COLOR.muted};font-size:13px">Your reference</p>
<p style="margin:0 0 18px 0;font-family:monospace;font-size:20px;font-weight:bold">${escapeHtml(lead.referenceId)}</p>
${
  lead.attachments.length > 0
    ? `<p style="margin:0 0 14px 0">We received ${lead.attachments.length} attached ${lead.attachments.length === 1 ? 'file' : 'files'}.</p>`
    : ''
}
<p style="margin:0 0 8px 0"><strong>What happens next</strong></p>
<ol style="margin:0 0 14px 0;padding-left:20px">${steps.map((s) => `<li style="margin-bottom:6px">${escapeHtml(s)}</li>`).join('')}</ol>
<p style="margin:0 0 14px 0">Need to add something? Just reply to this email and quote your reference.</p>
</td></tr>`;

  const html = shell(
    `We received your request ${lead.referenceId}`,
    'Request received',
    `Reference <strong style="font-family:monospace">${escapeHtml(lead.referenceId)}</strong>`,
    body,
    `${escapeHtml(site.name)} · <a href="mailto:${escapeHtml(replyEmail)}" style="color:${COLOR.brand}">${escapeHtml(replyEmail)}</a><br>You are receiving this because you sent a request through our website. We only use your details to reply to it.`,
  );

  const text = [
    `Hi ${firstName},`,
    '',
    `Thank you for contacting ${site.name}. We have your request for ${names.join(', ')} and will reply ${site.replyTime}.`,
    '',
    `Your reference: ${lead.referenceId}`,
    lead.attachments.length > 0 ? `Attached files received: ${lead.attachments.length}` : '',
    '',
    'What happens next:',
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    'Need to add something? Just reply to this email and quote your reference.',
    '',
    `${site.name} - ${replyEmail}`,
  ]
    .filter((line, index, all) => line !== '' || all[index - 1] !== '')
    .join('\n');

  return { subject, html, text };
}
