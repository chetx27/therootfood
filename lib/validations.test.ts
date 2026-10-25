import { describe, it, expect } from "vitest";
import {
  generalEnquirySchema,
  bulkEnquirySchema,
  cakeEnquirySchema,
  productEnquirySchema,
} from "@/lib/validations";

describe("generalEnquirySchema", () => {
  const valid = {
    enquiryType: "general" as const,
    name: "Jane Doe",
    phone: "9876543210",
    email: "",
    message: "Hello",
    honeypot: "",
  };

  it("accepts valid general enquiry", () => {
    expect(generalEnquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid phone (9 digits)", () => {
    expect(generalEnquirySchema.safeParse({ ...valid, phone: "987654321" }).success).toBe(false);
  });

  it("rejects phone starting with 5", () => {
    expect(generalEnquirySchema.safeParse({ ...valid, phone: "5876543210" }).success).toBe(false);
  });

  it("rejects filled honeypot", () => {
    expect(generalEnquirySchema.safeParse({ ...valid, honeypot: "spam" }).success).toBe(false);
  });
});

describe("bulkEnquirySchema", () => {
  const valid = {
    enquiryType: "bulk" as const,
    businessName: "Acme Foods",
    contactName: "John Doe",
    phone: "9123456789",
    email: "john@acme.com",
    productInterest: "Ragi Flour",
    estimatedVolume: "10 kg/week",
    message: "",
    honeypot: "",
  };

  it("accepts valid bulk enquiry", () => {
    expect(bulkEnquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(bulkEnquirySchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
});

describe("cakeEnquirySchema", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  const valid = {
    enquiryType: "cake" as const,
    cakeType: "eggless" as const,
    size: "1kg" as const,
    flavor: "Chocolate Truffle",
    requiredDate: dateStr,
    name: "Jane Doe",
    phone: "9876543210",
    message: "",
    honeypot: "",
  };

  it("accepts valid cake enquiry", () => {
    expect(cakeEnquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects past date", () => {
    expect(cakeEnquirySchema.safeParse({ ...valid, requiredDate: "2020-01-01" }).success).toBe(false);
  });
});

describe("productEnquirySchema", () => {
  it("accepts valid product enquiry", () => {
    expect(
      productEnquirySchema.safeParse({
        enquiryType: "product",
        productSlug: "ragi-flour",
        name: "Jane Doe",
        phone: "9876543210",
        message: "",
        honeypot: "",
      }).success
    ).toBe(true);
  });
});
