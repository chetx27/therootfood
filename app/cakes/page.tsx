import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CakeEnquirySection } from "@/components/sections/cake-enquiry-section";
import { BakeryHero } from "@/components/bakery/bakery-hero";
import { BakeryMenu } from "@/components/bakery/bakery-menu";
import { HowToOrderBakes, InstagramWall, SignatureBakes } from "@/components/bakery/bakery-extras";
import { Occasions } from "@/components/bakery/occasions";

export const metadata = {
  title: "Nitara's Fine Bakes: Cakes & Brownies | TheRootFood",
  description:
    "Celebration cakes, exotic-flavour cakes, fudgy brownies, brownie boxes and custom bakes from Nitara's Fine Bakes, JP Nagar, Bangalore. Order on WhatsApp.",
  alternates: { canonical: "/cakes" },
};

export default function CakesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <BakeryHero />
        <SignatureBakes />
        <BakeryMenu />
        <Occasions />
        <HowToOrderBakes />
        <CakeEnquirySection />
        <InstagramWall />
      </div>
      <Footer />
    </div>
  );
}
