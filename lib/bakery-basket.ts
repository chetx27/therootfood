import { brownieBox, brownieTub, brownies, cakeMenu } from "@/lib/bakery-menu";

/** A bakery menu line that can go in the basket: one cake, or one brownie in one size. */
export interface BakeryBasketItem {
  id: string;
  name: string;
  /** Size or pack, e.g. "500 g, 8 pcs". Cakes have none. */
  option?: string;
  /** Rupees. The bakery only quotes in INR. */
  price: number;
  image: string;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Basket ids start with this so they can never clash with a farm product id. */
const PREFIX = "bakery:";

export const cakeItemId = (name: string) => `${PREFIX}cake:${slug(name)}`;
export const brownieItemId = (name: string, size: string) => `${PREFIX}brownie:${slug(name)}:${slug(size)}`;
export const setItemId = (name: string, label: string) => `${PREFIX}set:${slug(name)}:${slug(label)}`;

export const bakeryBasketItems: BakeryBasketItem[] = [
  ...cakeMenu.flatMap((category) =>
    category.items.map((cake) => ({
      id: cakeItemId(cake.name),
      name: `${cake.name} cake`,
      price: cake.price,
      image: category.image,
    }))
  ),
  ...brownies.flatMap((brownie) =>
    brownie.prices.map((p) => ({
      id: brownieItemId(brownie.name, p.size),
      name: brownie.name,
      option: `${p.size}, ${p.pieces}`,
      price: p.price,
      image: brownie.image,
    }))
  ),
  ...[brownieTub, brownieBox].flatMap((set) =>
    set.prices.map((p) => ({
      id: setItemId(set.name, p.label),
      name: set.name,
      option: p.label,
      price: p.price,
      image: set.image,
    }))
  ),
];

const byId = new Map(bakeryBasketItems.map((item) => [item.id, item]));

export function getBakeryItem(id: string): BakeryBasketItem | undefined {
  return byId.get(id);
}

/** "Choco Chips Brownie (500 g, 8 pcs)" */
export function bakeryItemLabel(item: Pick<BakeryBasketItem, "name" | "option">): string {
  return item.option ? `${item.name} (${item.option})` : item.name;
}
