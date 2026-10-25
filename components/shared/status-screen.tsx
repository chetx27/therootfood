import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface StatusScreenProps {
  code: string;
  title: ReactNode;
  description: string;
  actions: ReactNode;
  footnote?: ReactNode;
}

export function StatusScreen({ code, title, description, actions, footnote }: StatusScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-3 py-6 sm:px-6">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-forest px-6 py-14 text-center text-white shadow-[0_40px_120px_-40px_rgba(45,92,66,0.55)] sm:rounded-[3rem] sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,180,200,0.2),transparent_60%)]"
        />
        <Image
          src="/float-carrot.webp"
          alt=""
          aria-hidden="true"
          width={120}
          height={160}
          className="pointer-events-none absolute -left-4 top-10 hidden w-20 rotate-[-18deg] opacity-80 sm:block md:w-28"
        />
        <Image
          src="/float-eggs.webp"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="pointer-events-none absolute -right-2 bottom-10 hidden w-20 rotate-12 opacity-80 sm:block md:w-28"
        />

        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <Link
            href="/"
            aria-label="TheRootFood home"
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg"
          >
            <Image src="/rootfood-mark.webp" alt="TheRootFood" width={56} height={56} />
          </Link>

          <p className="font-heading font-semibold text-[6rem] leading-none tracking-tight text-primary sm:text-[9rem]">{code}</p>
          <h1 className="mt-4 font-heading font-semibold text-3xl leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>

          <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            {actions}
          </div>

          {footnote && <div className="mt-8 text-xs text-white/50">{footnote}</div>}
        </div>
      </div>
    </div>
  );
}

export const statusPrimaryClass =
  "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark";

export const statusSecondaryClass =
  "inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10";
