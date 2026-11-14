"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Cake,
  ChevronRight,
  HelpCircle,
  Home,
  Info,
  Menu,
  Phone,
  ShoppingBasket,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { BrandMark } from "@/components/ui/brand-mark";

interface MenuLink {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const shopLinks: MenuLink[] = [
  { href: "/", label: "Home", hint: "Back to the start", icon: Home },
  { href: "/cakes", label: "Cakes & Bakes", hint: "Nitara's Fine Bakes menu", icon: Cake },
  { href: "/order", label: "Farm", hint: "Flours, eggs, meat & more", icon: ShoppingBasket },
  { href: "/#bulk", label: "Bulk Orders", hint: "For cafés, shops & kitchens", icon: Truck },
];

const infoLinks: MenuLink[] = [
  { href: "/about", label: "About Us", hint: "Our farm story", icon: Info },
  { href: "/faq", label: "FAQ", hint: "Delivery, payment & more", icon: HelpCircle },
  { href: "/contact", label: "Contact", hint: "Call, email or visit", icon: Phone },
];

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function renderLink(link: MenuLink) {
    const Icon = link.icon;
    const active = link.href === pathname;
    return (
      <li key={link.href}>
        <Link
          href={link.href}
          onClick={() => setOpen(false)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-forest/5",
            active && "bg-forest/10"
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-foreground">{link.label}</span>
            <span className="block truncate text-xs text-muted-foreground">{link.hint}</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </li>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-black hover:text-black hover:bg-black/5"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-[360px] gap-0 p-0 sm:max-w-[360px]">
        <SheetHeader className="flex-row items-center gap-3 border-b border-border px-5 py-4 pr-14">
          <BrandMark className="h-9 w-9" />
          <div className="min-w-0">
            <SheetTitle className="font-heading font-semibold text-lg tracking-tight">TheRootFood</SheetTitle>
            <SheetDescription className="text-xs">Farm-direct, ordered on WhatsApp</SheetDescription>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main menu">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Shop</p>
          <ul className="space-y-1">{shopLinks.map(renderLink)}</ul>
          <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Info
          </p>
          <ul className="space-y-1">{infoLinks.map(renderLink)}</ul>
        </nav>

        <div className="border-t border-border p-5">
          <a
            href={buildWhatsAppLink(defaultEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "w-full min-h-[48px] gap-2 rounded-full bg-forest text-white hover:bg-forest-deep"
            )}
          >
            <WhatsAppLogo className="h-4 w-4" />
            Chat with us on WhatsApp
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
