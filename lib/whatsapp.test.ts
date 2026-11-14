import { describe, expect, it } from "vitest";
import {
  buildWhatsAppLink,
  productEnquiryMessage,
  basketEnquiryMessage,
  bakeryBasketMessage,
  bakeryItemMessage,
  cakeEnquiryMessage,
  defaultEnquiryMessage,
} from "@/lib/whatsapp";
import { formatAmount, getCurrency, lineTotal } from "@/lib/currency";

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
    expect(msg).toContain("1. Ragi Flour: 2 × (kg)");
    expect(msg).toContain("2. Tea Cakes: 1");
    expect(msg).toContain("₹498");
  });

  it("basketEnquiryMessage asks to pay in the shopper's currency and keeps the rupee amount", () => {
    const usd = getCurrency("USD");
    const msg = basketEnquiryMessage(
      [
        { name: "Ragi Flour", quantity: 2, unit: "per kg", price: 249 },
        { name: "Goat Milk Soap", quantity: 1, unit: "per 100g", price: 150 },
      ],
      usd
    );
    expect(msg).toContain(formatAmount(lineTotal(249, 2, usd) + lineTotal(150, 1, usd), usd));
    expect(msg).toContain("(around ₹648)");
    expect(msg).toContain("I'd like to pay in USD");
  });

  it("bakeryBasketMessage puts several bakes in one note with the menu total", () => {
    const msg = bakeryBasketMessage([
      { name: "Choco Chips Brownie", option: "500 g, 8 pcs", quantity: 1, price: 620 },
      { name: "Triple Chocolate Brownie", option: "500 g, 8 pcs", quantity: 2, price: 750 },
      { name: "Red velvet cake", quantity: 1, price: 1050 },
    ]);
    expect(msg).toContain("1. 1 × Choco Chips Brownie (500 g, 8 pcs)");
    expect(msg).toContain("2. 2 × Triple Chocolate Brownie (500 g, 8 pcs)");
    expect(msg).toContain("3. 1 × Red velvet cake");
    expect(msg).toContain("₹3,170");
    expect(msg).toContain("Nitara's Fine Bakes");
  });

  it("bakeryBasketMessage keeps the simple note for a single bake", () => {
    const line = { name: "Brownie Tub", option: "Full tub (500 g)", quantity: 1, price: 580 };
    expect(bakeryBasketMessage([line])).toBe(bakeryItemMessage("Brownie Tub", "Full tub (500 g)"));
    expect(bakeryBasketMessage([{ ...line, quantity: 3 }])).toContain("1. 3 × Brownie Tub (Full tub (500 g))");
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
