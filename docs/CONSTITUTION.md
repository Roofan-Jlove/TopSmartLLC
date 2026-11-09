# TopSmartLLC — Project Constitution

The non-negotiable principles for building and maintaining the TopSmartLLC website. Every doc, design and line of code must comply. If a rule must change, amend this file first and record it in the Amendment Log.

## Article I — Purpose
The site exists to convert visitors into qualified leads. A visitor must be able to understand what we sell, trust us, estimate cost, and **submit an order request in under 3 minutes**. The owner (host) receives every detail by email, with any attached files, and can act on it without opening an admin panel.

## Article II — The Order Request Promise
1. Every submitted request is delivered to the host's inbox (`CONTACT_TO_EMAIL`) containing: name, email, phone, company, selected services, budget, timeline, project description, calculator estimate summary, links, consent record, timestamp, a reference ID, and **all attached files and images as real email attachments**.
2. The email's Reply-To is the client's email, so the host replies directly.
3. The client sees success only after the email provider confirms acceptance. On failure the client sees a clear error with a retry and a fallback contact email; the entered data and files stay in the form.
4. The client receives an optional confirmation email with the reference ID (`SEND_CLIENT_CONFIRMATION`).
5. No database in v1. Leads are not stored on our servers beyond the request lifetime (privacy by design). The host's inbox is the system of record.

## Article III — Experience (UI/UX)
1. **Fast:** LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse 90+ in all categories. Ship little JavaScript; server components by default.
2. **Attractive:** a premium, modern look defined by `docs/DESIGN_SYSTEM.md` (tokens, type, spacing, motion). Visual consistency beats novelty.
3. **Efficient:** the primary action ("Get a Free Estimate" / "Start your order") is reachable from every screen in one tap. Forms are short, stepwise, autosaved in-session and forgiving.
4. **Accessible:** WCAG 2.1 AA, keyboard operable, visible focus, proper ARIA only where native HTML is insufficient, `prefers-reduced-motion` respected.
5. **Mobile-first:** designed at 375px first, then 768, 1024, 1440. Touch targets >= 44px.
6. **Honest:** no dark patterns, no fake urgency, no fabricated claims presented as real client data. Placeholder stats and testimonials must be replaced with real ones before launch (tracked in PLAN.md launch checklist).

## Article IV — Engineering
1. Two phases: documentation first, implementation second. No code before all Phase 1 docs exist and are consistent (verification gate).
2. TypeScript strict. No `any` without a justifying comment. Zod schemas are the single source of truth for form and API shapes.
3. Content in typed data files (`src/data/`); logic in hooks/lib; components are presentational where possible.
4. Quality gate before "done": lint, type-check, unit tests, production build all clean. Zero warnings.
5. Small, reviewable changes. Prefer extending existing code to adding new abstractions.
6. Docs are living: any change to routes, fields, prices or env variables updates the docs in the same change.

## Article V — Security & Privacy
1. Secrets never reach the client bundle. Only `NEXT_PUBLIC_SITE_URL` is public.
2. Validate on client and server. Sanitize before embedding user input in email HTML (escape everything; plain-text part always included).
3. Spam defence: honeypot, rate limit per IP, payload size cap, optional CAPTCHA hook later.
4. Attachment safety: allow-list of types, magic-byte check, max files and total size, filename sanitization, no executable or script types, files are streamed to the email provider and never written to disk or logged.
5. Security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame protection) set in `next.config`.
6. Consent is required to submit. Privacy, Terms and Cookie pages describe exactly what is collected and why. Analytics only after consent.
7. In live mode never log PII or file contents; log only reference ID, status and timing.

## Article VI — Content
1. No Lorem Ipsum. Benefit-led, specific, plain-English copy written to convert.
2. Prices shown anywhere must come from `src/data/pricing.ts`, which mirrors `docs/SERVICE_SPECIFICATIONS.md`.
3. All images have meaningful alt text (or empty alt if decorative). One H1 per page, ordered headings.

## Article VII — Decision Rules
When requirements conflict, priority is: (1) lead delivery reliability, (2) security/privacy, (3) accessibility, (4) performance, (5) visual polish, (6) feature breadth.

## Amendment Log
| Date | Change | Reason |
|------|--------|--------|
| 2026-11-09 | Initial constitution | Phase 1 kickoff; added email-with-attachments order promise |
