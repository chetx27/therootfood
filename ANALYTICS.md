# Analytics

TheRootFood uses [Plausible Analytics](https://plausible.io) — a privacy-first, GDPR-compliant analytics platform that requires no cookie banner and sends zero data to Google.

## Setup

1. Create a free account at [plausible.io](https://plausible.io)
2. Add your domain `therootfood.com`
3. No environment variables needed — `next-plausible` auto-injects the script

The `PlausibleProvider` is already configured in `app/layout.tsx`.

## Custom Events

Custom events are tracked using the `useAnalytics()` hook from `lib/analytics.ts`.

### Available Events

| Event Name               | When It Fires                              |
| ------------------------ | ------------------------------------------ |
| `enquiry_submitted`      | Any enquiry form is submitted successfully |
| `enquiry_whatsapp_click` | WhatsApp button is clicked                 |
| `product_whatsapp_click` | Product card WhatsApp button is clicked    |
| `bulk_enquiry_submitted` | Bulk order form is submitted               |
| `cake_enquiry_submitted` | Cake order form is submitted               |
| `contact_form_submitted` | General contact form is submitted          |

### Usage in a Component

```tsx
"use client";
import { useAnalytics } from "@/lib/analytics";

function MyForm() {
  const track = useAnalytics();

  async function onSubmit() {
    // ... submit logic
    track("contact_form_submitted");
    // With properties:
    track("product_whatsapp_click", { productId: "ragi-flour" });
  }
}
```

## Dashboard

Once live, view your analytics at:
`https://plausible.io/therootfood.com`

## What Data Is Collected

- Page views and unique visitors
- Traffic sources (referrers, UTM parameters)
- Country and device type
- Custom goal conversions

**No personal data, no cookies, no GDPR consent banner required.**
