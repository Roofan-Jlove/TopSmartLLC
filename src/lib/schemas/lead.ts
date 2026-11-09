import { z } from 'zod';

/** Single source of truth for the order request fields. Used by the form (client) and /api/contact (server). */

export const SERVICE_KEYS = ['web', 'app', 'content', 'ebook'] as const;
export const BUDGET_KEYS = ['under-1k', '1k-5k', '5k-15k', '15k-50k', '50k-plus', 'not-sure'] as const;
export const TIMELINE_KEYS = ['asap', '1-month', '1-3-months', 'flexible'] as const;
export const SOURCE_KEYS = ['contact', 'calculator', 'service-page'] as const;

const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

export const leadMessages = {
  name: 'Please enter your full name.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid phone number.',
  company: 'Company name is too long.',
  services: 'Select at least one service.',
  budget: 'Please choose a budget range.',
  timeline: 'Please choose a timeline.',
  description: 'Tell us a bit more (at least 20 characters).',
  descriptionLong: 'Please keep the description under 5,000 characters.',
  links: 'Links are too long.',
  consent: 'Please accept the privacy terms to continue.',
} as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, leadMessages.name).max(80, leadMessages.name),
  email: z.string().trim().email(leadMessages.email).max(254, leadMessages.email),
  phone: z
    .string()
    .trim()
    .refine((value) => value === '' || PHONE_PATTERN.test(value), leadMessages.phone),
  company: z.string().trim().max(120, leadMessages.company),
  services: z
    .array(z.enum(SERVICE_KEYS))
    .min(1, leadMessages.services)
    .max(4, leadMessages.services)
    .refine((list) => new Set(list).size === list.length, leadMessages.services),
  budget: z.enum(BUDGET_KEYS, { errorMap: () => ({ message: leadMessages.budget }) }),
  timeline: z.enum(TIMELINE_KEYS, { errorMap: () => ({ message: leadMessages.timeline }) }),
  description: z
    .string()
    .trim()
    .min(20, leadMessages.description)
    .max(5000, leadMessages.descriptionLong),
  links: z.string().trim().max(1000, leadMessages.links),
  estimateSummary: z.string().trim().max(2000),
  consent: z.boolean().refine((value) => value === true, leadMessages.consent),
  source: z.enum(SOURCE_KEYS),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Fields validated on each step of the form (used by the multi-step UI). */
export const STEP_FIELDS = {
  1: ['services', 'budget', 'timeline'],
  2: ['description', 'links'],
  3: ['name', 'email', 'phone', 'company', 'consent'],
} as const satisfies Record<number, readonly (keyof LeadInput)[]>;

export type AttachmentMeta = { filename: string; sizeBytes: number; contentType: string };

/** What the host receives. Not persisted anywhere (see docs/API_AND_DATA_FLOW.md section 11). */
export type LeadRecord = Omit<LeadInput, 'consent'> & {
  referenceId: string;
  receivedAt: string;
  consentAt: string;
  attachments: AttachmentMeta[];
  ip?: string;
};
