import { products } from "@/data/products";
import { getBakeryItem } from "@/lib/bakery-basket";
import { bakery } from "@/lib/bakery-menu";
import { getCurrency } from "@/lib/currency";
import { bakeryBasketMessage, basketEnquiryMessage, buildWhatsAppLink, type BakeryLine, type EnquiryLine } from "@/lib/whatsapp";

export interface BasketEnquiryItem {
  productId: string;
  quantity: number;
}

export interface BasketDelivery {
  seller: "farm" | "bakery";
  /** Opens that kitchen's WhatsApp with the order written for them only. */
  url: string;
}

/**
 * Turns a mixed basket into one WhatsApp handoff per kitchen.
 * Numbers and wording stay here so the cart never builds a separate link per row.
 */
export function buildBasketDeliveries(items: BasketEnquiryItem[], currencyCode: string): BasketDelivery[] {
  const currency = getCurrency(currencyCode);
  const farmLines: EnquiryLine[] = [];
  const bakeryLines: BakeryLine[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product && product.available !== false && product.priceType !== "custom-form") {
      farmLines.push({
        name: product.name,
        quantity: item.quantity,
        unit: product.unit,
        price: product.priceType === "fixed" ? product.price : undefined,
      });
      continue;
    }
    const bake = getBakeryItem(item.productId);
    if (bake) {
      bakeryLines.push({
        name: bake.name,
        option: bake.option ?? bake.note,
        quantity: item.quantity,
        price: bake.price,
      });
    }
  }

  const deliveries: BasketDelivery[] = [];
  if (farmLines.length > 0) {
    deliveries.push({
      seller: "farm",
      url: buildWhatsAppLink(basketEnquiryMessage(farmLines, currency)),
    });
  }
  if (bakeryLines.length > 0) {
    deliveries.push({
      seller: "bakery",
      url: buildWhatsAppLink(bakeryBasketMessage(bakeryLines), bakery.whatsapp),
    });
  }
  return deliveries;
}
