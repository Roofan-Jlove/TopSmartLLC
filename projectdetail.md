# TopSmartLLC — Project Detail & Claude CLI Prompt Pack

## 1. Project Overview

**TopSmartLLC** is a digital services agency. We are building a production-ready, fast, fully responsive agency website that sells four core services:

| # | Service Vertical | What it covers |
|---|------------------|----------------|
| 1 | **Web Design & Development** | Custom full-stack sites, web apps, responsive UI/UX, e-commerce |
| 2 | **Mobile App Development** | Native and cross-platform apps for Google Play and Apple App Store: architecture, build, store-submission readiness |
| 3 | **Content Writing & Copywriting** | SEO articles, technical writing, website copy, sales landing pages, marketing content |
| 4 | **E-book Creation & Publishing** | Research, ghostwriting, editing, layout/typesetting, custom cover design, EPUB/PDF export |

**Optional extra services** (add-ons for the calculator): SEO audits, branding/logo design, website maintenance plans, UI/UX audits, social media content packs, hosting and domain setup.

### Business goals
- Turn visitors into qualified leads (quote requests and intake forms).
- Build trust with a portfolio, case studies, testimonials and trust badges.
- Rank well on search engines (technical SEO, fast load times, structured data).
- Look premium on mobile, tablet and desktop.

### Target audience
Startups, small and medium businesses, solo founders, authors and coaches, e-commerce owners, and marketing teams who need a single partner for web, app, content and publishing work.

---

## 2. Execution Rules (Strict)

1. **Phase 1 — Documentation first.** Create every file in `docs/` before writing any implementation code.
2. **Phase 2 — Implementation.** Build strictly according to `docs/ARCHITECTURE.md`.
3. No "Lorem Ipsum". All copy must be realistic and written to convert.
4. Zero build errors, zero broken links, zero console errors, WCAG AA accessibility, good Core Web Vitals.

### Recommended tech stack
- **Next.js 14+ (App Router) + TypeScript**: static/hybrid rendering, good for SEO
- **Tailwind CSS**, with design tokens as CSS variables
- **React Hook Form + Zod** for form validation
- **Framer Motion** for subtle animation (respects `prefers-reduced-motion`)
- **Route Handler API** (`/api/contact`) with Resend/SMTP email or a webhook, plus a mock mode
- **Deployment:** Vercel (primary), with Netlify or Docker as alternatives

---

## 3. How to Use This File with Claude CLI (Claude Code)

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Open a terminal in the project folder: `cd D:\Rojer\TopSmartLLC`
3. Start it: `claude`
4. Paste the prompts below **one at a time, in order**. Wait for each one to finish, review the output, then move on to the next.
5. Tip: run **Prompt 0** first so Claude Code writes a `CLAUDE.md` with the rules. It then remembers them in every session.

---

## 4. Claude CLI Prompts

### Prompt 0 — Project Memory (CLAUDE.md)
```
Create a CLAUDE.md file in the project root for "TopSmartLLC", a digital services agency website
(Web Design & Development, Mobile App Development for Play Store/iOS, Content Writing & Copywriting,
E-book Creation & Publishing).

Include these permanent rules:
- Work in two phases: Phase 1 = documentation in docs/, Phase 2 = implementation. Never write
  implementation code before all Phase 1 docs exist on disk.
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS + React Hook Form + Zod + Framer Motion.
- No Lorem Ipsum; realistic, conversion-focused copy only.
- WCAG AA accessibility, semantic HTML, mobile-first responsive design.
- Before declaring any task done: run lint, type-check and build, and fix all errors.
- Keep content (services, pricing, portfolio, testimonials) in typed data files under src/data/.
Keep CLAUDE.md concise (under 80 lines).
```

---

### PHASE 1 — Documentation

