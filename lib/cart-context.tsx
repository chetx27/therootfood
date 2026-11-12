"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Product } from "@/types/product";
import { products } from "@/data/products";
import { lineTotal, type CurrencyOption } from "@/lib/currency";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "therootfood-cart";

export function getProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

/** Custom cakes have their own enquiry page, so they never go in the basket. */
export function isBasketable(product: Product | undefined): product is Product {
  return !!product && product.available !== false && product.priceType !== "custom-form";
}

/** Sum of the fixed-price items, in the currency the shopper is browsing in. */
export function basketTotal(items: CartItem[], currency: CurrencyOption): number {
  const sum = items.reduce((total, item) => {
    const product = getProduct(item.productId);
    if (product?.priceType !== "fixed" || product.price == null) return total;
    return total + lineTotal(product.price, item.quantity, currency);
  }, 0);
  return Math.round(sum * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount — must happen in an effect (not a
    // lazy initializer) so the server and first client render match.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(parsed.filter((i) => isBasketable(getProduct(i.productId))));
      }
    } catch {
      // Corrupt storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce((sum, i) => {
      const product = getProduct(i.productId);
      return sum + (product?.price ?? 0) * i.quantity;
    }, 0);

    return {
      items,
      totalItems,
      totalAmount,
      isOpen,
      setIsOpen,
      addItem: (productId, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, quantity: Math.min(20, i.quantity + quantity) } : i
            );
          }
          return [...prev, { productId, quantity }];
        });
      },
      removeItem: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((i) => i.productId !== productId));
        } else {
          setItems((prev) =>
            prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(20, quantity) } : i))
          );
        }
      },
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
