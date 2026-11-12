export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /** Approximate multiplier from INR → this currency. */
  fromInr: number;
  locale: string;
}

/** Five practical shopper currencies for India + international buyers. */
export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", label: "Indian Rupee", symbol: "₹", fromInr: 1, locale: "en-IN" },
  { code: "USD", label: "US Dollar", symbol: "$", fromInr: 0.012, locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", fromInr: 0.011, locale: "en-IE" },
  { code: "GBP", label: "British Pound", symbol: "£", fromInr: 0.0094, locale: "en-GB" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ", fromInr: 0.044, locale: "en-AE" },
];

export const INR = CURRENCIES[0];

export function getCurrency(code: string | null | undefined): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? INR;
}

function fractionDigits(currency: CurrencyOption): number {
  return currency.code === "INR" ? 0 : 2;
}

/** Converts a rupee amount and rounds it the way the shopper will see it. */
export function convertFromInr(amountInr: number, currency: CurrencyOption): number {
  const factor = 10 ** fractionDigits(currency);
  return Math.round(amountInr * currency.fromInr * factor) / factor;
}

/**
 * Line total in the shopper's currency. The unit price is rounded first and then
 * multiplied, so a basket always adds up to exactly what the price tags say.
 */
export function lineTotal(unitPriceInr: number, quantity: number, currency: CurrencyOption): number {
  const factor = 10 ** fractionDigits(currency);
  return Math.round(convertFromInr(unitPriceInr, currency) * factor * quantity) / factor;
}

/** Formats an amount that is already in `currency`. */
export function formatAmount(amount: number, currency: CurrencyOption): string {
  const digits = fractionDigits(currency);
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(amount);
}

/** Converts a rupee amount to `currency` and formats it. */
export function formatMoney(amountInr: number, currency: CurrencyOption): string {
  return formatAmount(convertFromInr(amountInr, currency), currency);
}

export function formatInr(amountInr: number): string {
  return formatAmount(amountInr, INR);
}
