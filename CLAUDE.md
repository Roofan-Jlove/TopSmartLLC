# TopSmartLLC — Project Memory

Digital services agency website: Web Design & Development, Mobile App Development (Play Store / App Store),
Content Writing & Copywriting, E-book Creation & Publishing. Full rules: `docs/CONSTITUTION.md`. Roadmap: `docs/PLAN.md`.

## Core flow (the reason the site exists)
Client fills the order/intake form (optionally attaching files/images) -> `POST /api/contact` ->
the host (site owner) receives ALL client details + attachments by EMAIL at `CONTACT_TO_EMAIL`.
Never lose a lead: if email dispatch fails, return an error to the client; do not show false success.

## Phases (strict)
- Phase 1 = docs in `docs/`. Phase 2 = implementation. No implementation code until all Phase 1 docs exist on disk.
- Build strictly per `docs/ARCHITECTURE.md`. If reality differs, update the doc first, then the code.

## Stack
Next.js 14+ (App Router) + TypeScript (strict) + Tailwind CSS (tokens as CSS variables) + React Hook Form + Zod +
CSS-based motion (honor `prefers-reduced-motion`). Email: Resend (default) or SMTP (nodemailer). Deploy: Vercel.

## Rules
- No Lorem Ipsum. Realistic, conversion-focused copy only.
- UI/UX must be fast, clean and attractive: follow `docs/DESIGN_SYSTEM.md`. Mobile-first. WCAG 2.1 AA. Semantic HTML.
- Content (services, pricing, portfolio, testimonials, site info) lives in typed files under `src/data/`. No hard-coded copy in components.
- Secrets only in server env vars. Only `NEXT_PUBLIC_SITE_URL` may be public. Never log client PII in live mode.
- Server re-validates everything the client validates (Zod schema shared from `src/lib/schemas`).
- Uploads: validate type by extension AND magic bytes, enforce count/size limits, never execute or store files on disk.
- Pricing numbers must match `docs/SERVICE_SPECIFICATIONS.md` exactly (single source of truth -> `src/data/pricing.ts`).
- Prefer editing existing files; keep components small; named exports; path alias `@/*`.

## Definition of done for any task
Run `npm run lint`, `npm run type-check`, `npm test`, `npm run build`; fix all errors and warnings.
No console errors, no broken links, single H1 per page, alt text on images, keyboard operable.

## Commands
`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run type-check` · `npm test`

## Env (see `docs/DEPLOYMENT_GUIDE.md`)
`NEXT_PUBLIC_SITE_URL`, `LEAD_DISPATCH_MODE` (mock|live), `EMAIL_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`, `WEBHOOK_URL`, `RATE_LIMIT_PER_MINUTE`, `MAX_UPLOAD_MB`, `SEND_CLIENT_CONFIRMATION`.
