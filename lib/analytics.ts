"use client";

import { usePlausible } from "next-plausible";

export type AnalyticsEvent =
  | "enquiry_submitted"
  | "enquiry_whatsapp_click"
  | "enquiry_form_open"
  | "product_whatsapp_click"
  | "bulk_enquiry_submitted"
  | "cake_enquiry_submitted"
  | "contact_form_submitted"
  | "add_to_cart"
  | "whatsapp_enquiry_sent"
  | "chatbot_message"
  | "chatbot_opened"
  | "chatbot_whatsapp_handoff";

type EventProperties = Record<string, string | number | boolean>;

/**
 * Hook to fire Plausible analytics events.
 *
 * Usage:
 * ```ts
 * const track = useAnalytics();
 * track("product_whatsapp_click", { productId: "ragi-flour" });
 * ```
 */
export function useAnalytics() {
  const plausible = usePlausible();

  return function track(event: AnalyticsEvent, props?: EventProperties) {
    try {
      plausible(event, { props });
    } catch {
      // Silently ignore – analytics should never break the app
    }
  };
}
