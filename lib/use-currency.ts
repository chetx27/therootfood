"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getCurrency, type CurrencyCode, type CurrencyOption } from "@/lib/currency";

const STORAGE_KEY = "therootfood-currency";
const CHANGE_EVENT = "therootfood-currency-change";

/** Used when localStorage is blocked (private mode), so the picker still works for the visit. */
let sessionCode: string | null = null;

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readCode(): string {
  if (sessionCode) return sessionCode;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "INR";
  } catch {
    return "INR";
  }
}

/**
 * The currency the shopper picked on the order page. It is shared by the product
 * cards, the basket and the WhatsApp order note, and remembered between visits.
 */
export function useCurrency(): { currency: CurrencyOption; setCurrencyCode: (code: CurrencyCode) => void } {
  // The server (and the first client render) always use INR so hydration matches.
  const code = useSyncExternalStore(subscribe, readCode, () => "INR");

  const setCurrencyCode = useCallback((next: CurrencyCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      sessionCode = next;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { currency: getCurrency(code), setCurrencyCode };
}
