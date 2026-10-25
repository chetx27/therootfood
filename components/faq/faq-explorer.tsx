"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CakeSlice,
  ChevronDown,
  CreditCard,
  Leaf,
  Search,
  ShoppingBasket,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { faqCategories, faqs, type FaqCategory } from "@/lib/faqs";
import { cn } from "@/lib/utils";

const icons: Record<FaqCategory, LucideIcon> = {
  ordering: ShoppingBasket,
  delivery: Truck,
  payment: CreditCard,
  products: Leaf,
  cakes: CakeSlice,
  bulk: Building2,
};

export function FaqExplorer() {
  const [category, setCategory] = useState<FaqCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0].question);

  const q = query.trim().toLowerCase();
  const visible = faqs.filter(
    (f) =>
      (category === "all" || f.category === category) &&
      (!q || `${f.question} ${f.answer}`.toLowerCase().includes(q))
  );

  return (
    <div>
      <div className="relative mx-auto -mt-8 max-w-2xl px-4">
        <label className="relative block">
          <span className="sr-only">Search questions</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “delivery”, “eggless” or “UPI”"
            className="h-16 w-full rounded-full border border-slate-200 bg-white pl-14 pr-6 text-base shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-forest/10"
          />
        </label>
      </div>

      <div className="container mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 md:px-6">
        {faqCategories.map((c) => {
          const Icon = icons[c.id];
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? "all" : c.id)}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-forest bg-forest text-white shadow-lg"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-md"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  active ? "bg-white/15 text-white" : "bg-forest/10 text-forest"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className={cn("block text-xs", active ? "text-white/70" : "text-slate-500")}>{c.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="container mx-auto mt-10 max-w-3xl px-4 md:px-6">
        <p className="mb-4 text-sm text-slate-500">
          {visible.length} {visible.length === 1 ? "question" : "questions"}
          {category !== "all" && (
            <>
              {" "}in <span className="font-semibold text-slate-700">{faqCategories.find((c) => c.id === category)?.label}</span>
              {" · "}
              <button type="button" onClick={() => setCategory("all")} className="font-semibold text-forest hover:underline">
                show all
              </button>
            </>
          )}
        </p>

        <ul className="space-y-3">
          {visible.map((faq) => {
            const open = openId === faq.question;
            const Icon = icons[faq.category];
            return (
              <li
                key={faq.question}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white transition-colors",
                  open ? "border-forest/30 shadow-[0_20px_40px_-30px_rgba(45,92,66,0.6)]" : "border-slate-200"
                )}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : faq.question)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span
                    className={cn(
                      "hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex",
                      open ? "bg-forest text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-semibold text-slate-900 sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300", open && "rotate-180 text-forest")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <p className="px-5 pb-5 leading-relaxed text-slate-600 sm:pl-[4.75rem] sm:pr-8">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 py-14 text-center">
            <p className="font-heading text-xl font-semibold">No answers for &ldquo;{query}&rdquo; yet</p>
            <p className="mt-2 text-sm text-slate-500">Ask us directly — we&apos;ll reply on WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
