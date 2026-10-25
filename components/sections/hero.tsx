import Image from "next/image";
import { ArrowRight, Egg, Wheat, CakeSlice } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { FloatingElement } from "@/components/shared/floating-element";
import { InteractiveFloat } from "@/components/shared/interactive-float";

const tags = [
  { label: "Eggs", icon: Egg, className: "left-[2%] bottom-[18%] sm:left-[6%] sm:bottom-[22%]" },
  { label: "Flours", icon: Wheat, className: "right-[2%] top-[8%] sm:right-[8%] sm:top-[12%]" },
  { label: "Bakes", icon: CakeSlice, className: "right-[4%] bottom-[14%] sm:right-[10%] sm:bottom-[18%]" },
] as const;

const doors = [
  {
    href: "/order",
    eyebrow: "From our farm",
    title: "Order farm produce",
    sub: "Flours · eggs · meat · roots",
    image: "/products/country-eggs.webp",
    className: "bg-[#f7f2e8] text-forest-deep ring-white/40 hover:bg-white",
    eyebrowClass: "text-forest/70",
    subClass: "text-forest-deep/60",
  },
  {
    href: "/cakes",
    eyebrow: "From our oven",
    title: "Cakes & brownies",
    sub: "Nitara's Fine Bakes",
    image: "/bakery/cake-celebration.webp",
    className: "bg-[#f3d6df] text-[#3d1426] ring-white/40 hover:bg-[#f8e3ea]",
    eyebrowClass: "text-[#b0537a]",
    subClass: "text-[#3d1426]/60",
  },
] as const;

