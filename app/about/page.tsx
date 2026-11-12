import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "About Us | TheRootFood",
  description: "Who we are, what we grow and why we sell it straight to your kitchen.",
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
                alt="TheRootFood logo: direct from farm, bakehouse"
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

        <div className="text-base leading-relaxed sm:text-lg">
          <FadeIn delay={0.1}>
            <p className="mb-5">
              TheRootFood began with a simple belief: everyone should be able to buy pure, unadulterated
              food. We are based in Bangalore and sell what we grow straight to the people who cook with
              it.
            </p>
            <p>
              That means stone-ground flours, herbal roots, free-range country eggs, fresh goat meat and
              cakes from our bakery, Nitara&apos;s Fine Bakes. There are no middlemen, so the farmers get a
              fair price and the food reaches you fresh.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-heading font-semibold tracking-tight mt-12 mb-6">Our Promise</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">Nothing added</h3>
                <p className="text-base text-muted-foreground m-0">
                  No artificial preservatives, colours or hidden additives.
                </p>
              </div>
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">Farm Direct</h3>
                <p className="text-base text-muted-foreground m-0">
                  From our own farm and local partner farms we know personally.
                </p>
              </div>
              <div className="surface-scope bg-surface text-surface-foreground p-6 rounded-2xl">
                <h3 className="font-bold mb-2 mt-0 text-surface-foreground">Sustainable</h3>
                <p className="text-base text-muted-foreground m-0">
                  We farm and pack in ways that are easy on the land.
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
