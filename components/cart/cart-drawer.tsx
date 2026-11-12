"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { basketTotal, useCart, getProduct } from "@/lib/cart-context";
import { useAnalytics } from "@/lib/analytics";
import { formatAmount, formatInr, formatMoney, lineTotal } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import {
  basketEnquiryMessage,
  buildWhatsAppLink,
  singleItemEnquiryMessage,
  type EnquiryLine,
} from "@/lib/whatsapp";
import type { Product } from "@/types/product";

function toLine(product: Product, quantity: number): EnquiryLine {
  return {
    name: product.name,
    quantity,
    unit: product.unit,
    price: product.priceType === "fixed" ? product.price : undefined,
  };
}

export function CartDrawer() {
  const { items, isOpen, setIsOpen, setQuantity, removeItem, totalAmount, totalItems } = useCart();
  const { currency } = useCurrency();
  const track = useAnalytics();

  const entries = items
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((e): e is { item: typeof e.item; product: Product } => !!e.product);

  const abroad = currency.code !== "INR";
  const total = basketTotal(items, currency);
  const hasUnpriced = entries.some((e) => e.product.priceType !== "fixed");
  const allTogetherLink = buildWhatsAppLink(
    basketEnquiryMessage(
      entries.map((e) => toLine(e.product, e.item.quantity)),
      currency
    )
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full data-[side=right]:w-full data-[side=right]:sm:max-w-md gap-0 p-0 flex flex-col">
        <SheetHeader className="px-4 pt-6 pb-4 border-b border-border sm:px-6">
          <SheetTitle className="font-heading font-semibold text-2xl flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-primary" />
            Your Basket
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            {totalItems === 0
              ? "Nothing here yet."
              : `${totalItems} item${totalItems > 1 ? "s" : ""}${abroad ? `, priced in ${currency.code}` : ""}. We confirm everything with you on WhatsApp.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBasket className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground">Your basket is empty</p>
              <p className="text-sm text-muted-foreground max-w-[260px]">
                Pick what you like, then send it to us on WhatsApp, all together or one by one.
              </p>
              <Link
                href="/order"
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "mt-2 rounded-full")}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {entries.map(({ item, product }) => {
                const isFixed = product.priceType === "fixed" && product.price != null;
                return (
                  <li key={item.productId} className="flex gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                      <Image src={product.imageSrc} alt={product.imageAlt} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug line-clamp-2">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isFixed ? `${formatMoney(product.price!, currency)} ${product.unit ?? ""}` : "Price on request"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center border border-border rounded-full">
                          <button
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                          <button
                            aria-label={`Increase quantity of ${product.name}`}
                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          aria-label={`Remove ${product.name} from basket`}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <a
                          href={buildWhatsAppLink(singleItemEnquiryMessage(toLine(product, item.quantity), currency))}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("whatsapp_enquiry_sent", { mode: "single", product: product.slug })}
                          className="inline-flex items-center gap-1 rounded-full border border-forest/25 px-2.5 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-white transition-colors"
                        >
                          <WhatsAppLogo className="h-3.5 w-3.5" />
                          Ask separately
                        </a>
                      </div>
                    </div>
                    {isFixed && (
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-sm tabular-nums">
                          {formatAmount(lineTotal(product.price!, item.quantity, currency), currency)}
                        </p>
                        {abroad && (
                          <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                            ≈ {formatInr(product.price! * item.quantity)}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {entries.length > 0 && (
          <div className="border-t border-border px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 bg-surface sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 pt-1 text-muted-foreground text-sm">Estimated total</span>
              <div className="text-right">
                <p className="font-heading text-xl font-semibold tabular-nums">
                  {formatAmount(total, currency)}
                  {hasUnpriced && (
                    <span className="text-xs font-sans font-normal text-muted-foreground"> + items on request</span>
                  )}
                </p>
                {abroad && totalAmount > 0 && (
                  <p className="text-xs tabular-nums text-muted-foreground">≈ {formatInr(totalAmount)}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {abroad
                ? `Nothing is charged on the website. Your order goes to us in ${currency.code}, we confirm stock, shipping and the exact ${currency.code} total on WhatsApp, and you pay in ${currency.code} by bank transfer.`
                : "Nothing is charged on the website. We confirm stock, the delivery charge and the final amount on WhatsApp, and then you pay by UPI, bank transfer or cash on delivery."}
            </p>
            <a
              href={allTogetherLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_enquiry_sent", { mode: "basket", items: totalItems, amount: totalAmount })}
              className={cn(
                buttonVariants(),
                "h-auto w-full min-h-[52px] whitespace-normal px-4 py-3 text-center rounded-full text-sm sm:text-base bg-[#25D366] text-white hover:bg-[#1ebe5b] gap-2 shadow-[0_10px_25px_-10px_rgba(37,211,102,0.8)]"
              )}
            >
              <WhatsAppLogo className="h-5 w-5 shrink-0" />
              {entries.length > 1 ? (
                <>
                  <span className="sm:hidden">Enquire all on WhatsApp</span>
                  <span className="hidden sm:inline">Enquire all together on WhatsApp</span>
                </>
              ) : (
                "Enquire on WhatsApp"
              )}
            </a>
            {entries.length > 1 && (
              <p className="text-center text-[11px] text-muted-foreground">
                Prefer to ask one at a time? Tap &ldquo;Ask separately&rdquo; on any item.
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
