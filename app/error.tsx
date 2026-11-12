"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw } from "lucide-react";
import { StatusScreen, statusPrimaryClass, statusSecondaryClass } from "@/components/shared/status-screen";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <StatusScreen
      code="Oops"
      title={
        <>
          We&apos;re tending <span className="highlight-block">the soil</span>
        </>
      }
      description="Something went wrong on our side, or the site is briefly down for maintenance. Give it a moment and try again. You can still order on WhatsApp in the meantime."
      actions={
        <>
          <button type="button" onClick={reset} className={statusPrimaryClass}>
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className={statusSecondaryClass}>
            <Home className="h-4 w-4" />
            Home
          </Link>
          <a
            href={buildWhatsAppLink(
              "Hi TheRootFood team! Your website seems to be having trouble right now, so I thought I'd message you directly. I'd like to place an order."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={statusSecondaryClass}
          >
            <WhatsAppLogo className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </>
      }
      footnote={error.digest ? `Error ID: ${error.digest}` : undefined}
    />
  );
}
