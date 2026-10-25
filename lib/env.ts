import { z } from "zod";

const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_NOTIFICATION_EMAIL: z.string().email("CONTACT_NOTIFICATION_EMAIL must be a valid email"),
  UPSTASH_REDIS_REST_URL: z.string().url("UPSTASH_REDIS_REST_URL must be a valid URL"),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is required"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{10,15}$/, "NEXT_PUBLIC_WHATSAPP_NUMBER must be 10–15 digits"),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

const buildFallbacks = {
  RESEND_API_KEY: "re_dummy_key_for_build",
  CONTACT_NOTIFICATION_EMAIL: "build@example.com",
  UPSTASH_REDIS_REST_URL: "https://dummy.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "dummy_token_for_build",
  NEXT_PUBLIC_WHATSAPP_NUMBER: "917619436055",
  NEXT_PUBLIC_SITE_URL: "https://therootfood.com",
};

const isServer = typeof window === "undefined";
// next build sets NODE_ENV=production but secrets aren't available yet
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

function parseServerEnv() {
  const raw = { ...buildFallbacks, ...process.env };
  if (process.env.NODE_ENV === "production" && !isBuildPhase) {
    return serverSchema.parse(process.env);
  }
  return serverSchema.parse(raw);
}

function parseClientEnv() {
  const raw = { ...buildFallbacks, ...process.env };
  if (process.env.NODE_ENV === "production" && !isBuildPhase) {
    return clientSchema.parse(process.env);
  }
  return clientSchema.parse(raw);
}

export const env = {
  ...(isServer ? parseServerEnv() : ({} as z.infer<typeof serverSchema>)),
  ...parseClientEnv(),
};
