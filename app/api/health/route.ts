import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  const required = [
    env.RESEND_API_KEY,
    env.CONTACT_NOTIFICATION_EMAIL,
    env.UPSTASH_REDIS_REST_URL,
    env.UPSTASH_REDIS_REST_TOKEN,
    env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    env.NEXT_PUBLIC_SITE_URL,
  ];

  const allSet = required.every(Boolean);

  if (!allSet) {
    return NextResponse.json(
      { status: "degraded", service: "therootfood", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "therootfood",
  });
}
