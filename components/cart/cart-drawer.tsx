"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart, getProduct } from "@/lib/cart-context";
import { useAnalytics } from "@/lib/analytics";
import { formatAmount, formatInr, formatMoney, INR, lineTotal, type CurrencyOption } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { bakery } from "@/lib/bakery-menu";
import { getBakeryItem } from "@/lib/bakery-basket";
import { bakeryBasketMessage, basketEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const PENDING_WHATSAPP_KEY = "therootfood-basket-whatsapp";

function queueRemainingWhatsApp(urls: string[]) {
  sessionStorage.setItem(PENDING_WHATSAPP_KEY, JSON.stringify({ urls, startedAt: Date.now() }));
}

function consumeNextWhatsApp(): string | null {
  try {
    const raw = sessionStorage.getItem(PENDING_WHATSAPP_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { urls?: unknown; startedAt?: unknown };
    const fresh = typeof data.startedAt === "number" && Date.now() - data.startedAt < 5 * 60 * 1000;
    const urls = Array.isArray(data.urls) ? data.urls.filter((url): url is string => typeof url === "string" && url.length > 0) : [];
    if (!fresh || urls.length === 0) {
      sessionStorage.removeItem(PENDING_WHATSAPP_KEY);
      return null;
    }
    const [next, ...rest] = urls;
    if (rest.length === 0) sessionStorage.removeItem(PENDING_WHATSAPP_KEY);
    else sessionStorage.setItem(PENDING_WHATSAPP_KEY, JSON.stringify({ urls: rest, startedAt: data.startedAt }));
    return next;
  } catch {
    return null;
  }
}

type Seller = "farm" | "bakery";

/** One basket row, whichever kitchen it comes from. */
interface Line {
  id: string;
  seller: Seller;
  name: string;
  /** Farm: pack size ("per kg"). Brownie: size or box ("500 g, 8 pcs"). */
  detail?: string;
  /** Cakes: what it is and the main ingredient. No photo. */
  note?: string;
  /** Rupees. Missing for farm items that are priced on request. */
  price?: number;
  quantity: number;
  image?: string;
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

function subscribePhone(cb: () => void) {
  const mq = window.matchMedia("(max-width: 639px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useIsPhone() {
  return useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false
  );
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
      note: bake.note,
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
  return { name: line.name, option: line.detail ?? line.note, quantity: line.quantity, price: line.price ?? 0 };
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
  const isPhone = useIsPhone();
  const [sending, setSending] = useState(false);
  const skipReturn = useRef(false);

  const lines = items.map((item) => toLine(item.productId, item.quantity)).filter((l): l is Line => !!l);
  const groups = (["farm", "bakery"] as const)
    .map((seller) => ({ seller, lines: lines.filter((l) => l.seller === seller) }))
    .filter((g) => g.lines.length > 0)
    .map((g) => buildGroup(g.seller, g.lines, currency));

  const split = groups.length > 1;
  const only = split ? undefined : groups[0];
  const farmAbroad = currency.code !== "INR" && groups.some((g) => g.seller === "farm");

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  // After the first kitchen's chat, open the next one without another basket button.
  useEffect(() => {
    let hiddenAt = 0;
    function resume() {
      if (skipReturn.current) return;
      const url = consumeNextWhatsApp();
      if (url) window.location.assign(url);
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        skipReturn.current = false;
        return;
      }
      // Ignore the brief hide when the phone shows the app chooser.
      if (hiddenAt === 0 || Date.now() - hiddenAt < 1500) return;
      hiddenAt = 0;
      resume();
    }
    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted || skipReturn.current) return;
      resume();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    resume();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  function trackSend(group: Group) {
    track("whatsapp_enquiry_sent", {
      mode: "basket",
      seller: group.seller,
      items: group.lines.reduce((sum, l) => sum + l.quantity, 0),
      amount: group.totalInr,
    });
  }

  async function sendBothKitchens() {
    setSending(true);
    groups.forEach(trackSend);
    try {
      const res = await fetch("/api/basket-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: currency.code,
          items: lines.map((line) => ({ productId: line.id, quantity: line.quantity })),
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        deliveries?: { seller: Seller; url: string }[];
      };
      if (!res.ok || !data.deliveries?.length) {
        throw new Error(data.error || "Could not start the WhatsApp chats.");
      }
      const [first, ...rest] = data.deliveries;
      if (rest.length > 0) {
        queueRemainingWhatsApp(rest.map((delivery) => delivery.url));
        skipReturn.current = true;
      }
      window.location.assign(first.url);
    } catch (error) {
      setSending(false);
      toast.error(error instanceof Error ? error.message : "Could not start the WhatsApp chats.");
    }
  }

  function description(): string {
    if (totalItems === 0) return "Nothing here yet.";
    const count = `${totalItems} item${totalItems > 1 ? "s" : ""}`;
    if (split) return `${count} from two kitchens. One tap sends each kitchen its own order.`;
    if (only?.seller === "bakery") return `${count}. Nitara confirms everything with you on WhatsApp.`;
    return `${count}${farmAbroad ? `, priced in ${currency.code}` : ""}. We confirm everything with you on WhatsApp.`;
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side={isPhone ? "bottom" : "right"}
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          isPhone
            ? "inset-x-0 bottom-0 h-[min(92dvh,100%)] max-h-[92dvh] w-full max-w-none rounded-t-3xl border-x-0 border-b-0 data-[side=bottom]:h-[min(92dvh,100%)]"
            : "h-dvh max-h-dvh w-full data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        )}
      >
        <SheetHeader className="shrink-0 border-b border-border px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
          {isPhone && (
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden />
          )}
          <SheetTitle className="flex items-center gap-2 font-heading text-xl font-semibold sm:text-2xl">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            Your Basket
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">{description()}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-4">
          {groups.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center sm:py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBasket className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground">Your basket is empty</p>
              <p className="max-w-[260px] text-sm text-muted-foreground">
                Pick what you like, then send it to us on WhatsApp, all together or one by one.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Link
                  href="/order"
                  onClick={() => handleOpenChange(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                  Browse Products
                </Link>
                <Link
                  href="/cakes"
                  onClick={() => handleOpenChange(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                  Cakes &amp; Bakes
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-7">
              {groups.map((group) => (
                <section key={group.seller} aria-label={group.title}>
                  {(split || group.seller === "bakery") && (
                    <div className="mb-3 sm:mb-4">
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
                  <ul className="space-y-4 sm:space-y-5">
                    {group.lines.map((line) => {
                      const priced = line.price != null;
                      return (
                        <li key={line.id} className="flex gap-3">
                          {line.seller === "farm" && line.image && (
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/40 sm:h-20 sm:w-20">
                              <Image src={line.image} alt={line.imageAlt} fill className="object-cover" sizes="80px" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium leading-snug">{line.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {line.note
                                ? line.note
                                : line.seller === "bakery"
                                  ? [line.detail, formatInr(line.price!)].filter(Boolean).join(" · ")
                                  : priced
                                    ? `${formatMoney(line.price!, group.currency)} ${line.detail ?? ""}`
                                    : "Price on request"}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                              <div className="flex items-center rounded-full border border-border">
                                <button
                                  aria-label={`Decrease quantity of ${line.name}`}
                                  className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                                <button
                                  aria-label={`Increase quantity of ${line.name}`}
                                  className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button
                                aria-label={`Remove ${line.name} from basket`}
                                className="text-muted-foreground transition-colors hover:text-destructive"
                                onClick={() => removeItem(line.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {priced && (
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold tabular-nums">
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
          <div className="shrink-0 space-y-3 border-t border-border bg-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:space-y-4 sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 pt-1 text-sm text-muted-foreground">Estimated total</span>
              <div className="text-right">
                <p className="font-heading text-lg font-semibold tabular-nums sm:text-xl">
                  {formatAmount(only.total, only.currency)}
                  {only.hasUnpriced && (
                    <span className="font-sans text-xs font-normal text-muted-foreground"> + items on request</span>
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
              className={cn(buttonVariants(), sendButton, "h-auto min-h-[48px] w-full px-4 py-3 text-sm sm:min-h-[52px] sm:text-base")}
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
          </div>
        )}

        {split && (
          <div className="shrink-0 space-y-3 border-t border-border bg-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="space-y-1.5">
              {groups.map((group) => (
                <div key={group.seller} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">
                    {group.seller === "farm" ? "Farm" : "Bakery"} · {group.lines.reduce((n, l) => n + l.quantity, 0)} item
                    {group.lines.reduce((n, l) => n + l.quantity, 0) === 1 ? "" : "s"}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatAmount(group.total, group.currency)}
                    {group.hasUnpriced && <span className="font-normal text-muted-foreground"> +</span>}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              One tap. The farm gets the farm order and Nitara gets the bakery order. Nothing is charged on the website.
            </p>
            <button
              type="button"
              onClick={sendBothKitchens}
              disabled={sending}
              className={cn(buttonVariants(), sendButton, "h-auto min-h-[48px] w-full px-4 py-3 text-sm disabled:opacity-70 sm:min-h-[52px] sm:text-base")}
            >
              <WhatsAppLogo className="h-5 w-5 shrink-0" />
              {sending ? "Opening WhatsApp…" : "Send both orders"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              WhatsApp opens the farm chat first. Nitara&apos;s chat opens on its own when you come back.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