#### Prompt 1 — SRS
```
Phase 1, step 1. Create docs/SRS.md (Software Requirements Specification) for the TopSmartLLC agency website.
Include:
1. Executive summary, target audience personas (startup founder, SMB owner, author/coach,
   e-commerce owner, marketing manager), and measurable business objectives (e.g. lead conversion rate target).
2. Functional requirements with IDs (FR-001...) for: interactive service catalog with tab/modal
   detail views, quote/cost estimate calculator, multi-step client intake form, portfolio/case
   study showcase with category filtering, testimonial carousel, header/nav, footer, legal pages
   (Privacy, Terms, Cookies), 404 page.
3. Non-functional requirements: WCAG 2.1 AA, Core Web Vitals targets (LCP < 2.5s, INP < 200ms,
   CLS < 0.1), Lighthouse 90+ in all categories, cross-browser support (latest 2 versions of
   Chrome, Edge, Firefox, Safari, iOS Safari, Android Chrome), security (input sanitization,
   rate limiting, honeypot spam protection, security headers, no secrets in client code), and SEO
   architecture (metadata, Open Graph, JSON-LD Organization/Service/FAQ schema, sitemap.xml, robots.txt).
4. Acceptance criteria for each module.
Do not write any code.
```

#### Prompt 2 — Architecture
```
Phase 1, step 2. Read docs/SRS.md, then create docs/ARCHITECTURE.md.
Include:
1. Tech stack justification (Next.js App Router + TypeScript + Tailwind CSS), and why it beats
   the alternatives (Vite SPA, plain HTML) for SEO and performance.
2. The full directory and file tree: src/app routes (home, /services, /services/[slug],
   /portfolio, /portfolio/[slug], /pricing, /about, /contact, /privacy, /terms, /cookies,
   api/contact), src/components (layout/, sections/, ui/, forms/), src/data, src/lib,
   src/types, public/ assets.
3. Component hierarchy diagram (text/mermaid).
4. State management (local state + URL search params for filters; calculator state in a
   custom hook; no global store unless justified).
5. Styling architecture: design tokens (colors, type scale, spacing, radius, shadows) as CSS
   variables mapped into the Tailwind config, dark/light handling, typography choice.
6. Asset strategy: next/image, SVG icons, next/font, lazy loading, image sizes.
7. Coding conventions and naming rules.
Do not write any code.
```

#### Prompt 3 — Service Specifications
```
Phase 1, step 3. Create docs/SERVICE_SPECIFICATIONS.md.
For each of the 4 verticals (Web Development; Play Store & iOS App Development; Content Writing
& SEO Copy; E-book Design & Formatting) document:
- Short positioning statement and the client problems it solves
- Offerings / sub-services
- Features and deliverables list
- Process / workflow steps and typical timelines
- 3 pricing tiers (Starter, Growth, Premium) with USD price ranges, what's included and revision counts
- Add-ons with prices (used by the cost calculator)
- FAQs (4-6 per service)
Finish with a machine-readable summary table of calculator inputs: base price per tier,
per-unit pricing (pages, screens, words, e-book pages), add-on prices, and rush-delivery multiplier.
Do not write any code.
```

#### Prompt 4 — API & Data Flow
```
Phase 1, step 4. Create docs/API_AND_DATA_FLOW.md.
Include:
1. Sequence diagram (mermaid) of the contact/intake submission: client validation -> POST
   /api/contact -> server Zod validation -> honeypot + rate limit check -> email dispatch
   (Resend/SMTP) and/or webhook (Slack, Zapier, CRM) -> JSON response -> UI success/error state.
2. Every form field with its type, required flag, validation rules and error messages
   (name, email, phone, company, services[], budget range, timeline, project description,
   estimate summary from the calculator, consent checkbox, honeypot).
3. Lead capture schema as a TypeScript interface and as JSON Schema.
4. API contract: request/response examples, status codes (200, 400, 429, 500), error format.
5. Mock mode (LEAD_DISPATCH_MODE=mock logs to the console) vs live mode.
6. Data privacy notes (no storage of sensitive data; consent required).
Do not write any code.
```

