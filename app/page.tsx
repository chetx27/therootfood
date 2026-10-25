import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ProductSliderSection } from "@/components/sections/product-slider-section";
import { BakeryTeaser } from "@/components/sections/bakery-teaser";
import { SignatureBakes } from "@/components/bakery/bakery-extras";
import { TrustStrip } from "@/components/sections/trust-strip";
import { StorySection } from "@/components/sections/story-section";
import { FarmDifferenceSection } from "@/components/sections/farm-difference-section";
import { BulkEnquirySection } from "@/components/sections/bulk-enquiry-section";
import { SectionDivider } from "@/components/shared/section-divider";
import { ContactSection } from "@/components/sections/contact-section";
import Script from "next/script";
import { products } from "@/data/products";
import { businessInfo } from "@/lib/business-info";

const productJsonLd = products.map((product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: `${businessInfo.url}${product.imageSrc}`,
  description: product.shortNote || `High-quality ${product.name} from TheRootFood`,
  offers: product.price ? {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  } : undefined,
}));
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <Hero />
        <BakeryTeaser />
        <SignatureBakes withMenuLink />
        <ProductSliderSection />
        <TrustStrip />
        <StorySection />
        <FarmDifferenceSection />
        <BulkEnquirySection />
        <SectionDivider />
        <ContactSection />
      </div>

      <Footer />

      <Script
        id="products-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
    </div>
  );
}
