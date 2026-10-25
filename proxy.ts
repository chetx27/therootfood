import { NextResponse } from "next/server";

/**
 * Single source of truth for security headers — do not duplicate in next.config.ts.
 *
 * Note: pages are statically prerendered, so a per-request nonce + 'strict-dynamic'
 * CSP cannot work (the build-time HTML has no nonce and every script gets blocked).
 * We use a host-based allowlist instead; 'unsafe-eval' only in development for HMR.
 * style-src keeps 'unsafe-inline' because Tailwind/shadcn inject inline styles at runtime.
 */
export function proxy() {
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io`
      : `'self' 'unsafe-inline' https://plausible.io`;

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self' https://plausible.io https://api.resend.com;
    report-uri /api/csp-report;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return response;
}

export const config = {
  matcher: "/(.*)",
};
