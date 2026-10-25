import { NextResponse } from "next/server";
import { contactPayloadSchema } from "@/lib/validations";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { sendEnquiryEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // 1. Origin/Referer check
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com";
    if (process.env.NODE_ENV === "production") {
      if (origin && !origin.startsWith(siteUrl)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      if (referer && !referer.startsWith(siteUrl)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    // 2. Body size guard (10KB max)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10240) {
      return NextResponse.json({ success: false, error: "Payload too large" }, { status: 413 });
    }

    // Safe JSON parse
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    // 3. Zod validation
    const parsed = contactPayloadSchema.safeParse(body);
    if (!parsed.success) {
      console.error("[Contact API] Validation error on fields:", Object.keys(parsed.error.flatten().fieldErrors));
      return NextResponse.json({ success: false, error: "Invalid form data provided. Please check your inputs." }, { status: 400 });
    }

    const payload = parsed.data;

    // 4. Rate limiter check by IP
    const ip = getIp(req);
    const { success: rateLimitSuccess, reset } = await rateLimit.limit(ip);
    
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { success: false, error: "Too many requests, please try again in a moment." },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // 5. Anti-bot checks (Honeypot + Time-trap)
    if (payload.honeypot.length > 0) {
      console.warn(`[Contact API] Honeypot triggered`);
      return NextResponse.json({ success: true });
    }
    
    // Reject bots that submit within 2s of form mount (real users need time to fill fields)
    if (payload.formRenderedAt && Date.now() - payload.formRenderedAt < 2000) {
      console.warn("[Contact API] Time-trap triggered (too fast)");
      return NextResponse.json({ success: true });
    }

    // 6. Send templated email via Resend
    await sendEnquiryEmail(payload);

    // 8. On success return { success: true }
    return NextResponse.json({ success: true });

  } catch (error) {
    // 7. On error, log server-side only, return generic 502-style JSON error
    console.error("[Contact API] Unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try WhatsApp or call us directly." },
      { status: 502 }
    );
  }
}
