import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  /** When true, forces dark text for white / light backgrounds. */
  onLight?: boolean;
}

export function SectionHeading({
  title,
  description,
  className,
  align = "center",
  onLight = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <h2
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-heading font-semibold tracking-tight leading-[1.08]",
          onLight ? "text-slate-900" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base md:text-lg max-w-[640px] leading-relaxed",
            onLight ? "text-slate-600" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
