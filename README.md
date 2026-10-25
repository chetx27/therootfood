# TheRootFood Website

Farm-direct products e-commerce website built with Next.js (App Router) + TypeScript.

## Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 (App Router)            |
| Language   | TypeScript                         |
| Styling    | Tailwind CSS v4                    |
| Forms      | React Hook Form + Zod validation   |
| Email      | Resend                             |
| Rate Limit | Upstash Redis + @upstash/ratelimit |
| Animations | Framer Motion                      |
| Components | shadcn/ui                          |

## Getting Started

### 1. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable                      | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| `RESEND_API_KEY`              | Resend API key for sending emails                      |
| `CONTACT_NOTIFICATION_EMAIL`  | Email address to receive enquiry notifications         |
| `UPSTASH_REDIS_REST_URL`      | Upstash Redis URL for rate limiting                    |
| `UPSTASH_REDIS_REST_TOKEN`    | Upstash Redis token                                    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp number (digits only, no + or spaces) |
| `NEXT_PUBLIC_SITE_URL`        | Production URL e.g. `https://therootfood.com`          |

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
therootfood/
├── app/
│   ├── api/
│   │   ├── contact/route.ts     # Enquiry email endpoint (rate-limited, validated)
│   │   └── health/route.ts      # Health check endpoint
│   ├── about/page.tsx           # About page
│   ├── faq/page.tsx             # FAQ page
│   ├── privacy/page.tsx         # Privacy policy
│   ├── terms/page.tsx           # Terms of service
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   ├── loading.tsx              # Global loading state
│   ├── layout.tsx               # Root layout with JSON-LD
│   ├── page.tsx                 # Home page
│   ├── sitemap.ts               # XML sitemap
│   └── robots.ts                # robots.txt
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav-drawer.tsx
│   │   └── floating-whatsapp-button.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── trust-strip.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-card.tsx
│   │   ├── cake-enquiry-section.tsx
│   │   ├── bulk-enquiry-section.tsx
│   │   └── contact-section.tsx
│   └── shared/
│       ├── fade-in.tsx
│       └── section-heading.tsx
├── data/
│   └── products.ts              # Product catalogue
├── lib/
│   ├── business-info.ts         # Business metadata for JSON-LD
│   ├── email.ts                 # Resend email helper
│   ├── env.ts                   # Zod env validation
│   ├── rate-limit.ts            # Upstash rate limiter
│   ├── utils.ts                 # Utility functions
│   ├── validations.ts           # Zod form schemas
│   └── whatsapp.ts              # WhatsApp link builder
├── public/
│   ├── products/                # Product images
│   ├── hero.png                 # Hero image
│   ├── og-image.png             # OpenGraph image
│   └── favicon/                 # Favicon set
├── middleware.ts                # CSP headers + security headers
└── next.config.ts               # Next.js config
```

## Commerce & App Features

- **WhatsApp ordering**: Add products to a basket and send them as one enquiry or item-by-item on WhatsApp — no online payment
- **Chatbot**: Built-in knowledge-base assistant (products, delivery, payments) with WhatsApp handoff
- **Mobile apps**: Capacitor iOS/Android shells around the live site — see `APP.md`

## Security Features

- **Rate limiting**: Per-IP, 5 requests/10 min on the contact API
- **Honeypot + time-trap**: Double anti-bot protection on all forms
- **CSP**: Strict Content Security Policy via middleware
- **Zod validation**: All form submissions validated server-side
- **Origin check**: API rejects requests from unexpected origins in production
- **No PII in logs**: Contact details not logged on the server

## Deployment

Deploy to Vercel (recommended):

```bash
vercel --prod
```

Ensure all environment variables are set in your Vercel project dashboard before deploying.

## CI/CD

GitHub Actions runs lint and build checks on every push. See `.github/workflows/ci.yml`.
