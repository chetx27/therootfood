import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(80);
const messageSchema = z.string().trim().max(600).optional();

export const generalEnquirySchema = z.object({
  enquiryType: z.literal("general"),
  name: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  message: messageSchema,
  honeypot: z.string().max(0), // must stay empty; bots fill hidden fields
  formRenderedAt: z.number().optional(),
});

export const bulkEnquirySchema = z.object({
  enquiryType: z.literal("bulk"),
  businessName: z.string().trim().min(2, "Business name required").max(120),
  contactName: nameSchema,
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email").max(120),
  productInterest: z.string().trim().min(2).max(200),
  estimatedVolume: z.string().trim().max(100),
  message: messageSchema,
  honeypot: z.string().max(0),
  formRenderedAt: z.number().optional(),
});

export const cakeEnquirySchema = z.object({
  enquiryType: z.literal("cake"),
  cakeType: z.enum(["eggless", "with_egg"]),
  size: z.enum(["0.5kg", "1kg", "1.5kg", "2kg"]),
  flavor: z.string().trim().min(2, "Flavor required").max(60),
  requiredDate: z.string().trim().refine((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Date must be today or in the future"),
  name: nameSchema,
  phone: phoneSchema,
  message: messageSchema,
  honeypot: z.string().max(0),
  formRenderedAt: z.number().optional(),
});

export const productEnquirySchema = z.object({
  enquiryType: z.literal("product"),
  productSlug: z.string().trim().min(1).max(80),
  name: nameSchema,
  phone: phoneSchema,
  message: messageSchema,
  honeypot: z.string().max(0),
  formRenderedAt: z.number().optional(),
});

export const contactPayloadSchema = z.discriminatedUnion("enquiryType", [
  generalEnquirySchema,
  bulkEnquirySchema,
  cakeEnquirySchema,
  productEnquirySchema,
]);

export type GeneralEnquiryFormValues = z.infer<typeof generalEnquirySchema>;
export type BulkEnquiryFormValues = z.infer<typeof bulkEnquirySchema>;
export type CakeEnquiryFormValues = z.infer<typeof cakeEnquirySchema>;
export type ProductEnquiryFormValues = z.infer<typeof productEnquirySchema>;
export type ContactPayload = z.infer<typeof contactPayloadSchema>;
