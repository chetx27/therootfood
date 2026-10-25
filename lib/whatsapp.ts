const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917619436055";

export function buildWhatsAppLink(message: string, number: string = WHATSAPP_NUMBER): string {
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encoded}`;
}

export function bakeryItemMessage(item: string, option?: string): string {
  return [
    "Hi Nitara's Fine Bakes!",
    "",
    `I saw your menu on TheRootFood and I'd love to order the ${item}${option ? ` (${option})` : ""}.`,
    "",
    "Could you let me know when it can be ready and the delivery charge to my area? Thank you!",
  ].join("\n");
}

export interface EnquiryLine {
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
}

function describeLine(line: EnquiryLine): string {
  const qty = line.unit ? `${line.quantity} × (${line.unit.replace(/^per\s+/i, "")})` : `${line.quantity}`;
  return `${line.name} — ${qty}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

export function productEnquiryMessage(productName: string): string {
  return `Hi TheRootFood team! I came across your ${productName} on the website and I'd love to order some. Is it available right now? Please let me know the price and how delivery works. Thanks!`;
}

export function singleItemEnquiryMessage(line: EnquiryLine): string {
  return [
    "Hi TheRootFood team!",
    "",
    `I'd like to order ${describeLine(line)}.`,
    "",
    "Could you confirm it's in stock and let me know the total with delivery? Happy to share my address once you confirm.",
    "",
    "Thank you!",
  ].join("\n");
}

export function basketEnquiryMessage(lines: EnquiryLine[]): string {
  if (lines.length === 1) return singleItemEnquiryMessage(lines[0]);

  const list = lines.map((line, i) => `${i + 1}. ${describeLine(line)}`).join("\n");
  const estimate = lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);
  const hasUnpriced = lines.some((l) => l.price == null);

  return [
    "Hi TheRootFood team!",
    "",
    "I picked out a few things from your website and would like to place an order:",
    "",
    list,
    "",
    estimate > 0
      ? `The website shows about ₹${estimate}${hasUnpriced ? " for the priced items" : ""}.`
      : "",
    "Could you confirm availability and the final total with delivery? I'll send my address once you confirm.",
    "",
    "Thank you!",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}

export function bulkEnquiryMessage(businessName: string, productInterest: string): string {
  return `Hi TheRootFood team! This is ${businessName}. We're looking to buy ${productInterest} in bulk on a regular basis. Could you share your wholesale pricing, minimum order quantity, and how often you can supply? Looking forward to working with you.`;
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
    "I'd love to order a custom cake from you:",
    "",
    `• Flavour: ${details.flavor}`,
    `• Size: ${details.size}`,
    `• Type: ${eggNote}`,
    `• Needed by: ${formatDate(details.requiredDate)}`,
    details.message ? `• Notes: ${details.message}` : "",
    "",
    "Could you let me know if that date works and what it would cost? Thank you!",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}

export function customBakeMessage(idea: string, name?: string): string {
  return [
    name ? `Hi Nitara's Fine Bakes, this is ${name}!` : "Hi Nitara's Fine Bakes!",
    "",
    "I'd love something made just my way:",
    "",
    idea.trim(),
    "",
    "Could you let me know if that's possible and what it would cost? Thank you!",
  ].join("\n");
}

export function defaultEnquiryMessage(): string {
  return "Hi TheRootFood team! I was browsing your website and wanted to know more about what's fresh this week. Could you help me out?";
}
