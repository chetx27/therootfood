import { describe, it, expect } from "vitest";
import {
  buildWhatsAppLink,
  productEnquiryMessage,
  basketEnquiryMessage,
  cakeEnquiryMessage,
  defaultEnquiryMessage,
} from "@/lib/whatsapp";

describe("buildWhatsAppLink", () => {
  it("produces a valid wa.me URL with encoded message", () => {
    const link = buildWhatsAppLink("Hi, I'd like to order Ragi Flour.");
    expect(link).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(link).toContain(encodeURIComponent("Hi, I'd like to order Ragi Flour."));
  });

  it("trims whitespace before encoding", () => {
    const link = buildWhatsAppLink("  hello  ");
    expect(link).toContain(encodeURIComponent("hello"));
    expect(link).not.toContain(encodeURIComponent("  hello  "));
  });
});

describe("message builders", () => {
  it("productEnquiryMessage includes product name", () => {
    expect(productEnquiryMessage("Ragi Flour")).toContain("Ragi Flour");
  });

  it("basketEnquiryMessage lists every item", () => {
    const msg = basketEnquiryMessage([
      { name: "Ragi Flour", quantity: 2, unit: "per kg", price: 249 },
      { name: "Tea Cakes", quantity: 1 },
    ]);
    expect(msg).toContain("1. Ragi Flour — 2 × (kg)");
    expect(msg).toContain("2. Tea Cakes — 1");
    expect(msg).toContain("₹498");
  });

  it("cakeEnquiryMessage includes all details", () => {
    const msg = cakeEnquiryMessage({
      cakeType: "eggless",
      size: "1kg",
      flavor: "Red Velvet",
      requiredDate: "2026-08-15",
    });
    expect(msg).toContain("Eggless");
    expect(msg).toContain("1kg");
    expect(msg).toContain("Red Velvet");
  });

  it("defaultEnquiryMessage returns a non-empty string", () => {
    expect(defaultEnquiryMessage().length).toBeGreaterThan(0);
  });
});