/** Sharp, interactive floats beside the copy */
const nearFloats = [
  {
    src: "/float-ragi.webp",
    className: "left-[2%] top-[16%] hidden w-14 xl:block sm:left-[4%] sm:top-[18%] sm:w-24 md:left-[5%] md:w-28 lg:left-[6%] lg:w-32",
    aspect: "aspect-square",
    tilt: "-rotate-12",
    duration: 6.5,
    amplitude: 7,
    sway: 4,
    rotate: 2,
  },
  {
    src: "/float-brownie.webp",
    className: "right-[2%] top-[18%] hidden w-14 xl:block sm:right-[4%] sm:top-[14%] sm:w-24 md:right-[5%] md:w-28 lg:right-[6%] lg:w-32",
    aspect: "aspect-square",
    tilt: "rotate-12",
    duration: 7.2,
    delay: 0.5,
    amplitude: 8,
    sway: -3,
    rotate: 2,
  },
  {
    src: "/float-eggs.webp",
    className: "left-[3%] bottom-[28%] hidden w-16 sm:block sm:left-[5%] sm:w-24 md:bottom-[30%] md:w-28 lg:left-[7%]",
    aspect: "aspect-square",
    tilt: "rotate-[-8deg]",
    duration: 6.8,
    delay: 0.9,
    amplitude: 6,
    sway: 3,
    rotate: 2,
  },
  {
    src: "/float-cake.webp",
    className: "right-[3%] bottom-[26%] hidden w-16 sm:block sm:right-[5%] sm:w-24 md:bottom-[28%] md:w-28 lg:right-[7%]",
    aspect: "aspect-square",
    tilt: "rotate-[10deg]",
    duration: 7.5,
    delay: 1.1,
    amplitude: 6,
    sway: -3,
    rotate: 2,
  },
] as const;

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white pt-3 pb-10 sm:pt-4 sm:pb-14 md:pt-5 md:pb-20">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 md:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] md:rounded-[3.25rem] bg-forest text-white ring-1 ring-inset ring-white/10 shadow-[0_40px_120px_-40px_rgba(45,92,66,0.55)] min-h-[78vh] sm:min-h-[82vh] md:min-h-[88vh] flex items-start sm:items-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(ellipse_at_50%_120%,rgba(0,0,0,0.35),transparent_60%)]"
          />
          {/* Soft glow behind the farm box */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6%] left-1/2 h-[40%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,180,200,0.22),transparent_70%)] blur-2xl"
          />

          {/* Sharp interactive floats — empty space beside the copy */}
          {nearFloats.map((item, i) => (
            <InteractiveFloat
              key={`near-${item.src}-${i}`}
              className={`absolute z-10 ${item.className}`}
              duration={item.duration}
              delay={"delay" in item ? item.delay : 0}
              amplitude={item.amplitude}
              sway={item.sway}
              rotate={item.rotate}
            >
              <div
                className={`relative w-full opacity-90 drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)] ${item.aspect} ${item.tilt}`}
              >
                <Image
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 112px, 128px"
                  priority={i < 2}
                />
              </div>
            </InteractiveFloat>
          ))}

          {/* Tight top padding so copy starts near the top of the green panel */}
          <div className="relative z-20 w-full px-5 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-14 md:px-16 md:pt-12 md:pb-16 lg:px-24 lg:pt-14">
            <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="mb-7 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#e9d9b8] sm:mb-9 sm:text-xs">
                <span aria-hidden="true" className="h-px w-8 bg-[#e9d9b8]/50 sm:w-12" />
                Farm &amp; bakery
                <span aria-hidden="true" className="h-px w-8 bg-[#e9d9b8]/50 sm:w-12" />
              </p>

              <h1 className="mb-7 font-heading text-[2.6rem] font-normal leading-[1.02] tracking-[-0.02em] text-white sm:mb-8 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Grown on our farm.
                <br />
                <span className="italic text-[#f3d6df]">Baked</span> with love.
              </h1>

              <p className="mb-10 max-w-md px-1 text-[15px] leading-[1.8] text-white/65 sm:mb-11 sm:text-base md:mb-12">
                One family, two kitchens — honest farm produce with no middlemen, and celebration bakes from
                Nitara&apos;s Fine Bakes. Pick what you love; we&apos;ll confirm it personally on WhatsApp.
              </p>

              <div className="mb-12 grid w-full max-w-md gap-3 text-left sm:mb-14 lg:max-w-2xl lg:grid-cols-2 lg:gap-4">
                {doors.map((d) => (
                  <a
                    key={d.href}
                    href={d.href}
                    className={`group relative flex items-center gap-4 overflow-hidden rounded-[1.5rem] p-3 pr-5 ring-1 ring-inset transition duration-300 hover:-translate-y-1 ${d.className}`}
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
                      <Image src={d.image} alt="" fill quality={90} className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="80px" priority />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[10px] font-semibold uppercase tracking-[0.28em] ${d.eyebrowClass}`}>{d.eyebrow}</span>
                      <span className="mt-1 block font-heading text-xl leading-tight sm:text-2xl">{d.title}</span>
                      <span className={`mt-0.5 block text-xs ${d.subClass}`}>{d.sub}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </div>

              {/* Realistic farm box */}
              <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[520px]">
                {tags.map((tag, i) => {
                  const Icon = tag.icon;
                  return (
                    <FloatingElement
                      key={tag.label}
                      className={`pointer-events-none absolute z-20 ${tag.className}`}
                      duration={6 + i * 0.6}
                      delay={i * 0.35}
                      amplitude={8}
                      sway={i % 2 === 0 ? 5 : -5}
                      rotate={2}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-forest-deep/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/85 shadow-lg sm:gap-2 sm:px-3.5 sm:text-[11px]">
                        <Icon className="h-3.5 w-3.5 text-[#e9d9b8]" strokeWidth={1.5} />
                        {tag.label}
                      </span>
                    </FloatingElement>
                  );
                })}

                <FloatingElement duration={7} amplitude={10} sway={4} rotate={2}>
                  <div className="relative aspect-square w-full drop-shadow-[0_28px_50px_rgba(0,0,0,0.45)]">
                    <Image
                      src="/hero-farm-box.webp"
                      alt="TheRootFood farm box — fresh eggs, flours, roots, and bakes"
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 460px, 520px"
                      priority
                    />
                  </div>
                </FloatingElement>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
