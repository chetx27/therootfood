export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /** Approximate multiplier from INR → this currency (display only). */
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

export function convertFromInr(amountInr: number, currency: CurrencyOption): number {
  return amountInr * currency.fromInr;
}

export function formatMoney(amountInr: number, currency: CurrencyOption): string {
  const value = convertFromInr(amountInr, currency);
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: currency.code === "INR" ? 0 : 2,
    minimumFractionDigits: currency.code === "INR" ? 0 : 2,
  }).format(value);
}
