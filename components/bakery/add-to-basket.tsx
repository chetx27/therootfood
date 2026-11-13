"use client";

import { toast } from "sonner";
import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { bakery } from "@/lib/bakery-menu";
import { bakeryItemLabel, getBakeryItem, type BakeryBasketItem } from "@/lib/bakery-basket";
import { bakeryItemMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart-context";
import { useAnalytics } from "@/lib/analytics";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { cn } from "@/lib/utils";

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

function useBakeryBasketItem(item: BakeryBasketItem) {
  const { items, addItem, setQuantity, setIsOpen } = useCart();
  const track = useAnalytics();
  const quantity = items.find((i) => i.productId === item.id)?.quantity ?? 0;

  return {
    quantity,
    add() {
      addItem(item.id);
      track("add_to_cart", { product: item.id });
      toast.success(`${bakeryItemLabel(item)} added to your basket`, {
        action: { label: "View basket", onClick: () => setIsOpen(true) },
      });
    },
    setQuantity: (next: number) => setQuantity(item.id, next),
  };
}

const stepButton =
  "flex shrink-0 items-center justify-center rounded-full bg-white text-[#5a1f38] shadow-sm transition hover:bg-[#5a1f38] hover:text-white";

/**
 * "Add to basket" for a brownie, tub or box, with a small WhatsApp button beside it
 * for shoppers who only want to ask about this one thing.
 */
export function BakeryBasketControl({ itemId, size = "sm" }: { itemId: string; size?: "sm" | "md" }) {
  const item = getBakeryItem(itemId);
  if (!item) return null;
  return <Control item={item} size={size} />;
}

function Control({ item, size }: { item: BakeryBasketItem; size: "sm" | "md" }) {
  const { quantity, add, setQuantity } = useBakeryBasketItem(item);
  const label = bakeryItemLabel(item);
  const md = size === "md";
  const height = md ? "h-12" : "h-10";

  return (
    <div className="flex items-center gap-2">
      {quantity > 0 ? (
        <div className={cn("flex min-w-0 flex-1 items-center justify-between rounded-full bg-[#fbe4ec] px-1", height)}>
          <button
            type="button"
            aria-label={`Remove one ${label}`}
            onClick={() => setQuantity(quantity - 1)}
            className={cn(stepButton, md ? "h-10 w-10" : "h-8 w-8")}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="truncate px-1 text-[13px] font-semibold tabular-nums text-[#5a1f38]">
            <span className="sr-only">{label}: </span>
            {quantity} in basket
            <span className={cn("font-normal text-[#5a1f38]/60", !md && "hidden min-[400px]:inline xl:hidden")}>
              {" "}
              · {rupees(item.price)}
            </span>
          </span>
          <button
            type="button"
            aria-label={`Add one more ${label}`}
            onClick={() => setQuantity(quantity + 1)}
            className={cn(stepButton, md ? "h-10 w-10" : "h-8 w-8")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={add}
          aria-label={`Add ${label} to basket, ${rupees(item.price)}`}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between gap-1 whitespace-nowrap rounded-full bg-[#5a1f38] pr-1.5 font-semibold text-white transition hover:bg-[#3d1426]",
            height,
            md ? "pl-5 text-sm" : "pl-3.5 text-[13px]"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {md && <ShoppingBasket className="h-4 w-4" />}
            Add to basket
          </span>
          <span className={cn("rounded-full bg-white/15 tabular-nums", md ? "px-3.5 py-1.5" : "px-2.5 py-1")}>
            {rupees(item.price)}
          </span>
        </button>
      )}
      <a
        href={buildWhatsAppLink(bakeryItemMessage(item.name, item.option), bakery.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order just ${label} on WhatsApp`}
        title="Order just this on WhatsApp"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe5b]",
          md ? "h-12 w-12" : "h-10 w-10"
        )}
      >
        <WhatsAppLogo className={md ? "h-5 w-5" : "h-[18px] w-[18px]"} />
      </a>
    </div>
  );
}

/** Compact add button for one line of the cake menu. */
export function CakeRowBasketControl({ itemId }: { itemId: string }) {
  const item = getBakeryItem(itemId);
  if (!item) return null;
  return <CakeRowControl item={item} />;
}

function CakeRowControl({ item }: { item: BakeryBasketItem }) {
  const { quantity, add, setQuantity } = useBakeryBasketItem(item);

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={add}
        aria-label={`Add ${item.name} to basket`}
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#5a1f38] pl-2.5 pr-3 text-xs font-semibold text-white transition hover:bg-[#3d1426]"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        Add
      </button>
    );
  }

  return (
    <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#fbe4ec]">
      <button
        type="button"
        aria-label={`Remove one ${item.name}`}
        onClick={() => setQuantity(quantity - 1)}
        className={cn(stepButton, "h-8 w-8 shadow-none ring-1 ring-[#f1d3df]")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span aria-live="polite" className="w-6 text-center text-xs font-semibold tabular-nums text-[#5a1f38]">
        {quantity}
        <span className="sr-only"> {item.name} in basket</span>
      </span>
      <button
        type="button"
        aria-label={`Add one more ${item.name}`}
        onClick={() => setQuantity(quantity + 1)}
        className={cn(stepButton, "h-8 w-8 shadow-none ring-1 ring-[#f1d3df]")}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
