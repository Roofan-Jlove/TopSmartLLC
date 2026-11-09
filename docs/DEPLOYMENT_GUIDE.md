# TopSmartLLC — Deployment Guide

Version 1.0 · Pairs with `ARCHITECTURE.md` and `API_AND_DATA_FLOW.md`.

## 1. Prerequisites
- Node.js 20+ and npm 10+ (`node -v`)
- Git
- A Resend account with a verified sending domain (or SMTP credentials)
- Vercel account (primary), optional Netlify account or Docker
- The host's receiving email address (`CONTACT_TO_EMAIL`)

## 2. Commands
| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` |
| Start production | `npm run start` |
| Lint | `npm run lint` |
| Type-check | `npm run type-check` (`tsc --noEmit`) |
| Unit tests | `npm test` |
| Format | `npm run format` |

## 3. Environment Variables (`.env.example`)
| Variable | Public? | Required | Example / default | Purpose |
|----------|---------|----------|-------------------|---------|
| `NEXT_PUBLIC_SITE_URL` | yes | yes | `https://www.topsmartllc.com` | Canonical URLs, sitemap, OG |
| `LEAD_DISPATCH_MODE` | no | yes | `mock` (dev) / `live` (prod) | Mock logs only; live sends email |
| `EMAIL_PROVIDER` | no | live | `resend` | `resend` or `smtp` |
| `RESEND_API_KEY` | no | live+resend | `re_xxx` | Resend API key |
| `CONTACT_TO_EMAIL` | no | live | `owner@topsmartllc.com` | **Host inbox that receives every order + attachments** |
| `CONTACT_FROM_EMAIL` | no | live | `orders@topsmartllc.com` | Verified sender address |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` `SMTP_SECURE` | no | live+smtp | `smtp.gmail.com` `465` … `true` | SMTP alternative |
| `SEND_CLIENT_CONFIRMATION` | no | no | `true` | Send client a confirmation |
| `WEBHOOK_URL` | no | no | `https://hooks.slack.com/...` | Optional Slack/Zapier/CRM |
| `RATE_LIMIT_PER_MINUTE` | no | no | `5` | Requests per IP per minute |
| `MAX_UPLOAD_MB` | no | no | `4` (ceiling 4.5 on Vercel) | Total attachment size limit |
| `SHOW_IP_IN_EMAIL` | no | no | `false` | Include sender IP in host email |
| `RESEND_API_URL` | no | no | *(leave unset)* | Test-only: points the Resend transport at a local stand-in server. Production uses `https://api.resend.com` |

Live mode checks its settings on every request and reports all problems at once by variable name (never by value) in the server log. If anything is missing the visitor sees the normal "We couldn't send your request" message and no email is attempted.

Never commit `.env.local`. Only `NEXT_PUBLIC_*` values are exposed to the browser.

## 4. Local Setup
1. `npm install`
2. `copy .env.example .env.local` (Windows) and keep `LEAD_DISPATCH_MODE=mock`.
3. `npm run dev`; submit the form; confirm the redacted mock log in the terminal.
4. To test real email locally: set `LEAD_DISPATCH_MODE=live`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (use `onboarding@resend.dev` for first tests; Resend then only delivers to your own account email), `CONTACT_TO_EMAIL`.

## 5. Email Setup (Resend)
1. Create account -> Domains -> Add `topsmartllc.com` -> add the SPF, DKIM (and DMARC) DNS records -> wait for "Verified".
2. Create an API key (sending access) -> store as `RESEND_API_KEY`.
3. Set `CONTACT_FROM_EMAIL` to an address on the verified domain.
4. Send a live test order with two attachments (one image, one PDF) and confirm both arrive intact and Reply-To is the client address. Check spam folder once; mark "not spam" if needed.
SMTP alternative (e.g. Gmail with an app password, or your host's SMTP): set `EMAIL_PROVIDER=smtp` and `SMTP_*`.

## 6. Deploy to Vercel (primary)
1. `git init`, commit, push to GitHub/GitLab.
2. Vercel -> Add New Project -> import the repo (framework auto-detected: Next.js).
3. Settings -> Environment Variables: add every variable from section 3 for Production (and Preview with `LEAD_DISPATCH_MODE=mock`).
4. Deploy. Note the function limits: request body ~4.5 MB (hence `MAX_UPLOAD_MB=4`), `maxDuration` 30s.
5. CLI alternative: `npm i -g vercel` -> `vercel login` -> `vercel` (preview) -> `vercel --prod`.
6. Custom domain: Project -> Settings -> Domains -> add `topsmartllc.com` and `www`; set DNS (A `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for `www`, or use Vercel nameservers); HTTPS certificate is issued automatically; set redirect apex -> www (or reverse) and update `NEXT_PUBLIC_SITE_URL`.
7. Redeploy after changing env vars.

## 7. Deploy to Netlify (alternative)
1. New site from Git; build command `npm run build`; Netlify's Next.js runtime is applied automatically.
2. Add the same environment variables.
3. Netlify function body limit is lower (~6 MB request, 10s default timeout): keep `MAX_UPLOAD_MB<=4` and confirm timeout settings.
4. Add domain and enable HTTPS (Let's Encrypt).

## 8. Deploy with Docker (alternative; allows larger uploads)
Set `output: 'standalone'` in `next.config.mjs`. Sample `Dockerfile`:
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```
Run: `docker build -t topsmartllc --build-arg NEXT_PUBLIC_SITE_URL=https://www.topsmartllc.com .` then `docker run -p 3000:3000 --env-file .env.production topsmartllc`. Put it behind a reverse proxy (Caddy/Nginx) with HTTPS, and raise `MAX_UPLOAD_MB` there only if the proxy `client_max_body_size` allows it.

## 9. Post-Deploy Verification Checklist
- [ ] `npm run lint`, `npm run type-check`, `npm test`, `npm run build` pass with zero errors/warnings
- [ ] Lighthouse mobile >= 90 (Performance, Accessibility, Best Practices, SEO) on Home, a service page, Contact
- [ ] Link check: no broken internal links; all footer/nav routes resolve; 404 returns HTTP 404
- [ ] axe accessibility scan: zero serious/critical; keyboard-only run through the order form
- [ ] **Order form E2E (live):** submit with 2 attachments -> host receives email with all fields and intact attachments; Reply-To correct; client confirmation received (if enabled); reference ID matches
- [ ] Negative tests: invalid email -> 400 inline error; `.exe` -> rejected; >4 MB -> rejected with message; 6th request in a minute -> 429; honeypot filled -> no email
- [ ] Browser console free of errors/warnings on all pages
- [ ] `/sitemap.xml` and `/robots.txt` reachable and correct; canonical + OG tags present
- [ ] Security headers present (check securityheaders.com): CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] HTTPS valid, www/apex redirect works
- [ ] Placeholder stats/testimonials replaced with real data (or clearly illustrative)
- [ ] Email deliverability: SPF/DKIM/DMARC pass (mail-tester.com >= 9/10)

## 10. Rollback & Maintenance
- Vercel: Deployments -> select previous -> Promote to Production (or `vercel rollback`).
- Rotate `RESEND_API_KEY` if exposed; redeploy.
- Monitor Resend dashboard for bounces/complaints; set a calendar reminder to send a monthly live test order.
- Upgrade path for larger files: direct-to-storage uploads (e.g. Vercel Blob) with links in the email.