#### Prompt 5 — Deployment Guide
```
Phase 1, step 5. Create docs/DEPLOYMENT_GUIDE.md.
Include: prerequisites (Node 20+), install/dev/build/start/lint/type-check commands,
a .env.example table (NEXT_PUBLIC_SITE_URL, LEAD_DISPATCH_MODE, RESEND_API_KEY, CONTACT_TO_EMAIL,
WEBHOOK_URL, RATE_LIMIT_PER_MINUTE), step-by-step deployment for Vercel (primary), Netlify, and
Docker (with a sample Dockerfile), custom domain + HTTPS setup, and an automated verification
checklist (build passes, Lighthouse scores, link check, axe accessibility check, form test,
console free of errors, sitemap/robots reachable).
Do not write any code.
```

#### Prompt 6 — Phase 1 Verification Gate
```
List every file in docs/ and confirm that SRS.md, ARCHITECTURE.md, SERVICE_SPECIFICATIONS.md,
API_AND_DATA_FLOW.md and DEPLOYMENT_GUIDE.md all exist and are complete. Cross-check them for
contradictions (routes, field names, pricing numbers, env variable names) and fix any you find.
Give me a short summary. Do not start Phase 2 until I confirm.
```

---

### PHASE 2 — Implementation

#### Prompt 7 — Scaffolding & Tooling
```
Phase 2, step 1. Following docs/ARCHITECTURE.md exactly, scaffold the Next.js + TypeScript +
Tailwind project in the current folder (keep docs/ untouched). Set up ESLint, Prettier,
the tsconfig path alias "@/*", design tokens as CSS variables in globals.css mapped in the
Tailwind config, next/font typography, the base layout with metadata, and .env.example.
Create the full folder tree with placeholder route files. Run lint and build and fix all errors.
```

#### Prompt 8 — Data Layer
```
Phase 2, step 2. Create typed data files in src/data/ from docs/SERVICE_SPECIFICATIONS.md:
services.ts (4 services with tiers, features, deliverables, FAQs, add-ons), pricing.ts
(calculator rates), portfolio.ts (at least 8 realistic case studies across all 4 categories with
client, challenge, solution, results/metrics), testimonials.ts (at least 6), site.ts (company info,
nav links, social links, trust badges/stats). Add types in src/types/. Realistic copy only.
```

#### Prompt 9 — Header, Footer & Layout
```
Phase 2, step 3. Build an accessible, sticky Header with a logo, a desktop nav with a Services
dropdown, a mobile hamburger menu (focus trap, Esc to close, aria attributes), and a "Get a Quote"
CTA. Build the Footer with service links, company links, legal pages (Privacy, Terms, Cookies),
social icons, a newsletter mini-form and copyright. Add a skip-to-content link. Test at 375px,
768px and 1440px widths.
```

#### Prompt 10 — Hero Section
```
Phase 2, step 4. Build the homepage Hero: a high-impact headline and subheadline about end-to-end
digital solutions (web, apps, content, e-books), primary CTA "Get a Free Estimate" (scrolls to the
calculator) and secondary CTA "View Our Work", trust badges (e.g. 150+ projects, 4.9/5 rating,
on-time delivery, money-back guarantee), and a lightweight visual (SVG/CSS, no heavy images).
It must be optimized for LCP.
```

#### Prompt 11 — Services Grid & Detail Views
```
Phase 2, step 5. Build the Services Grid (4 cards) with an accessible tabbed view (arrow-key
navigation, ARIA tabs pattern) and a "Learn more" modal or link to /services/[slug]. Build the
dynamic /services/[slug] pages with: overview, features, deliverables, process timeline, 3 pricing
tiers, add-ons, FAQ accordion, CTA, plus generateStaticParams, per-page metadata, and JSON-LD
Service + FAQ schema.
```

