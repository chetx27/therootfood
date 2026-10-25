"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { Product, ProductCategory } from "@/types/product";
import { buildWhatsAppLink, productEnquiryMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { blurPlaceholders } from "@/lib/blur-placeholders";
import { useCart } from "@/lib/cart-context";
import { useAnalytics } from "@/lib/analytics";
import { type CurrencyOption, formatMoney } from "@/lib/currency";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

export const categoryLabels: Record<ProductCategory, string> = {
  "flours-powders": "Flours & Powders",
  "roots-herbal": "Roots & Herbal",
  "eggs-dairy": "Eggs & Dairy",
  "meat-poultry": "Meat & Poultry",
  bakery: "Bakery",
  wellness: "Wellness",
};

interface ProductCardProps {
  product: Product;
  currency: CurrencyOption;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  const isAvailable = product.available !== false;
  const isCake = product.priceType === "custom-form";
  const isFixed = product.priceType === "fixed" && product.price != null;
  const { items, addItem, setQuantity } = useCart();
  const track = useAnalytics();
  const inBasket = items.find((i) => i.productId === product.id)?.quantity ?? 0;

  function handleAdd() {
    addItem(product.id);
    track("add_to_cart", { product: product.slug });
    toast.success(`${product.name} added to your basket`);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_2px_0_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-forest/20 hover:shadow-[0_30px_60px_-30px_rgba(45,92,66,0.45)]",
        !isAvailable && "opacity-60"
      )}
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#f4f1ea]">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder={blurPlaceholders[product.imageSrc] ? "blur" : "empty"}
          blurDataURL={blurPlaceholders[product.imageSrc]}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-forest shadow-sm backdrop-blur">
          {categoryLabels[product.category]}
        </span>
        {inBasket > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <Check className="h-3 w-3" strokeWidth={3} />
            {inBasket} in basket
          </span>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full border border-slate-300 bg-white px-4 py-1 text-sm font-semibold text-slate-600">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        {product.shortNote && <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{product.shortNote}</p>}

        <div className="mt-4 flex items-baseline gap-2">
          {isFixed ? (
            <>
              <span className="text-2xl font-bold tabular-nums text-slate-900">
                {formatMoney(product.price!, currency)}
              </span>
              {product.unit && <span className="text-sm text-slate-500">{product.unit}</span>}
            </>
          ) : (
            <span className="text-sm font-semibold text-amber-700">
              {isCake ? "Made to order · from your design" : "Price on request · varies by season"}
            </span>
          )}
        </div>
        {isFixed && currency.code !== "INR" && (
          <p className="mt-0.5 text-xs text-slate-400">≈ ₹{product.price} · final amount confirmed in INR</p>
        )}

        <div className="mt-auto pt-5">
          {!isAvailable ? (
            <button
              disabled
              className="h-12 w-full cursor-not-allowed rounded-full border border-slate-200 text-sm font-semibold text-slate-400"
            >
              Currently unavailable
            </button>
          ) : isCake ? (
            <Link
              href="/cakes"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
            >
              Design your cake
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {inBasket > 0 ? (
                <div className="flex h-12 flex-1 items-center justify-between rounded-full bg-forest/10 px-1.5">
                  <button
                    type="button"
                    aria-label={`Remove one ${product.name}`}
                    onClick={() => setQuantity(product.id, inBasket - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-sm transition hover:bg-forest hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold tabular-nums text-forest">{inBasket} in basket</span>
                  <button
                    type="button"
                    aria-label={`Add one more ${product.name}`}
                    onClick={() => setQuantity(product.id, inBasket + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-sm transition hover:bg-forest hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
                >
                  <ShoppingBasket className="h-[18px] w-[18px]" strokeWidth={2} />
                  Add to basket
                </button>
              )}
              <a
                href={buildWhatsAppLink(productEnquiryMessage(product.name))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ask about ${product.name} on WhatsApp`}
                title="Ask about just this on WhatsApp"
                onClick={() => track("product_whatsapp_click", { product: product.slug })}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.8)] transition hover:scale-105 hover:bg-[#1ebe5b]"
              >
                <WhatsAppLogo className="h-[22px] w-[22px]" />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
