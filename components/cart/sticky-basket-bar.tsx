"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { basketTotal, useCart } from "@/lib/cart-context";
import { formatAmount, formatInr } from "@/lib/currency";
import { useCurrency } from "@/lib/use-currency";
import { getBakeryItem } from "@/lib/bakery-basket";

/**
 * Floating “View basket” chip. Used on /order and /cakes so shoppers who add
 * several brownies or cakes can send them together without hunting for the nav icon.
 */
export function StickyBasketBar({ tone = "farm" }: { tone?: "farm" | "bakery" }) {
  const { items, totalItems, totalAmount, setIsOpen } = useCart();
  const { currency } = useCurrency();
  const bakeryOnly = items.length > 0 && items.every((i) => !!getBakeryItem(i.productId));
  const farmOnly = items.length > 0 && items.every((i) => !getBakeryItem(i.productId));
  const farmTotal = basketTotal(items, currency);

  const subtitle = (() => {
    if (bakeryOnly && totalAmount > 0) return `About ${formatInr(totalAmount)} so far · send to Nitara when ready`;
    if (farmOnly && farmTotal > 0) return `About ${formatAmount(farmTotal, currency)} so far`;
    if (farmOnly) return "Send it on WhatsApp when ready";
    if (items.length > 0) return "One tap sends farm and bakery on WhatsApp";
    return "Send it on WhatsApp when ready";
  })();

  const bakery = tone === "bakery";

  return (
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
            className={
              bakery
                ? "pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-full bg-[#3d1426] py-2 pl-2 pr-5 text-left text-white shadow-[0_20px_50px_-15px_rgba(61,20,38,0.55)] transition hover:bg-[#5a1f38]"
                : "pointer-events-auto flex w-full max-w-md items-center gap-4 rounded-full bg-slate-900 py-2 pl-2 pr-5 text-left text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] transition hover:bg-slate-800"
            }
          >
            <span
              className={
                bakery
                  ? "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#b0537a] text-white"
                  : "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              }
            >
              <ShoppingBasket className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-slate-900">
                {totalItems}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">View basket</span>
              <span className="block truncate text-xs text-white/60">{subtitle}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
