# TheRootFood

Storefront for TheRootFood, a Bangalore farm that sells flours, herbal roots, country eggs, meat and goat milk soap directly to customers, together with the cake and brownie menu of its bakery partner, Nitara's Fine Bakes.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Production URL: [therootfood.com](https://therootfood.com)

## Overview

The site is an enquiry-first storefront. Nothing is charged on the website: shoppers build a basket, send it to the farm as a pre-written WhatsApp message, and the farm confirms stock, delivery and the final amount in that chat. Payment happens afterwards by UPI, bank transfer or cash on delivery.

There is no database and no admin panel. The catalog, bakery menu, FAQs and chatbot answers are TypeScript files in this repository, so a content change is a code change followed by a deploy.

## Features

| Area             | What it does                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basket           | Add farm products on `/order`, adjust quantities, then send the whole basket in one WhatsApp message or ask about a single item. The basket is kept in `localStorage` (20 units per item).    |
| Currency display | Prices can be shown in INR, USD, EUR, GBP or AED. The choice carries through the basket and into the WhatsApp message.                                                                        |
| Bakery           | `/cakes` lists the Nitara's Fine Bakes menu (cakes, brownies, boxes, occasions). Bakery orders and custom cake requests open a WhatsApp chat with the bakery's own number.                    |
| Enquiry forms    | The general contact form and the bulk (B2B) form post to `/api/contact`, which emails the enquiry to the business.                                                                            |
| Chat assistant   | A rule-based assistant answers questions about products, prices, delivery, payment and cakes, and hands over to WhatsApp when it cannot help. It runs in the browser and calls no AI service. |
| SEO              | Per-page metadata and canonical URLs, Open Graph and Twitter cards, `LocalBusiness`, `Product` and `FAQPage` JSON-LD, generated `sitemap.xml` and `robots.txt`.                               |
| Analytics        | Cookieless page and event tracking with Plausible. See [ANALYTICS.md](ANALYTICS.md).                                                                                                          |
| Mobile apps      | Capacitor shells for iOS and Android that load the production site. See [APP.md](APP.md).                                                                                                     |

## Tech stack

