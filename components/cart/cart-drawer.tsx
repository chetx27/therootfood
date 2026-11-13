"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart, getProduct } from "@/lib/cart-context";
import { useAnalytics } from "@/lib/analytics";
import { formatAmount, formatInr, formatMoney, INR, lineTotal, type CurrencyOption } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { bakery } from "@/lib/bakery-menu";
import { getBakeryItem } from "@/lib/bakery-basket";
import {
  bakeryBasketMessage,
  basketEnquiryMessage,
  buildWhatsAppLink,
  singleItemEnquiryMessage,
} from "@/lib/whatsapp";

type Seller = "farm" | "bakery";

/** One basket row, whichever kitchen it comes from. */
interface Line {
  id: string;
  seller: Seller;
  name: string;
  /** Farm: pack size ("per kg"). Bakery: size or box ("500 g, 8 pcs"). */
  detail?: string;
  /** Rupees. Missing for farm items that are priced on request. */
  price?: number;
  quantity: number;
  image: string;
  imageAlt: string;
  /** Used for analytics only. */
  ref: string;
}

/** Everything that goes to one WhatsApp number. */
interface Group {
  seller: Seller;
  title: string;
  lines: Line[];
  /** The farm quotes in the shopper's currency; the bakery only in rupees. */
  currency: CurrencyOption;
  total: number;
  totalInr: number;
  hasUnpriced: boolean;
  sendAllLink: string;
}

function toLine(productId: string, quantity: number): Line | undefined {
  const product = getProduct(productId);
  if (product) {
    return {
      id: productId,
      seller: "farm",
      name: product.name,
      detail: product.unit,
      price: product.priceType === "fixed" ? product.price : undefined,
      quantity,
      image: product.imageSrc,
      imageAlt: product.imageAlt,
      ref: product.slug,
    };
  }
  const bake = getBakeryItem(productId);
  if (bake) {
    return {
      id: productId,
      seller: "bakery",
      name: bake.name,
      detail: bake.option,
      price: bake.price,
      quantity,
      image: bake.image,
      imageAlt: bake.name,
      ref: bake.id,
    };
  }
  return undefined;
}

function farmEnquiryLine(line: Line) {
  return { name: line.name, quantity: line.quantity, unit: line.detail, price: line.price };
}

function bakeryEnquiryLine(line: Line) {
  return { name: line.name, option: line.detail, quantity: line.quantity, price: line.price ?? 0 };
}

function singleLink(line: Line, currency: CurrencyOption): string {
  return line.seller === "bakery"
    ? buildWhatsAppLink(bakeryBasketMessage([bakeryEnquiryLine(line)]), bakery.whatsapp)
    : buildWhatsAppLink(singleItemEnquiryMessage(farmEnquiryLine(line), currency));
}

function buildGroup(seller: Seller, lines: Line[], shopperCurrency: CurrencyOption): Group {
  const currency = seller === "farm" ? shopperCurrency : INR;
  const priced = lines.filter((l) => l.price != null);
  // Summed in whole paise/cents so 0.1 + 0.2 style float noise never shows up in the total.
  const total = Math.round(priced.reduce((sum, l) => sum + lineTotal(l.price!, l.quantity, currency), 0) * 100) / 100;
  return {
    seller,
    title: seller === "farm" ? "From the farm" : bakery.name,
    lines,
    currency,
    total,
    totalInr: priced.reduce((sum, l) => sum + l.price! * l.quantity, 0),
    hasUnpriced: priced.length < lines.length,
    sendAllLink:
      seller === "farm"
        ? buildWhatsAppLink(basketEnquiryMessage(lines.map(farmEnquiryLine), currency))
        : buildWhatsAppLink(bakeryBasketMessage(lines.map(bakeryEnquiryLine)), bakery.whatsapp),
  };
}

function paymentNote(group: Group): string {
  if (group.seller === "bakery") {
    return "Nothing is charged on the website. Nitara confirms the date, the delivery charge and the final amount on WhatsApp, and then you pay by UPI, bank transfer or cash.";
  }
  const code = group.currency.code;
  return code !== "INR"
    ? `Nothing is charged on the website. Your order goes to us in ${code}, we confirm stock, shipping and the exact ${code} total on WhatsApp, and you pay in ${code} by bank transfer.`
    : "Nothing is charged on the website. We confirm stock, the delivery charge and the final amount on WhatsApp, and then you pay by UPI, bank transfer or cash on delivery.";
}

