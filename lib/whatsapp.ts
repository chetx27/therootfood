import { formatAmount, formatInr, lineTotal, type CurrencyOption } from "@/lib/currency";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917483877595";

export function buildWhatsAppLink(message: string, number: string = WHATSAPP_NUMBER): string {
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Opens one or more WhatsApp chats from a single user gesture.
 * Desktop usually opens every link; mobile WhatsApp often only keeps the first,
 * so any chats that did not open are returned for a follow-up tap.
 */
export function openWhatsAppLinks(links: string[]): string[] {
  const unique = [...new Set(links.filter(Boolean))];
  if (unique.length === 0) return [];

  const blocked: string[] = [];
  for (let i = 0; i < unique.length; i++) {
    const win = window.open(unique[i], "_blank", "noopener,noreferrer");
    // Mobile browsers / WhatsApp deep-links often return null even when the first
    // chat opened, so only treat later links as blocked when the window is null.
    if (!win && i > 0) blocked.push(unique[i]);
  }

  // Touch devices rarely allow a second WhatsApp open in one gesture, even when
  // `window.open` looks successful. Queue the rest for a one-tap follow-up.
  if (
    unique.length > 1 &&
    blocked.length === 0 &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return unique.slice(1);
  }

  return blocked;
}

export function bakeryItemMessage(item: string, option?: string): string {
  return [
    "Hi Nitara's Fine Bakes!",
    "",
    `I saw your menu on TheRootFood and I'd like to order the ${item}${option ? ` (${option})` : ""}.`,
    "",
    "When can it be ready, and what's the delivery charge to my area? Thank you!",
  ].join("\n");
}

export interface BakeryLine {
  name: string;
  /** Size or pack, e.g. "500 g, 8 pcs". */
  option?: string;
  quantity: number;
  /** Unit price in rupees. */
  price: number;
}

/** One WhatsApp note for everything the shopper picked from the bakery menu. */
export function bakeryBasketMessage(lines: BakeryLine[]): string {
  if (lines.length === 1 && lines[0].quantity === 1) return bakeryItemMessage(lines[0].name, lines[0].option);

  const list = lines
    .map((l, i) => `${i + 1}. ${l.quantity} × ${l.name}${l.option ? ` (${l.option})` : ""}`)
    .join("\n");
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return [
    "Hi Nitara's Fine Bakes!",
    "",
    "I saw your menu on TheRootFood and I'd like to order:",
    "",
    list,
    "",
    `The menu shows about ${formatInr(total)} for these.`,
    "When can they be ready, and what's the delivery charge to my area? Thank you!",
  ].join("\n");
}

export interface EnquiryLine {
  name: string;
  quantity: number;
  unit?: string;
  /** Unit price in rupees. Leave out for "price on request" items. */
  price?: number;
}

function describeLine(line: EnquiryLine): string {
  const qty = line.unit ? `${line.quantity} × (${line.unit.replace(/^per\s+/i, "")})` : `${line.quantity}`;
  return `${line.name}: ${qty}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

/** Shoppers who picked another currency on the site want to be quoted and to pay in it. */
function paysAbroad(currency?: CurrencyOption): currency is CurrencyOption {
  return !!currency && currency.code !== "INR";
}

export function productEnquiryMessage(productName: string): string {
  return `Hi TheRootFood team! I saw the ${productName} on your website and I'd like to order some. Is it available right now? Please tell me the price and how delivery works. Thanks!`;
}

export function singleItemEnquiryMessage(line: EnquiryLine, currency?: CurrencyOption): string {
  return [
    "Hi TheRootFood team!",
    "",
    `I'd like to order ${describeLine(line)}.`,
    "",
    paysAbroad(currency)
      ? `Could you confirm it's in stock and send me the total with delivery in ${currency.code}? I'd like to pay in ${currency.code}. I'll share my address once you confirm.`
      : "Could you confirm it's in stock and send me the total with delivery? I'll share my address once you confirm.",
    "",
    "Thank you!",
  ].join("\n");
}

export function basketEnquiryMessage(lines: EnquiryLine[], currency?: CurrencyOption): string {
  if (lines.length === 1) return singleItemEnquiryMessage(lines[0], currency);

  const list = lines.map((line, i) => `${i + 1}. ${describeLine(line)}`).join("\n");
  const estimateInr = lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);
  const hasUnpriced = lines.some((l) => l.price == null);
  const abroad = paysAbroad(currency);

  let estimate = "";
  if (estimateInr > 0) {
    const shown = abroad
      ? `${formatAmount(
          lines.reduce((sum, l) => sum + lineTotal(l.price ?? 0, l.quantity, currency), 0),
          currency
        )} (around ${formatInr(estimateInr)})`
      : formatInr(estimateInr);
    estimate = `The website shows about ${shown}${hasUnpriced ? " for the priced items" : ""}.`;
  }

  return [
    "Hi TheRootFood team!",
    "",
    "I picked out a few things from your website and would like to place an order:",
    "",
    list,
    "",
    estimate,
    abroad
      ? `Could you confirm availability and the final total with delivery in ${currency.code}? I'd like to pay in ${currency.code}. I'll send my address once you confirm.`
      : "Could you confirm availability and the final total with delivery? I'll send my address once you confirm.",
    "",
    "Thank you!",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}

export function bulkEnquiryMessage(businessName: string, productInterest: string): string {
  return `Hi TheRootFood team! This is ${businessName}. We'd like to buy ${productInterest} in bulk on a regular basis. Could you share your wholesale pricing, minimum order quantity, and how often you can supply?`;
}

export function cakeEnquiryMessage(details: {
  cakeType: string;
  size: string;
  flavor: string;
  requiredDate: string;
  name?: string;
  message?: string;
}): string {
  const eggNote = details.cakeType === "eggless" ? "Eggless" : "With egg";
  return [
    details.name ? `Hi Nitara's Fine Bakes, this is ${details.name}!` : "Hi Nitara's Fine Bakes!",
    "",
    "I'd like to order a custom cake:",
    "",
    `• Flavour: ${details.flavor}`,
    `• Size: ${details.size}`,
    `• Type: ${eggNote}`,
    `• Needed by: ${formatDate(details.requiredDate)}`,
    details.message ? `• Notes: ${details.message}` : "",
    "",
    "Does that date work, and what would it cost? Thank you!",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}

export function customBakeMessage(idea: string, name?: string): string {
  return [
    name ? `Hi Nitara's Fine Bakes, this is ${name}!` : "Hi Nitara's Fine Bakes!",
    "",
    "Here's what I have in mind:",
    "",
    idea.trim(),
    "",
    "Can you make this, and what would it cost? Thank you!",
  ].join("\n");
}

export function defaultEnquiryMessage(): string {
  return "Hi TheRootFood team! I was looking at your website and wanted to ask what's available this week.";
}
