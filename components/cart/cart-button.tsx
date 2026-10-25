"use client";

import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const { totalItems, setIsOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Open basket, ${totalItems} items`}
      className={cn("relative min-h-[44px] min-w-[44px]", className)}
      onClick={() => setIsOpen(true)}
    >
      <ShoppingBasket className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Button>
  );
}
