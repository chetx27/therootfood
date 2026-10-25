import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep text-white">
      {/* Big editorial CTA */}
      <div className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 md:pb-16">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="font-heading font-semibold text-4xl sm:text-6xl md:text-7xl leading-[1.12] tracking-tight mb-6">
            So, what&apos;s cooking
            <br />
            <span className="highlight-block">at your place?</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Send us your order on WhatsApp from anywhere in the world — a real person from the
            farm replies, always.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/order"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full min-h-[52px] px-8 text-base"
              )}
            >
              Order Now
            </a>
            <a
              href={buildWhatsAppLink(defaultEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full min-h-[52px] px-8 text-base border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <WhatsAppLogo className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-8 border-t border-white/15 pt-12">
            {/* Brand */}
            <div className="col-span-2">
              <h3 className="font-heading text-2xl font-semibold mb-4">TheRootFood</h3>
              <p className="text-white/70 max-w-sm leading-relaxed text-sm">
                Premium farm-direct products straight to your kitchen. Authentic, healthy, and natural
                — sourced from our farm and trusted partners, shipped across India and worldwide.
              </p>
            </div>

            {/* Navigate */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-primary">
                Navigate
              </h4>
              <ul className="space-y-1">
                {[
                  { href: "/order", label: "Order Products" },
                  { href: "/#story", label: "Why Us" },
                  { href: "/cakes", label: "Custom Cakes" },
                  { href: "/#bulk", label: "Bulk Orders" },
                  { href: "/about", label: "About Us" },
                  { href: "/faq", label: "FAQs" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm min-h-[40px] inline-flex items-center text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest text-primary">
                Contact
              </h4>
              <address className="not-italic text-white/70 space-y-3 text-sm">
                <p>
                  <a
                    href="tel:+917619436055"
                    className="hover:text-white transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    +91 76194 36055
                  </a>
                </p>
                <p>
                  <a
                    href="https://wa.me/917619436055"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    <WhatsAppLogo className="h-4 w-4 shrink-0" />
                    WhatsApp Us
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:therootfoodsupport@gmail.com"
                    className="hover:text-white transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    therootfoodsupport@gmail.com
                  </a>
                </p>
                <p className="text-white/45 mt-4 text-xs leading-relaxed">
                  Fresh produce: Bangalore local delivery
                  <br />
                  Flours, roots &amp; soaps: India-wide and international shipping
                </p>
              </address>
            </div>
          </div>
        </FadeIn>

        <div className="border-t border-white/15 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/45 text-sm">
          <p>&copy; {year} TheRootFood. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
