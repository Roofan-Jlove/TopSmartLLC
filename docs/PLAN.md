# TopSmartLLC — Execution Plan

Source of truth for scope: `projectdetail.md`. Rules: `docs/CONSTITUTION.md`. Status legend: [ ] todo · [x] done.

## 1. Key Requirement Added by Owner
**Clients submit order requests on the website; the host receives all client details by email, including any attached files/images.**
Design consequences (reflected in every doc):
- Intake form gains a file-upload step (drag & drop, previews, remove, progress, limits).
- `POST /api/contact` accepts `multipart/form-data`, validates files, and sends one email to the host with attachments (Resend or SMTP).
- Host email is a clean, scannable summary (HTML + plain text) with Reply-To = client.
- Optional confirmation email to the client. Mock mode for local development.
- Vercel request-body limit (~4.5 MB) caps attachments at **4 MB total, max 5 files** in v1. Larger files: client pastes a share link (Drive/Dropbox/WeTransfer). Upgrade path: direct-to-storage uploads (e.g. Vercel Blob) with links in the email.

## 2. Phases & Milestones

### Phase 1 — Documentation (gate: owner confirms)
- [x] `CLAUDE.md` project memory
- [x] `docs/CONSTITUTION.md`
- [x] `docs/PLAN.md` (this file)
- [x] `docs/DESIGN_SYSTEM.md` (UI/UX)
- [x] `docs/SRS.md`
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/SERVICE_SPECIFICATIONS.md`
- [x] `docs/API_AND_DATA_FLOW.md`
- [x] `docs/DEPLOYMENT_GUIDE.md`
- [ ] Verification gate: cross-check routes, field names, prices, env names -> owner confirms Phase 2

### Phase 2 — Implementation
| # | Milestone | Output | Exit criteria |
|---|-----------|--------|---------------|
| M1 | Scaffold & tooling | Next.js/TS/Tailwind, ESLint, Prettier, Vitest, tokens, fonts, `.env.example` | lint/type-check/build clean |
| M2 | Data layer | `src/data/*`, `src/types/*` | typed, realistic copy, prices match specs |
| M3 | Layout | Header, Footer, skip link, mobile nav, sticky CTA | works 375/768/1440, keyboard OK |
| M4 | Home sections | Hero, services grid/tabs, process, stats | LCP target met |
| M5 | Service pages | `/services`, `/services/[slug]`, JSON-LD | static params, metadata |
| M6 | Calculator | `useEstimate` + UI + Vitest | tests pass, aria-live results |
| M7 | Order form + API (mock mode) | Multi-step form, uploads UI, `/api/contact` with validation, file checks, rate limit, honeypot, dispatch interface + mock dispatcher | form works end to end in mock mode; 400/413/415/429 paths tested |
| M8 | Portfolio & social proof | `/portfolio`, `[slug]`, testimonials, logos | filter synced to URL |
| M9 | About, Pricing | pages | consistent with data |
| M10 | SEO, legal, 404, security headers | sitemap, robots, OG, JSON-LD, policies | headers verified |
| M11 | **Email integration (LAST feature)** | Resend/SMTP transport, host + client email templates with attachments, optional webhook, env validation | live E2E: host inbox receives all details + intact attachments, Reply-To = client |
| M12 | QA | lint/test/build, links, axe, Lighthouse, responsive, SRS gap check | zero errors, 90+ scores |
| M13 | Deploy | Vercel, domain, env vars, live email test | production order email arrives |

Recommended build order: M1 -> M2 -> M3 -> M4 -> M5 -> M6 -> M7 -> M8 -> M9 -> M10 -> **M11 (email integration last)** -> M12 -> M13.
Email is deferred by owner request. Until M11 the form runs in `LEAD_DISPATCH_MODE=mock`; M7 defines a `dispatch(lead, files)` interface so M11 only adds the real transport and templates, with no form or API changes.

**M11 status: built and verified against stand-in servers (no real credentials yet).** Remaining for the live step: the owner's receiving address, a verified sending domain with a Resend key (or SMTP details), then one real test order. At that test, confirm: the email arrives (not in spam), both attachments open, and **Reply-To is the client's address** (Resend's `reply_to` field name was not confirmed in the docs consulted).

## 3. Prompt Mapping (projectdetail.md -> milestones)
Prompt 0 -> CLAUDE.md · 1-5 -> Phase 1 docs · 6 -> gate · 7 -> M1 · 8 -> M2 · 9 -> M3 · 10-11 -> M4/M5 · 12 -> M6 · 13-14 -> M8/M9 · 15 -> M7 (form + API, mock) then M11 (email integration, done last) · 16 -> M10 · 17 -> M12 · 18 -> M13.

## 4. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Lead email fails silently | Lost sales | Error surfaced to client; provider response checked; fallback mailto/phone shown; optional webhook as second channel |
| Attachment too large for serverless | Failed submit | Client-side limits (5 files / 4 MB total) with clear message; share-link field; Blob upgrade path |
| Email lands in spam | Missed leads | Verified sending domain (SPF/DKIM/DMARC) in Resend; send from `CONTACT_FROM_EMAIL` on own domain; Reply-To client |
| Spam submissions | Noise | Honeypot, rate limit, size caps, CAPTCHA hook |
| Malicious uploads | Security | Allow-list + magic bytes, no executables, never stored/opened server-side |
| In-memory rate limit resets on serverless | Weak limiting | Acceptable v1; upgrade to Upstash/Vercel KV when traffic grows |
| Placeholder stats/testimonials shipped | Trust/legal | Launch checklist item: replace with real data |
| Scope creep | Delay | Follow-ups (blog, GA4, i18n) only after M12 |

## 5. Launch Checklist (owner inputs needed)
- [ ] Host email address for `CONTACT_TO_EMAIL`
- [ ] Domain + verified sender (`CONTACT_FROM_EMAIL`) in Resend
- [ ] Resend API key (or SMTP credentials)
- [ ] Real company details: legal name, address, phone, social links
- [ ] Logo/brand colors (else DESIGN_SYSTEM defaults are used)
- [ ] Real testimonials, portfolio items and stats (or approval to ship clearly illustrative samples)
- [ ] Final price approval for `docs/SERVICE_SPECIFICATIONS.md`

## 6. Decisions Taken (change on request)
1. Email via Resend by default, SMTP supported. 2. No database in v1. 3. Attachments up to 5 files / 4 MB total. 4. Currency USD. 5. English only (Urdu via next-intl is a follow-up). 6. Light theme default with dark mode support.
