import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import Link from "next/link";
import { Home, ShoppingBasket } from "lucide-react";
import { StatusScreen, statusPrimaryClass, statusSecondaryClass } from "@/components/shared/status-screen";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Page Not Found | TheRootFood",
  description: "The page you were looking for could not be found.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title={
        <>
          This field is <span className="highlight-block">empty</span>
        </>
      }
      description="We looked everywhere on the farm, but this page isn't growing here. It may have moved, or the link might be a little off."
      actions={
        <>
          <Link href="/" className={statusPrimaryClass}>
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link href="/order" className={statusSecondaryClass}>
            <ShoppingBasket className="h-4 w-4" />
            Browse products
          </Link>
          <a
            href={buildWhatsAppLink(
              "Hi TheRootFood team! I tried opening a page on your website but it said it couldn't be found. Could you help me find what I was looking for?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={statusSecondaryClass}
          >
            <WhatsAppLogo className="h-4 w-4" />
            Ask us
          </a>
        </>
      }
    />
  );
}
