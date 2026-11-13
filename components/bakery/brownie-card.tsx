"use client";

import { useState } from "react";
import Image from "next/image";
import { type BrownieItem } from "@/lib/bakery-menu";
import { brownieItemId } from "@/lib/bakery-basket";
import { BakeryBasketControl } from "@/components/bakery/add-to-basket";
import { cn } from "@/lib/utils";

export function BrownieCard({ item }: { item: BrownieItem }) {
  const [selected, setSelected] = useState(0);
  const option = item.prices[selected];

  return (
    <article className="flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_40px_-30px_rgba(90,31,56,0.5)] ring-1 ring-[#f1d3df]">
      <div className="relative aspect-[3/2]">
        {/* Eager: slides waiting off to the side of the phone carousel are never lazy-loaded in time. */}
        <Image src={item.image} alt={item.name} fill quality={90} loading="eager" className="object-cover" sizes="(max-width: 640px) 82vw, (max-width: 1280px) 50vw, 25vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] font-heading text-xl font-semibold leading-7 tracking-tight text-[#3d1426]">{item.name}</h3>
        <p className="mb-4 mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-slate-500">{item.description}</p>

        <div className="mt-auto border-t border-[#f1d3df] pt-4">
          <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={`${item.name} size`}>
            {item.prices.map((p, i) => (
              <button
                key={p.size}
                type="button"
                role="radio"
                aria-checked={i === selected}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-xl px-1 py-1.5 text-center transition",
                  i === selected ? "bg-[#5a1f38] text-white" : "bg-[#fbe4ec]/70 text-[#5a1f38] hover:bg-[#fbe4ec]",
                )}
              >
                <span className="block text-xs font-semibold">{p.size}</span>
                <span className={cn("block text-[10px]", i === selected ? "text-white/70" : "text-[#5a1f38]/60")}>{p.pieces}</span>
              </button>
            ))}
          </div>

          <div className="mt-3">
            <BakeryBasketControl itemId={brownieItemId(item.name, option.size)} />
          </div>
        </div>
      </div>
    </article>
  );
}
