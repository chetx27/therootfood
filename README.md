# TheRootFood

> Farm-direct produce catalog and ordering platform — therootfood.com

[

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)

](https://nextjs.org)
[

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

](https://typescriptlang.org)
[

![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)

](https://tailwindcss.com)
[

![Live](https://img.shields.io/badge/Live-therootfood.com-22c55e)

](https://therootfood.com)

---

## What it is

TheRootFood connects consumers directly with farm-sourced products — no middlemen, no marketplace fees. Buyers browse a curated catalog and place orders over WhatsApp. The platform supports B2B bulk enquiries, custom cake orders, and a built-in chatbot with WhatsApp handoff.

---

## Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Framework  | Next.js 16 (App Router)            |
| Language   | TypeScript                         |
| Styling    | Tailwind CSS v4                    |
| Forms      | React Hook Form + Zod              |
| Email      | Resend                             |
| Rate limit | Upstash Redis + @upstash/ratelimit |
| Animations | Framer Motion                      |
| Components | shadcn/ui                          |
| Monitoring | Sentry (client + server + edge)    |
| Mobile     | Capacitor (iOS + Android shells)   |

---

## Local Setup

### 1. Clone and install

    git clone https://github.com/chetx27/therootfood.git
    cd therootfood
    npm install

### 2. Environment variables

    cp .env.example .env.local

| Variable                       | Description                                   |
|--------------------------------|-----------------------------------------------|
| `RESEND_API_KEY`               | Resend API key for transactional email        |
| `CONTACT_NOTIFICATION_EMAIL`   | Destination for enquiry notifications         |
| `UPSTASH_REDIS_REST_URL`       | Upstash Redis URL (rate limiting)             |
| `UPSTASH_REDIS_REST_TOKEN`     | Upstash Redis token                           |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | Business WhatsApp — digits only, no +         |
| `NEXT_PUBLIC_SITE_URL`         | Production URL e.g. https://therootfood.com   |

### 3. Dev server

    npm run dev
    # http://localhost:3000

### 4. Production build

    npm run build
    npm run start

---

## Project Structure

    therootfood/
    ├── app/
    │   ├── api/
    │   │   ├── contact/route.ts      # Rate-limited, Zod-validated enquiry endpoint
    │   │   └── health/route.ts       # Health check
    │   ├── about/
    │   ├── faq/
    │   ├── privacy/
    │   ├── terms/
    │   ├── layout.tsx                # Root layout + JSON-LD structured data
    │   ├── page.tsx                  # Home page
    │   ├── sitemap.ts                # Auto-generated XML sitemap
    │   └── robots.ts
    ├── components/
    │   ├── layout/                   # Navbar, footer, mobile nav, WhatsApp FAB
    │   ├── sections/                 # Hero, product grid, cake/bulk enquiry, contact
    │   └── shared/                   # FadeIn, SectionHeading
    ├── data/
    │   └── products.ts               # Product catalog (source of truth)
    ├── lib/
    │   ├── business-info.ts          # JSON-LD metadata
    │   ├── email.ts                  # Resend helper
    │   ├── env.ts                    # Zod env validation
    │   ├── rate-limit.ts             # Upstash rate limiter
    │   ├── validations.ts            # Shared Zod schemas
    │   └── whatsapp.ts               # WhatsApp link builder
    ├── middleware.ts                  # CSP + security headers
    └── next.config.ts

---

## Features

**Ordering**
- WhatsApp cart — add items, send as a single bundled enquiry or item-by-item
- Cake and bulk B2B enquiry forms with server-side Zod validation
- Built-in chatbot (products, delivery, payments) with WhatsApp handoff

**Security**
- Per-IP rate limiting: 5 req / 10 min on the contact API
- Honeypot + time-trap on all forms (double anti-bot)
- Strict CSP via middleware
- Origin check — API rejects unexpected origins in production
- No PII logged server-side

**SEO / Performance**
- JSON-LD structured data in root layout
- Auto-generated sitemap and robots.txt
- OpenGraph image configured

**Mobile**
- Capacitor shells for iOS and Android — see APP.md

---

## Deployment

Recommended: Vercel

    vercel --prod

Set all env variables in your Vercel project dashboard before deploying.

---

## CI/CD

GitHub Actions runs lint + build on every push. See `.github/workflows/ci.yml`.

---

## License

Private — all rights reserved.
