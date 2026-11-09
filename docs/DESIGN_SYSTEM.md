# TopSmartLLC — UI/UX Design System

Goal: a premium, fast, attractive and efficient experience. Visitors should grasp the offer in 5 seconds and reach the order form in one click. All values are tokens (CSS variables) mapped into Tailwind; contrast ratios must be verified with a checker during M1 and adjusted if below WCAG AA (4.5:1 text, 3:1 large text/UI).

## 1. Principles
1. **Clarity first:** one idea per section, one primary action per view.
2. **Light on JS, rich on feel:** gradients, soft shadows and micro-interactions done with CSS; entrance reveals use a tiny IntersectionObserver + CSS transition (no animation library).
3. **Consistency:** 8px spacing grid, 3 radii, 3 shadows, one accent.
4. **Trust cues near actions:** rating, delivery guarantee and privacy note next to every CTA and the form submit.

## 2. Color Tokens (light / dark)
| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg` | #FFFFFF | #0B1020 | page background |
| `--bg-subtle` | #F5F7FF | #11172B | alternating sections |
| `--surface` | #FFFFFF | #161D36 | cards |
| `--border` | #E3E7F5 | #27304F | hairlines |
| `--text` | #0B1020 | #F2F4FF | body/headings |
| `--text-muted` | #4B5573 | #A9B2D0 | secondary text |
| `--brand` | #4F46E5 | #8B84FF | primary buttons, links |
| `--brand-strong` | #3730A3 | #A5A0FF | hover/active |
| `--accent` | #06B6D4 | #22D3EE | highlights, gradient end |
| `--success` | #15803D | #4ADE80 | success states |
| `--danger` | #B91C1C | #F87171 | errors |
| `--warning` | #B45309 | #FBBF24 | warnings |
Signature gradient: `linear-gradient(135deg, var(--brand), var(--accent))` for hero accents, primary CTA glow and section dividers. White text on `--brand` must pass 4.5:1 (verify; darken if not).

## 3. Typography (next/font, self-hosted)
- Headings: **Sora** (600/700). Body/UI: **Inter** (400/500/600). Code/number accents: system mono.
- Fluid scale (clamp): H1 40->64px, H2 30->44px, H3 22->28px, body 16->18px, small 14px. Line-height 1.15 headings, 1.6 body. Max line length 70ch.

## 4. Spacing, Radius, Shadow, Layout
- Spacing: 4/8/12/16/24/32/48/64/96/128. Section padding: 64px mobile, 96-128px desktop.
- Container: max 1200px, 16px gutter mobile, 24px tablet, 32px desktop.
- Radius: `sm` 8px (inputs), `md` 14px (cards), `lg` 24px (hero panels), pill for tags/buttons.
- Shadows: `sm` subtle card, `md` hover lift, `glow` brand-tinted for primary CTA.
- Breakpoints: 375 base, `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

## 5. Components
- **Button:** primary (gradient/brand), secondary (outline), ghost, link. 48px height, 44px min touch target, loading state with spinner, disabled state. Visible focus ring: 2px `--brand` offset 2px.
- **Card:** surface, 1px border, `md` radius, hover lift 4px + shadow (disabled under reduced motion).
- **Inputs:** floating-free labels above fields, 48px height, helper text, inline error with icon and `aria-describedby`, success tick on valid.
- **Badge/Chip:** pill; used for service tags, budget picks, file types.
- **Tabs/Accordion/Modal/Carousel:** ARIA patterns, keyboard support, focus trap in modal, pause/play on carousel.
- **Header:** sticky, blur background after scroll, shrink on scroll, "Get a Quote" CTA always visible (icon-only on narrow screens).
- **Mobile sticky CTA bar:** bottom bar on mobile with "Get a Free Estimate", hidden on the form page.
- **Toast/Alert:** `role="status"` for success, `role="alert"` for errors.

## 6. Order Form UX (highest priority)
1. **3 steps with a progress bar** and "Step 2 of 3" text: (1) What do you need? service cards (multi-select, icons) + budget + timeline; (2) Project details: description, optional links, **file attachments**; (3) Your details + consent + review summary.
2. **Service cards** are large tap targets; pre-selected when arriving from a service page or calculator.
3. **File upload:** drag-and-drop zone + "Browse" button, paste support, thumbnails for images, icon + size for documents, remove button, per-file and total size meter ("2.1 MB of 4 MB"), allowed-type hint, clear error for rejected files. Keyboard accessible (button opens picker).
4. Errors appear when the visitor presses Continue or Send (never on blur), summarized at the top with focus moved to the first error, and each error clears the moment its field is fixed. Validating on blur is avoided on purpose: an error appearing or the summary disappearing between mouse-down and mouse-up shifts the layout and swallows the click on the button (found in real-browser QA).
5. Draft kept in `sessionStorage` (text fields only; files cannot be persisted) and restored on reload.
6. Submit button shows "Sending your request..." with spinner; success screen shows reference ID, what happens next (reply within 1 business day), and a summary; error state keeps all data and offers retry plus fallback email.
7. Privacy reassurance line under submit: "We only use your details to reply to your request."

## 7. Motion
- Durations 150-300ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Entrance: fade + 12px rise, stagger 60ms, once per element.
- Animate transform/opacity only. Under `prefers-reduced-motion: reduce`, remove all non-essential motion and parallax.
- Counters animate once on view; carousel auto-advance off by default under reduced motion.

## 8. Imagery & Icons
- Hero visual: inline SVG/CSS (gradient mesh + floating UI cards), no heavy raster. Portfolio thumbnails: generated SVG/gradient placeholders until real images exist; use `next/image` with explicit sizes and blur placeholders.
- Icons: inline SVG set (one family, 24px grid, 1.75px stroke), `aria-hidden` when decorative.

## 9. Page Blueprint (Home)
1. Header · 2. Hero (headline, subhead, 2 CTAs, trust badges, visual) · 3. Logo/stat strip · 4. Services (tabs + cards) · 5. How we work (4 steps) · 6. Calculator · 7. Portfolio highlights · 8. Testimonials · 9. FAQ · 10. Final CTA band + order form entry · 11. Footer.

## 10. Accessibility Checklist
Skip link · landmark regions · focus order · focus-visible on all controls · color not sole signal · form labels/errors programmatically linked · live regions for calculator and form status · alt text · reduced motion · zoom to 200% without loss · tested with keyboard and axe.

## 11. Performance Budget
Initial JS < 150 KB gzip on Home; hero image-free; fonts subset with `display: swap` and preload; below-the-fold sections dynamically imported; no layout shift (reserve space for images, fonts via size-adjust).
