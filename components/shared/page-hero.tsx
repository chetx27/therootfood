import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="bg-white px-3 pt-3 sm:px-5 sm:pt-4 md:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[1.75rem] bg-forest px-6 pb-20 pt-14 text-center text-white sm:rounded-[2.5rem] sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(232,180,200,0.22),transparent_45%),radial-gradient(ellipse_at_10%_100%,rgba(255,255,255,0.07),transparent_45%)]"
        />
        <Image
          src="/float-eggs.webp"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="pointer-events-none absolute left-[4%] top-10 hidden w-20 -rotate-12 opacity-90 md:block lg:w-28"
        />
        <Image
          src="/float-bread.webp"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="pointer-events-none absolute bottom-10 right-[5%] hidden w-20 rotate-12 opacity-90 md:block lg:w-28"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
