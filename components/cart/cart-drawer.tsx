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
  const track = useAnalytics();

  const entries = items
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((e): e is { item: typeof e.item; product: Product } => !!e.product);

  const hasUnpriced = entries.some((e) => e.product.priceType !== "fixed");
  const allTogetherLink = buildWhatsAppLink(
    basketEnquiryMessage(entries.map((e) => toLine(e.product, e.item.quantity)))
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
              : `${totalItems} item${totalItems > 1 ? "s" : ""} · we confirm everything with you on WhatsApp`}
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
                Pick what you like, then send it to us on WhatsApp — all together or one by one.
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
              {entries.map(({ item, product }) => (
                <li key={item.productId} className="flex gap-3 sm:gap-4">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-muted/40 shrink-0 border border-border/50">
                    <Image src={product.imageSrc} alt={product.imageAlt} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-snug line-clamp-2">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.priceType === "fixed" ? `₹${product.price} ${product.unit ?? ""}` : "Price on enquiry"}
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
                        href={buildWhatsAppLink(singleItemEnquiryMessage(toLine(product, item.quantity)))}
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
                  {product.priceType === "fixed" && (
                    <p className="font-semibold text-sm tabular-nums shrink-0">
                      ₹{(product.price ?? 0) * item.quantity}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {entries.length > 0 && (
          <div className="border-t border-border px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 bg-surface sm:px-6">
            <div className="flex items-baseline justify-between gap-3">
              <span className="shrink-0 text-muted-foreground text-sm">Estimated total</span>
              <span className="text-right font-heading text-xl font-semibold tabular-nums">
                ₹{totalAmount}
                {hasUnpriced && <span className="text-xs font-sans font-normal text-muted-foreground"> + enquiry items</span>}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              No online payment. We&apos;ll confirm stock, delivery charges, and the final amount on WhatsApp — then you
              can pay by UPI, bank transfer, or cash on delivery.
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