const sendButton =
  "whitespace-normal rounded-full bg-[#25D366] text-center text-white hover:bg-[#1ebe5b] gap-2 shadow-[0_10px_25px_-10px_rgba(37,211,102,0.8)]";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, setQuantity, removeItem, totalItems } = useCart();
  const { currency } = useCurrency();
  const track = useAnalytics();

  const lines = items.map((item) => toLine(item.productId, item.quantity)).filter((l): l is Line => !!l);
  const groups = (["farm", "bakery"] as const)
    .map((seller) => ({ seller, lines: lines.filter((l) => l.seller === seller) }))
    .filter((g) => g.lines.length > 0)
    .map((g) => buildGroup(g.seller, g.lines, currency));

  const split = groups.length > 1;
  const only = split ? undefined : groups[0];
  const farmAbroad = currency.code !== "INR" && groups.some((g) => g.seller === "farm");

  function trackSend(group: Group) {
    track("whatsapp_enquiry_sent", {
      mode: "basket",
      seller: group.seller,
      items: group.lines.reduce((sum, l) => sum + l.quantity, 0),
      amount: group.totalInr,
    });
  }

  function description(): string {
    if (totalItems === 0) return "Nothing here yet.";
    const count = `${totalItems} item${totalItems > 1 ? "s" : ""}`;
    if (split) return `${count} from two kitchens. Each one confirms its order with you on WhatsApp.`;
    if (only?.seller === "bakery") return `${count}. Nitara confirms everything with you on WhatsApp.`;
    return `${count}${farmAbroad ? `, priced in ${currency.code}` : ""}. We confirm everything with you on WhatsApp.`;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full data-[side=right]:w-full data-[side=right]:sm:max-w-md gap-0 p-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b border-border sm:px-6">
          <SheetTitle className="font-heading font-semibold text-2xl flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            Your Basket
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">{description()}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {groups.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBasket className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground">Your basket is empty</p>
              <p className="text-sm text-muted-foreground max-w-[260px]">
                Pick what you like, then send it to us on WhatsApp, all together or one by one.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Link
                  href="/order"
                  onClick={() => setIsOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                  Browse Products
                </Link>
                <Link
                  href="/cakes"
                  onClick={() => setIsOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                  Cakes &amp; Bakes
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {groups.map((group) => (
                <section key={group.seller} aria-label={group.title}>
                  {(split || group.seller === "bakery") && (
                    <div className="mb-4">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {group.title}
                      </h3>
                      {group.seller === "bakery" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Baked to order in {bakery.location}. Priced in rupees and sent to the bakery&apos;s own
                          WhatsApp.
                        </p>
                      )}
                    </div>
                  )}
                  <ul className="space-y-5">
                    {group.lines.map((line) => {
                      const priced = line.price != null;
                      return (
                        <li key={line.id} className="flex gap-3 sm:gap-4">
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                            <Image src={line.image} alt={line.imageAlt} fill className="object-cover" sizes="80px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-snug line-clamp-2">{line.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {line.seller === "bakery"
                                ? [line.detail, formatInr(line.price!)].filter(Boolean).join(" · ")
                                : priced
                                  ? `${formatMoney(line.price!, group.currency)} ${line.detail ?? ""}`
                                  : "Price on request"}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <div className="flex items-center border border-border rounded-full">
                                <button
                                  aria-label={`Decrease quantity of ${line.name}`}
                                  className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                                <button
                                  aria-label={`Increase quantity of ${line.name}`}
                                  className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button
                                aria-label={`Remove ${line.name} from basket`}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                onClick={() => removeItem(line.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <a
                                href={singleLink(line, group.currency)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  track("whatsapp_enquiry_sent", { mode: "single", seller: line.seller, product: line.ref })
                                }
                                className="inline-flex items-center gap-1 rounded-full border border-forest/25 px-2.5 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-white transition-colors"
                              >
                                <WhatsAppLogo className="h-3.5 w-3.5" />
                                Ask separately
                              </a>
                            </div>
                          </div>
                          {priced && (
                            <div className="shrink-0 text-right">
                              <p className="font-semibold text-sm tabular-nums">
                                {formatAmount(lineTotal(line.price!, line.quantity, group.currency), group.currency)}
                              </p>
                              {group.currency.code !== "INR" && (
                                <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                                  ≈ {formatInr(line.price! * line.quantity)}
                                </p>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        {only && (
          <div className="border-t border-border px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 bg-surface sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 pt-1 text-muted-foreground text-sm">Estimated total</span>
              <div className="text-right">
                <p className="font-heading text-xl font-semibold tabular-nums">
                  {formatAmount(only.total, only.currency)}
                  {only.hasUnpriced && (
                    <span className="text-xs font-sans font-normal text-muted-foreground"> + items on request</span>
                  )}
                </p>
                {only.currency.code !== "INR" && only.totalInr > 0 && (
                  <p className="text-xs tabular-nums text-muted-foreground">≈ {formatInr(only.totalInr)}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{paymentNote(only)}</p>
            <a
              href={only.sendAllLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSend(only)}
              className={cn(buttonVariants(), sendButton, "h-auto w-full min-h-[52px] px-4 py-3 text-sm sm:text-base")}
            >
              <WhatsAppLogo className="h-5 w-5 shrink-0" />
              {only.lines.length > 1 ? (
                <>
                  <span className="sm:hidden">Enquire all on WhatsApp</span>
                  <span className="hidden sm:inline">Enquire all together on WhatsApp</span>
                </>
              ) : (
                "Enquire on WhatsApp"
              )}
            </a>
            {only.lines.length > 1 && (
              <p className="text-center text-[11px] text-muted-foreground">
                Prefer to ask one at a time? Tap &ldquo;Ask separately&rdquo; on any item.
              </p>
            )}
          </div>
        )}

        {split && (
          <div className="border-t border-border px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-3 bg-surface sm:px-6">
            <p className="text-xs text-muted-foreground">
              The farm and the bakery are separate kitchens, so your basket goes out as two WhatsApp messages. Nothing
              is charged on the website.
            </p>
            {groups.map((group) => (
              <div key={group.seller} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{group.seller === "farm" ? "Farm order" : "Bakery order"}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {formatAmount(group.total, group.currency)}
                    {group.hasUnpriced && " + items on request"}
                  </p>
                </div>
                <a
                  href={group.sendAllLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSend(group)}
                  className={cn(buttonVariants(), sendButton, "h-11 shrink-0 px-4 text-sm")}
                >
                  <WhatsAppLogo className="h-4 w-4 shrink-0" />
                  {group.seller === "farm" ? "Send to the farm" : "Send to Nitara"}
                </a>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
