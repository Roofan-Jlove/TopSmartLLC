# TopSmartLLC — Software Requirements Specification (SRS)

Version 1.0 · 2026-11-09 · Related: `CONSTITUTION.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `API_AND_DATA_FLOW.md`

## 1. Executive Summary
TopSmartLLC is a digital services agency offering (1) Web Design & Development, (2) Mobile App Development for Google Play and Apple App Store, (3) Content Writing & Copywriting, (4) E-book Creation & Publishing. The website must present these services attractively, build trust, let visitors estimate cost, and let them **submit an order request that is delivered by email, with attachments, to the host**.

### 1.1 Business Objectives (measurable)
| ID | Objective | Target (first 90 days) |
|----|-----------|------------------------|
| BO-1 | Visitor -> submitted order request conversion | >= 3% of sessions |
| BO-2 | Order form completion rate (started -> submitted) | >= 55% |
| BO-3 | Calculator usage leading to form | >= 20% of calculator users click "Send this estimate" |
| BO-4 | Lead email delivery success | >= 99.5% of valid submissions delivered |
| BO-5 | Median time to submit the form | <= 3 minutes |
| BO-6 | Lighthouse (mobile) all categories | >= 90 |

### 1.2 Personas
| Persona | Needs | Typical service |
|---------|-------|-----------------|
| Startup Founder (Sara) | MVP fast, clear price, trust | App, Web |
| SMB Owner (Imran) | Professional site, leads, maintenance | Web, Content |
| Author/Coach (Maya) | Turn manuscript into polished e-book, cover | E-book, Content |
| E-commerce Owner (Daniel) | Store, product copy, SEO | Web, Content |
| Marketing Manager (Priya) | Landing pages, articles, reliable vendor | Content, Web |

### 1.3 Scope
In scope: public marketing site, calculator, order/intake form with file upload, email delivery to host, SEO, legal pages. Out of scope for v1: user accounts, payments, database/admin panel, blog (follow-up), multi-language (follow-up).

## 2. Functional Requirements

### 2.1 Navigation & Layout
- **FR-001** Sticky header with logo, nav (Home, Services dropdown, Portfolio, Pricing, About, Contact) and a "Get a Quote" CTA.
- **FR-002** Mobile hamburger menu: focus trap, Esc closes, `aria-expanded`, body scroll lock.
- **FR-003** Skip-to-content link as first focusable element.
- **FR-004** Footer: service links, company links, legal links, social icons, newsletter mini-form, copyright. The newsletter mini-form is hidden in v1 until an email-list provider is chosen (see `API_AND_DATA_FLOW.md` section 10).
- **FR-005** Mobile sticky bottom CTA bar (hidden on `/contact`).

### 2.2 Home & Services
- **FR-010** Hero: headline, subheadline, CTAs "Get a Free Estimate" (scrolls to calculator) and "View Our Work", trust badges, lightweight SVG visual.
- **FR-011** Interactive service catalog: 4 service cards plus ARIA tabs (arrow-key navigation) showing summary, key features and starting price; "Learn more" opens `/services/[slug]`.
- **FR-012** `/services` index and `/services/[slug]` detail pages: overview, features, deliverables, process timeline, 3 pricing tiers, add-ons, FAQ accordion, CTA that pre-selects the service in the order form.
- **FR-013** "How We Work" process section (4 steps).

### 2.3 Cost Estimate Calculator
- **FR-020** Multi-select services; per selected service: tier, quantity (pages / screens / words / e-book pages), platform (apps: Android, iOS, Both).
- **FR-021** Add-on checkboxes filtered by selected services; rush delivery toggle.
- **FR-022** Live estimate: low–high range, itemized breakdown, monthly recurring items shown separately.
- **FR-023** Results announced via `aria-live="polite"`; keyboard operable.
- **FR-024** "Send this estimate" navigates to `/contact` with services and a text summary pre-filled (via URL params / sessionStorage).
- **FR-025** Logic in `useEstimate` hook backed by `src/data/pricing.ts`; unit tested.

### 2.4 Order Request / Intake Form (core)
- **FR-030** Multi-step form (3 steps) with progress indicator, back/next, inline validation, error summary.
- **FR-031** Fields: name, email, phone (optional), company (optional), services[], budget, timeline, project description, reference links (optional), estimate summary (hidden/prefilled), consent, honeypot. Exact rules in `API_AND_DATA_FLOW.md`.
- **FR-032** **File attachments:** drag-and-drop and browse; limits per FR-033; previews for images; remove before sending; size meter.
- **FR-033** Allowed types: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, rtf, png, jpg, jpeg, webp, gif, zip. Max 5 files, max 4 MB total (`MAX_UPLOAD_MB`, default 4). Rejected files show a specific reason (type, count or size).
- **FR-034** Submit sends `multipart/form-data` to `POST /api/contact`.
- **FR-035** **Host email:** on success, one email to `CONTACT_TO_EMAIL` containing all details (HTML + plain text), reference ID, and every attachment; Reply-To = client email.
- **FR-036** Optional confirmation email to the client with reference ID and next steps.
- **FR-037** Optional webhook dispatch (Slack/Zapier/CRM) with JSON (no file contents; file names and sizes only).
- **FR-038** Success screen with reference ID and summary; error screen keeps data and offers retry plus fallback contact email.
- **FR-039** Honeypot, rate limit (429), server-side validation (400), duplicate-submit guard (button disabled while sending).
- **FR-040** Pre-fill from service page / calculator; draft text fields restored from `sessionStorage`.
- **FR-041** Mock mode (`LEAD_DISPATCH_MODE=mock`): no email sent; payload (without PII values in live logs) is logged to console and the UI behaves as success.
- **FR-042** `/contact` page: form plus direct contact details (email, phone, hours) and FAQ.

### 2.5 Portfolio & Social Proof
- **FR-050** `/portfolio` grid with category filter (All, Web, Apps, Content, E-books) synced to URL `?category=`.
- **FR-051** `/portfolio/[slug]`: client, challenge, solution, tech/tools, results with metrics, testimonial, next-project link.
- **FR-052** Testimonial carousel: pause/play, prev/next, swipe, reduced-motion safe.
- **FR-053** Client logo strip and animated stats counters.

### 2.6 Other Pages
- **FR-060** `/pricing` summarizing tiers for all services with link to calculator.
- **FR-061** `/about` story, values, team, process, CTA.
- **FR-062** `/privacy`, `/terms`, `/cookies` with realistic content (including file upload and email handling disclosure).
- **FR-063** Custom 404 with helpful links.
- **FR-064** Cookie notice shown only if non-essential cookies/analytics are enabled.

## 3. Non-Functional Requirements
| ID | Requirement |
|----|-------------|
| NFR-01 | WCAG 2.1 AA conformance; axe: zero serious/critical issues |
| NFR-02 | Core Web Vitals (75th percentile): LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| NFR-03 | Lighthouse >= 90 for Performance, Accessibility, Best Practices, SEO (mobile) |
| NFR-04 | Browsers: latest 2 versions of Chrome, Edge, Firefox, Safari, iOS Safari, Android Chrome |
| NFR-05 | Responsive 375 -> 1440+; no horizontal scroll |
| NFR-06 | Security: server validation, HTML escaping in emails, honeypot, rate limiting, security headers, no secrets in client code, upload allow-list and magic-byte checks |
| NFR-07 | Privacy: no lead storage on server, consent required, no PII in live logs |
| NFR-08 | SEO: per-page metadata, Open Graph/Twitter, JSON-LD (Organization, Service, FAQPage), sitemap.xml, robots.txt, canonical URLs |
| NFR-09 | Reliability: form submission p95 < 5s including attachments up to 4 MB; email provider errors surfaced, never swallowed |
| NFR-10 | Maintainability: strict TypeScript, content in `src/data`, tests for calculator and API validation |
| NFR-11 | Zero build errors/warnings, zero broken internal links, zero console errors |
| NFR-12 | Initial JS on Home < 150 KB gzip |

## 4. Acceptance Criteria by Module
| Module | Acceptance criteria |
|--------|--------------------|
| Header/Footer | Works 375/768/1440; keyboard-only navigation of dropdown and mobile menu; Esc closes; skip link visible on focus |
| Hero | Renders without raster images; LCP < 2.5s on mobile throttled; both CTAs work |
| Services catalog | Arrow keys switch tabs; each service page has all sections; JSON-LD validates |
| Calculator | Given inputs in `SERVICE_SPECIFICATIONS.md` section 7, outputs match worked examples exactly; aria-live announces total; "Send this estimate" pre-fills the form |
| Order form | Cannot advance with invalid step; files over limits rejected with message; successful submit shows reference ID; host mailbox receives email containing all fields and every attached file intact (checksum matches); Reply-To = client |
| API | 200 valid, 400 invalid (field errors), 413 payload/file too large, 415 disallowed type, 429 rate limited, 502/500 email failure; honeypot returns 200 but sends nothing |
| Mock mode | Same UI flow; nothing leaves the server |
| Portfolio | Filter updates URL and survives refresh; detail pages statically generated |
| Testimonials | Pause stops rotation; reduced motion disables auto-advance |
| SEO/Legal | sitemap lists all routes; robots reachable; single H1 per page; 404 returns HTTP 404 |
| Accessibility | axe clean; manual keyboard and screen-reader smoke test of the form |
| Performance | Lighthouse mobile >= 90 on Home, Services, Contact |