#### Prompt 12 — Cost Estimate Calculator
```
Phase 2, step 6. Build the interactive Project Scope / Cost Estimate Calculator using src/data/pricing.ts:
service selection (multi-select), tier choice, quantity inputs (pages, screens, word count, e-book
pages), platform choice for apps (Android, iOS, both), add-on checkboxes, rush delivery toggle,
and a live estimate range with a breakdown. Put the logic in a useEstimate hook with unit tests
(Vitest). Include a "Send this estimate" button that pre-fills the contact form. Fully keyboard
accessible, with results announced through an aria-live region.
```

#### Prompt 13 — Portfolio & Case Studies
```
Phase 2, step 7. Build the Portfolio section and /portfolio page with category filter buttons
(All, Web, Apps, Content, E-books) synced to the URL search params, an animated grid, and case study
cards. Build /portfolio/[slug] detail pages (challenge, solution, tech used, results with metrics,
testimonial, next-project link). Use optimized placeholder images (SVG/gradient) in public/.
```

#### Prompt 14 — Testimonials & Social Proof
```
Phase 2, step 8. Build the Testimonials carousel (accessible: pause/play control, prev/next
buttons, swipe on mobile, respects prefers-reduced-motion), a client logos strip, a stats counter
section, and a "How We Work" process section. Also add the About and Pricing pages using the
existing data.
```

#### Prompt 15 — Contact & Intake Form + API
```
Phase 2, step 9. Following docs/API_AND_DATA_FLOW.md exactly, build the multi-step Contact &
Project Intake Form with React Hook Form + Zod (inline errors, progress indicator, honeypot,
consent checkbox, success/error states, pre-fill from the calculator). Build POST /api/contact
with server-side Zod validation, rate limiting, honeypot check, and mock/live dispatch
(Resend email + optional webhook) controlled by env variables. Never expose secrets to the client.
```

#### Prompt 16 — SEO, Legal & Polish
```
Phase 2, step 10. Add sitemap.ts, robots.ts, Open Graph/Twitter metadata for every page,
JSON-LD Organization schema, a custom 404 page, and the Privacy, Terms and Cookies pages with
realistic content. Add security headers in next.config. Check every page for a single H1, a
correct heading order, alt text and color contrast.
```

#### Prompt 17 — Final QA & Verification
```
Phase 2, final step. Run a full QA pass:
1. npm run lint, type-check, test and build: fix everything until there are zero errors and warnings.
2. Scan all internal links and confirm there are no broken links or missing routes.
3. Review responsive layouts at 375px, 768px, 1024px and 1440px.
4. Run an accessibility check (axe or a manual WCAG AA review) and fix issues.
5. Start the production build and confirm the browser console has no errors.
6. Test the form in mock mode end to end.
7. Cross-check the implementation against docs/SRS.md acceptance criteria and list any gaps.
Then give me a final report and update docs/DEPLOYMENT_GUIDE.md if anything changed.
```

#### Prompt 18 — Deploy (optional)
```
Help me deploy this site to Vercel following docs/DEPLOYMENT_GUIDE.md: initialize git, create
a sensible first commit, list the environment variables I need to set in Vercel, and give me the
exact commands (vercel CLI) to deploy a preview and then production.
```

---

## 5. Useful Follow-up Prompts
- `Review the homepage copy and make it more persuasive and benefit-focused, without changing the layout.`
- `Run a Lighthouse-style performance review and reduce JS bundle size.`
- `Add a blog section with MDX for SEO articles, following the existing architecture.`
- `Add a WhatsApp click-to-chat button and Google Analytics 4 with cookie consent.`
- `Translate site content into Urdu as an optional locale using next-intl.`

## 6. Definition of Done
- [ ] All 5 docs exist in `docs/` and are consistent
- [ ] All pages and sections built with real copy
- [ ] Calculator works and is tested
- [ ] Form validates on client and server and dispatches (mock and live)
- [ ] Lighthouse 90+, WCAG AA, no console errors, no broken links
- [ ] Deployed to Vercel with a custom domain