| Layer          | Technology                                                           |
| -------------- | -------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19                                    |
| Language       | TypeScript 5, strict mode                                            |
| Styling        | Tailwind CSS 4, shadcn/ui components on Base UI and Radix primitives |
| Animation      | Framer Motion                                                        |
| Forms          | React Hook Form with Zod 4 schemas shared by client and server       |
| Email          | Resend                                                               |
| Rate limiting  | Upstash Redis with `@upstash/ratelimit`                              |
| Analytics      | Plausible via `next-plausible`                                       |
| Error tracking | Sentry SDK (scaffolded, see [Known limitations](#known-limitations)) |
| Mobile         | Capacitor 8                                                          |
| Testing        | Vitest                                                               |
| Tooling        | ESLint 9, Prettier, Husky with lint-staged, Dependabot               |

## Getting started

### Prerequisites

- Node.js 20.9 or later (CI runs on Node 20)
- npm

### Install and run

```bash
git clone https://github.com/chetx27/therootfood.git
cd therootfood
npm install
npm run dev
```

The site is served at `http://localhost:3000`.

The pages run in development without any environment variables, because `lib/env.ts` substitutes placeholders. The enquiry forms are the exception: they need working Resend and Upstash credentials, and return an error without them.

### Environment variables

Create `.env.local` in the project root:

```bash
RESEND_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=
```

| Variable                      | Scope  | Description                                                                   |
| ----------------------------- | ------ | ----------------------------------------------------------------------------- |
| `RESEND_API_KEY`              | Server | Resend API key used to send enquiry emails.                                   |
| `CONTACT_NOTIFICATION_EMAIL`  | Server | Inbox that receives enquiries. Must be a valid email address.                 |
| `UPSTASH_REDIS_REST_URL`      | Server | Upstash Redis REST URL, used for rate limiting and the failed-email queue.    |
| `UPSTASH_REDIS_REST_TOKEN`    | Server | Upstash Redis REST token.                                                     |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | The farm's WhatsApp number: country code and number, 10 to 15 digits, no `+`. |
| `NEXT_PUBLIC_SITE_URL`        | Public | Canonical site URL, for example `https://therootfood.com`.                    |
| `NEXT_PUBLIC_SENTRY_DSN`      | Public | Optional. Sentry DSN read by the three `sentry.*.config.ts` files.            |

All six required variables are validated with Zod in `lib/env.ts`. In production the API routes refuse to run if any of them is missing or malformed. During development and `next build`, missing values fall back to placeholders so the build never needs real secrets.

`.gitignore` excludes every `.env*` file. Keep real credentials in `.env.local` and in the hosting provider's settings, never in the repository.

## Scripts

| Command                     | Purpose                                                                       |
| --------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`               | Start the development server.                                                 |
| `npm run build`             | Create a production build.                                                    |
| `npm run start`             | Serve the production build.                                                   |
| `npm run lint`              | Run ESLint.                                                                   |
| `npm test`                  | Run the Vitest suite once.                                                    |
| `npx tsc --noEmit`          | Type-check the project.                                                       |
| `npm run compress:images`   | Convert product and hero images to WebP and regenerate the blur placeholders. |
| `npm run generate:favicons` | Rebuild the favicon and app icon set from `public/rootfood-icon-src.png`.     |
| `npm run app:sync`          | Sync the Capacitor configuration into the native projects.                    |
| `npm run app:ios`           | Open the iOS project in Xcode.                                                |
| `npm run app:android`       | Open the Android project in Android Studio.                                   |

## Project structure

```text
therootfood/
├── app/
│   ├── api/
│   │   ├── contact/route.ts       Enquiry endpoint
│   │   ├── csp-report/route.ts    Receives CSP violation reports
│   │   └── health/route.ts        Health check
│   ├── about/  cakes/  contact/  faq/  order/  privacy/  terms/
│   ├── layout.tsx                 Fonts, metadata, providers, LocalBusiness JSON-LD
│   ├── page.tsx                   Home page, Product JSON-LD
│   ├── sitemap.ts  robots.ts
│   └── error.tsx  loading.tsx  not-found.tsx
├── components/
│   ├── bakery/                    Bakery menu, brownie sets, occasions
│   ├── cart/                      Basket button and drawer
│   ├── chatbot/                   Chat widget
│   ├── faq/                       FAQ explorer
│   ├── layout/                    Navbar, footer, mobile drawer, WhatsApp button
│   ├── order/                     Order page hero and extras
│   ├── sections/                  Home page sections, product grid, enquiry forms
│   ├── shared/                    Reusable presentation helpers
│   └── ui/                        shadcn/ui primitives
├── data/
│   └── products.ts                Farm product catalog
├── lib/
│   ├── bakery-menu.ts             Bakery contact details, menu and prices
│   ├── business-info.ts           Business details used in JSON-LD
│   ├── cart-context.tsx           Basket state and persistence
│   ├── chatbot-knowledge.ts       Chat assistant intents and matching
│   ├── currency.ts                Currencies, conversion and formatting
│   ├── email.ts                   Resend sender with Redis fallback
│   ├── env.ts                     Environment validation
│   ├── faqs.ts                    FAQ content
│   ├── rate-limit.ts              Upstash rate limiter
│   ├── validations.ts             Zod schemas for every enquiry type
│   └── whatsapp.ts                WhatsApp link and message builders
├── types/product.ts               Product model
├── scripts/                       Image and favicon generation (sharp)
├── public/                        Images, icons, web manifest
├── proxy.ts                       Security headers and Content Security Policy
├── capacitor.config.ts            Mobile shell configuration
├── android/  ios/  mobile-shell/  Native projects and offline fallback page
└── .github/                       CI workflow and Dependabot configuration
```

## How it works

### Enquiry API

`POST /api/contact` accepts a JSON body and processes it in this order:

1. In production, rejects requests whose `Origin` or `Referer` does not start with `NEXT_PUBLIC_SITE_URL` (403).
2. Rejects bodies with a declared size over 10 KB (413) and malformed JSON (400).
3. Validates the body against a Zod discriminated union of four enquiry types: `general`, `bulk`, `cake` and `product` (400). The schema also requires the hidden honeypot field to be empty. The site's forms currently submit `general` and `bulk`.
4. Applies a per-IP rate limit of 5 requests per 60 seconds, sliding window (429 with `Retry-After`). The IP is read from `x-forwarded-for`.
5. Drops submissions sent less than 2 seconds after the form was rendered. These get a normal success response, so a bot cannot tell it was filtered.
6. Sends the enquiry by email through Resend. If sending fails, the enquiry is pushed to the Redis list `therootfood:failed_emails` so it is not lost.

When validation fails, the server logs the names of the invalid fields, not their values.

`GET /api/health` returns `200` with `"status": "ok"` when the environment is valid. Any other response means the configuration is broken.

### Security headers

`proxy.ts` (the Next.js 16 name for middleware) sets the headers for every route and is the only place they are defined:

- Content Security Policy with a host allowlist. Pages are statically prerendered, so a nonce-based policy is not possible; `script-src` allows `'self'`, inline scripts and `plausible.io`. Violations are reported to `/api/csp-report`.
- `Strict-Transport-Security` (two years, subdomains, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` and a `Permissions-Policy` that disables camera, microphone and geolocation.

Any new third-party script or API host must be added to the policy in `proxy.ts`, or the browser will block it.

### Currency

Rupee prices in `data/products.ts` are the source of truth. `lib/currency.ts` converts them with fixed multipliers. Unit prices are rounded first and then multiplied, so basket totals always match the price tags. Converted prices are estimates for the shopper; the farm confirms the final amount on WhatsApp.

### Chat assistant

`lib/chatbot-knowledge.ts` scores each message against a list of intents, tolerates single-character typos in longer words, recognises products by alias and remembers the last product for follow-ups such as "how much is it?". Product names and prices are read from the catalog, so they stay in sync with it.

## Updating content

| To change                                  | Edit                          |
| ------------------------------------------ | ----------------------------- |
| Farm products, prices, availability        | `data/products.ts`            |
| Bakery menu, prices, bakery contact number | `lib/bakery-menu.ts`          |
| FAQs                                       | `lib/faqs.ts`                 |
| Chat assistant answers and product aliases | `lib/chatbot-knowledge.ts`    |
| Exchange rates and supported currencies    | `lib/currency.ts`             |
| Business name, email, phone, address       | `lib/business-info.ts`        |
| Farm WhatsApp number                       | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| WhatsApp message wording                   | `lib/whatsapp.ts`             |

To add a product:

1. Put the source image (PNG or JPEG) in `public/products/`.
2. Run `npm run compress:images` to create the WebP file and its blur placeholder.
3. Add the product to `data/products.ts`, pointing `imageSrc` at the `.webp` file.
4. Add aliases and a description for it in `lib/chatbot-knowledge.ts` so the assistant can talk about it.
5. Run `npm test`.

## Quality checks

- **Tests**: Vitest covers the validation schemas, the WhatsApp message builders and the chat assistant (`lib/*.test.ts`).
- **Pre-commit**: Husky runs lint-staged, which type-checks the project, applies ESLint fixes to staged TypeScript and JavaScript files, and formats Markdown and JSON with Prettier.
- **CI**: `.github/workflows/ci.yml` runs on pushes to `main` and `develop` and on pull requests to `main`. It installs with `npm ci`, then runs ESLint, the tests, a type check and a production build.
- **Dependencies**: Dependabot opens weekly update pull requests for npm packages and GitHub Actions.

## Deployment

The app is a standard Next.js 16 build with no host-specific configuration. Vercel runs it without extra setup:

```bash
vercel --prod
```

Before going live:

- Set the six required environment variables on the host.
- Verify the `therootfood.com` domain in Resend. Enquiry emails are sent from `notifications@therootfood.com`.
- Confirm the host forwards the client IP in `x-forwarded-for`. Without it, every visitor shares one rate limit.
- Point uptime monitoring at `/api/health`.
- After the first enquiry, confirm the email arrives and that the Redis list `therootfood:failed_emails` is empty.

## Mobile apps

The iOS and Android apps are Capacitor shells (app ID `com.therootfood.app`) that load the production site, so every web deploy reaches the apps without a store release. `mobile-shell/index.html` is shown only when the device is offline on first launch. Build and store submission steps are in [APP.md](APP.md).

## Known limitations

- **Sentry is not reporting yet.** The SDK and its three config files are present, but there is no `instrumentation.ts` to load the server and edge configs, and the Content Security Policy does not allow connections to Sentry.
- **The failed-email queue has no reader.** Enquiries that could not be emailed are stored in Redis under `therootfood:failed_emails` and must be checked by hand.
- **Exchange rates are fixed values** in `lib/currency.ts` and need manual updates.
- **The enquiry forms accept Indian mobile numbers only** (10 digits). Customers abroad are expected to use WhatsApp.

## Documentation

- [APP.md](APP.md): building and publishing the iOS and Android apps
- [ANALYTICS.md](ANALYTICS.md): Plausible setup and custom events

## License

Proprietary. All rights reserved.

Contact: [therootfoodsupport@gmail.com](mailto:therootfoodsupport@gmail.com)
