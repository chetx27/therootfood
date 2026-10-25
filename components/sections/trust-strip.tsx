import { Leaf } from "lucide-react";

const PHRASES = [
  "Stone-ground fresh",
  "Free-range eggs",
  "No preservatives",
  "Farm direct",
  "Ships worldwide",
  "Handcrafted bakes",
  "Small batches",
  "Grown with patience",
];

export function TrustStrip() {
  // Duplicate the sequence so the marquee loops seamlessly
  const sequence = [...PHRASES, ...PHRASES];

  return (
    <section
      aria-label="What we stand for"
      className="bg-primary text-primary-foreground py-4 sm:py-5 overflow-hidden"
    >
      <div className="flex w-max animate-marquee" aria-hidden="true">
        {sequence.map((phrase, i) => (
          <span
            key={i}
            className="flex items-center gap-3 shrink-0 px-6 font-heading font-semibold text-lg sm:text-xl tracking-tight whitespace-nowrap"
          >
            {phrase}
            <Leaf className="h-4 w-4 opacity-60" />
          </span>
        ))}
      </div>
      <span className="sr-only">{PHRASES.join(", ")}</span>
    </section>
  );
}
