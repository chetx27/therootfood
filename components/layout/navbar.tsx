"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { CartButton } from "@/components/cart/cart-button";
import { BrandMark } from "@/components/ui/brand-mark";

/** Inline on tablet/desktop; phones get these from the burger menu. */
const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/cakes", label: "Cakes & Bakes" },
  { href: "/order", label: "Order" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Always land at the top of the landing page, even when already on `/`. */
  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (pathname === "/") {
      // Same route: clear any #hash and scroll to the hero.
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    router.push("/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        "border-b border-black/8 bg-white/95 lg:bg-white/80 lg:backdrop-blur-md",
        isScrolled && "shadow-[0_10px_40px_-24px_rgba(0,0,0,0.28)]"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-5 lg:px-8">
        {/* Small logo — left corner → landing top */}
        <Link
          href="/"
          aria-label="TheRootFood home"
          onClick={goHome}
          className="flex shrink-0 items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
        >
          <BrandMark className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="font-heading text-lg font-semibold tracking-tight text-forest-deep sm:text-xl">
            The<span className="italic font-normal">Root</span>Food
          </span>
        </Link>

        {/* Primary links */}
        <div className="flex-1 lg:hidden" />
        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-6 lg:flex xl:gap-9">
          {primaryLinks.map((link) => {
            const className =
              cn("shrink-0 whitespace-nowrap rounded-sm text-sm font-medium transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30", pathname === link.href ? "text-black" : "text-black/70");
            const label = link.label;

            if (link.href === "/") {
              return (
                <Link key={link.href} href="/" onClick={goHome} className={className}>
                  {label}
                </Link>
              );
            }

            // Hash anchors stay as <a> so in-page jump works from any route.
            if (link.href.startsWith("/#")) {
              return (
                <a key={link.href} href={link.href} className={className}>
                  {label}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={className}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 border-l border-black/10 pl-2 sm:gap-2 sm:pl-4 lg:pl-6">
          <a
            href={buildWhatsAppLink(defaultEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "hidden min-h-[36px] rounded-full bg-forest px-3.5 text-sm text-white hover:bg-forest-deep xl:inline-flex"
            )}
          >
            WhatsApp Us
          </a>
          <CartButton className="text-black hover:text-black hover:bg-black/5" />
          <MobileNavDrawer />
        </div>
      </div>
    </header>
  );
}
