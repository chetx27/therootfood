import { describe, it, expect } from "vitest";
import {
  bakeryBasketItems,
  bakeryItemLabel,
  brownieItemId,
  cakeItemId,
  getBakeryItem,
  setItemId,
} from "@/lib/bakery-basket";
import { brownieBox, brownieTub, brownies, cakeMenu } from "@/lib/bakery-menu";
import { products } from "@/data/products";

describe("bakery basket catalog", () => {
  it("gives every menu line its own id", () => {
    const ids = bakeryBasketItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never reuses a farm product id", () => {
    const farmIds = new Set(products.map((p) => p.id));
    expect(bakeryBasketItems.some((i) => farmIds.has(i.id))).toBe(false);
  });

  it("covers every cake, every brownie size and every tub and box", () => {
    for (const cake of cakeMenu.flatMap((c) => c.items)) {
      expect(getBakeryItem(cakeItemId(cake.name))?.price).toBe(cake.price);
    }
    for (const brownie of brownies) {
      for (const p of brownie.prices) {
        expect(getBakeryItem(brownieItemId(brownie.name, p.size))?.price).toBe(p.price);
      }
    }
    for (const set of [brownieTub, brownieBox]) {
      for (const p of set.prices) {
        expect(getBakeryItem(setItemId(set.name, p.label))?.price).toBe(p.price);
      }
    }
  });

  it("uses the menu card photo for each cake in the basket", () => {
    for (const category of cakeMenu) {
      for (const cake of category.items) {
        const item = getBakeryItem(cakeItemId(cake.name));
        expect(item?.image).toBe(category.image);
        expect(item?.note).toBe(cake.note);
      }
    }
  });

  it("labels an item with its size", () => {
    const item = getBakeryItem(brownieItemId("Choco Chips Brownie", "500 g"))!;
    expect(bakeryItemLabel(item)).toBe("Choco Chips Brownie (500 g, 8 pcs)");
    expect(bakeryItemLabel(getBakeryItem(cakeItemId("Rasmalai"))!)).toBe("Rasmalai cake");
  });

  it("returns nothing for an unknown id", () => {
    expect(getBakeryItem("bakery:cake:does-not-exist")).toBeUndefined();
    expect(getBakeryItem("ragi-flour")).toBeUndefined();
  });
});
