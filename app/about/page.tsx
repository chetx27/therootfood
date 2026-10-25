import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "About Us | TheRootFood",
  description: "Learn about TheRootFood's mission to bring authentic, farm-direct produce to your kitchen.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-20 md:py-24 max-w-5xl">
        <FadeIn>
          <div className="mb-12 flex flex-col items-center text-center gap-6">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56">
              <Image
                src="/rootfood-logo-full.webp"
                alt="TheRootFood — Direct from farm | Bakehouse"
                fill
                className="object-contain"
                sizes="224px"
                priority
              />
            </div>
            <SectionHeading
              title="Our Story"
              description="From our farm to your family's table."
              className="mb-0"
            />
          </div>
        </FadeIn>

        <div className="prose prose-invert prose-lg max-w-none">
          <FadeIn delay={0.1}>
            <p>
              TheRootFood was born out of a simple belief: everyone deserves access to pure, unadulterated,
              and nutrient-rich food. We are a farm-direct business bridging the gap between traditional
              farming practices and modern households.
            </p>
            <p>
              We specialize in stone-ground flours, herbal roots, free-range country eggs, fresh goat meat,
              and artisanal baked goods. By bypassing middlemen, we ensure that farmers get a fair price and
              you get the freshest produce possible.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-heading font-semibold tracking-tight mt-12 mb-6">Our Promise</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">100% Authentic</h3>
                <p className="text-base text-muted-foreground m-0">
                  No artificial preservatives, colors, or hidden additives. Just pure food.
                </p>
              </div>
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">Farm Direct</h3>
                <p className="text-base text-muted-foreground m-0">
                  Sourced directly from our farms and trusted local partners.
                </p>
              </div>
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">Sustainable</h3>
                <p className="text-base text-muted-foreground m-0">
                  We prioritize environmentally friendly farming and packaging practices.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
}
