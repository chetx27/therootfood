import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/sections/product-grid";
import { TrustStrip } from "@/components/sections/trust-strip";
import { OrderHero } from "@/components/order/order-hero";
import { BulkPromo } from "@/components/order/order-extras";

export const metadata = {
  title: "Order Farm Products | TheRootFood",
  description:
    "Pick farm-fresh flours, country eggs, meat, bakes, and goat milk soap — then send your order to us on WhatsApp.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <OrderHero />
        <ProductGrid />
        <BulkPromo />
        <div className="mt-14">
          <TrustStrip />
        </div>
      </div>
      <Footer />
    </div>
  );
}
