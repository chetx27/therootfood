import { describe, expect, it } from "vitest";
import { cakeItemId } from "@/lib/bakery-basket";
import { buildBasketDeliveries } from "@/lib/basket-enquiry";

describe("buildBasketDeliveries", () => {
  it("writes a farm message and a bakery message to different numbers", () => {
    const deliveries = buildBasketDeliveries(
      [
        { productId: "ragi-flour", quantity: 1 },
        { productId: "vetiver-powder", quantity: 2 },
        { productId: cakeItemId("Rasagulla"), quantity: 1 },
        { productId: cakeItemId("Fresh fruit fantasy"), quantity: 1 },
      ],
      "INR"
    );

    expect(deliveries.map((d) => d.seller)).toEqual(["farm", "bakery"]);

    const farm = decodeURIComponent(deliveries[0].url);
    const bake = decodeURIComponent(deliveries[1].url);

    expect(deliveries[0].url).toContain("https://wa.me/917483877595?text=");
    expect(farm).toContain("Stone-Ground Gluten-Free Ragi Flour");
    expect(farm).toContain("Vetiver (Lavancha Roots) Powder");
    expect(farm).not.toContain("Rasagulla");

    expect(deliveries[1].url).toContain("https://wa.me/916379805442?text=");
    expect(bake).toContain("Rasagulla cake");
    expect(bake).toContain("Fresh fruit fantasy cake");
    expect(bake).not.toContain("Ragi Flour");
  });

  it("drops ids that are not on the menu", () => {
    expect(buildBasketDeliveries([{ productId: "not-a-product", quantity: 1 }], "INR")).toEqual([]);
  });
});
