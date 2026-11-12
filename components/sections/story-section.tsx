import { FadeIn } from "@/components/shared/fade-in";

const STEPS = [
  {
    number: "01",
    title: "Grown and raised on our farm",
    description:
      "Our hens roam free, our vetiver grows wild and our grains are farmed the slow way. What we can't grow ourselves comes from partner farms we know personally.",
  },
  {
    number: "02",
    title: "Prepared in small batches",
    description:
      "Flour is stone-ground a little at a time, cakes are baked for your date and soap is made by hand. Nothing sits in a warehouse.",
  },
  {
    number: "03",
    title: "Order on WhatsApp, from anywhere",
    description:
      "Fill your basket and send it to us. We confirm it with you, and you pay by UPI, transfer or cash. Fresh produce reaches you anywhere in Bangalore within 24 hours. Flours, roots and soaps ship across India and abroad.",
  },
  {
    number: "04",
    title: "A real person behind every order",
    description:
      "No call centres. The people who grow your food answer your questions, pack your order and follow up with you on WhatsApp or email.",
  },
];

export function StorySection() {
  return (
    <section
      id="story"
      className="relative scroll-mt-20 overflow-hidden bg-forest py-20 sm:py-28 md:py-36"
    >
      {/* Soft light so glass cards can catch it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,180,200,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.08),_transparent_45%)]"
      />

      <div className="container relative mx-auto px-4 md:px-6">
        <FadeIn className="mx-auto max-w-3xl text-center mb-14 sm:mb-20 md:mb-24">
          <p className="text-sm font-semibold text-white/65 uppercase tracking-[0.28em] mb-5 sm:mb-6">
            Why TheRootFood
          </p>
          <h2 className="font-heading font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight flex flex-col items-center gap-3 sm:gap-4 leading-none">
            <span>From our roots</span>
            <span className="highlight-block">to your table</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-7 lg:gap-8 max-w-6xl mx-auto">
          {STEPS.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.08}>
              <article className="glass-panel h-full flex flex-col gap-5 sm:gap-6 p-6 sm:p-8 md:p-10 min-h-[220px] sm:min-h-[260px] md:min-h-[280px]">
                <span className="font-heading font-semibold text-4xl sm:text-5xl md:text-6xl text-primary leading-none select-none">
                  {step.number}
                </span>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-snug tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base leading-[1.75]">
                    {step.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
