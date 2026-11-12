"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ShoppingBasket, X } from "lucide-react";
import { products } from "@/data/products";
import { ProductCategory } from "@/types/product";
import { ProductCard, categoryLabels } from "./product-card";
import { CURRENCIES, formatAmount, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { basketTotal, useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const categoryOrder = Object.keys(categoryLabels) as ProductCategory[];

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const { currency, setCurrencyCode } = useCurrency();
  const { items, totalItems, setIsOpen } = useCart();
  const total = basketTotal(items, currency);

  const counts = useMemo(() => {
    const map = new Map<ProductCategory, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${p.name} ${p.shortNote ?? ""} ${categoryLabels[p.category]}`.toLowerCase().includes(q);
  });

  const chips: { value: ProductCategory | "all"; label: string; count: number }[] = [
    { value: "all", label: "Everything", count: products.length },
    ...categoryOrder
      .map((c) => ({ value: c, label: categoryLabels[c], count: counts.get(c) ?? 0 }))
      .filter((chip) => chip.count > 0),
  ];

  return (
    <section id="products" className="scroll-mt-20 bg-white py-14 text-slate-900 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-forest">The farm shop</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              What would you like this week?
            </h2>
            <p className="mt-3 text-slate-500">
              {currency.code === "INR"
                ? "Prices are for the pack size shown. We tell you the delivery charge on WhatsApp before you pay."
                : `Prices are converted to ${currency.code} at an approximate rate. Your basket and order stay in ${currency.code}, and we confirm the exact total on WhatsApp before you pay.`}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative flex-1 lg:w-72">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ragi, eggs, soap…"
                className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm outline-none transition focus:border-forest/40 focus:bg-white focus:ring-4 focus:ring-forest/10"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <label className="relative">
              <span className="sr-only">Show prices in</span>
              <select
                value={currency.code}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="h-12 w-full appearance-none rounded-full border border-slate-200 bg-slate-50 pl-5 pr-10 text-sm font-semibold outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-forest/10 sm:w-auto"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▾
              </span>
            </label>
          </div>
        </div>

        <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mb-10 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {chips.map((chip) => {
              const active = activeCategory === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setActiveCategory(chip.value)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                    active
                      ? "border-forest bg-forest text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-forest/30 hover:text-slate-900"
                  )}
                >
                  {chip.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="min-w-0"
              >
                <ProductCard product={product} currency={currency} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 py-16 text-center">
            <p className="font-heading text-xl font-semibold">
              {query.trim() ? <>Nothing matches &ldquo;{query.trim()}&rdquo;</> : "Nothing here right now"}
            </p>
            <p className="mt-2 px-4 text-sm text-slate-500">
              Try another word or category, or ask us on WhatsApp. We may still have it.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center pl-4 pr-20 sm:bottom-6 sm:px-24"
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-full bg-slate-900 py-2 pl-2 pr-5 text-left text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition hover:bg-slate-800"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ShoppingBasket className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-slate-900">
                  {totalItems}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">View basket</span>
                <span className="block text-xs text-white/60">
                  {total > 0 ? `About ${formatAmount(total, currency)} so far` : "Send it on WhatsApp when ready"}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
