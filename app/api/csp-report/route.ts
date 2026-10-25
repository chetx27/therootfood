import { NextResponse } from "next/server";

/** Receives Content-Security-Policy violation reports from the browser. */
export async function POST(req: Request) {
  try {
    const report = await req.json();
    console.warn("[CSP Violation]", JSON.stringify(report));
  } catch {
    // Ignore malformed reports
  }
  return new NextResponse(null, { status: 204 });
}
