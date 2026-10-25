import Image from "next/image";
import { cn } from "@/lib/utils";

/** Compact brand icon — used as a home redirect in the header. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-7 w-7 shrink-0 sm:h-8 sm:w-8", className)}>
      <Image
        src="/rootfood-mark.webp"
        alt="TheRootFood home"
        fill
        className="object-contain"
        sizes="32px"
        priority
      />
    </span>
  );
}
