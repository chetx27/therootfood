import { NextResponse } from "next/server";
import { z } from "zod";
import { buildBasketDeliveries } from "@/lib/basket-enquiry";

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

/**
 * Builds one WhatsApp link per kitchen. This route does not touch email or
 * Redis: those imports were crashing every API route in production and the
 * basket button died on the error page before WhatsApp could open.
 */
export async function POST(req: Request) {
  try {
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
