import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { cn } from "@/lib/utils";

interface WhatsAppIconButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  "aria-label"?: string;
}

export function WhatsAppIconButton({ href, className, ...props }: WhatsAppIconButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-whatsapp text-white shadow-md hover:bg-whatsapp/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors",
        className
      )}
      aria-label={props["aria-label"] || "Chat with us on WhatsApp"}
      {...props}
    >
      <WhatsAppLogo className="h-6 w-6" />
    </a>
  );
}
