import { NextResponse } from "next/server";
import { z } from "zod";
import { buildBasketDeliveries } from "@/lib/basket-enquiry";
import { getIp, rateLimit } from "@/lib/rate-limit";

const basketEnquirySchema = z.object({
  currency: z.enum(["INR", "USD", "EUR", "GBP", "AED"]),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1).max(120),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1)
    .max(30),
});

export async function POST(req: Request) {
  try {
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

    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10240) {
      return NextResponse.json({ success: false, error: "Payload too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = basketEnquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "That basket could not be read." }, { status: 400 });
    }

    const ip = getIp(req);
    try {
      const { success: allowed, reset } = await rateLimit.limit(ip);
      if (!allowed) {
        return NextResponse.json(
          { success: false, error: "Too many requests, please try again in a moment." },
          { status: 429, headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() } }
        );
      }
    } catch (error) {
      console.error("[Basket enquiry] Rate limit unavailable:", error);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 503 });
      }
    }

    const deliveries = buildBasketDeliveries(parsed.data.items, parsed.data.currency);
    if (deliveries.length === 0) {
      return NextResponse.json({ success: false, error: "Nothing in that basket can be ordered." }, { status: 400 });
    }

    return NextResponse.json({ success: true, deliveries });
  } catch (error) {
    console.error("[Basket enquiry] Unhandled error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
