"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIconButton } from "@/components/shared/whatsapp-icon-button";
import { cn } from "@/lib/utils";

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={cn(
        // Bottom-left: bottom-right is reserved for the chat widget launcher
        "fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <WhatsAppIconButton 
        href={buildWhatsAppLink(defaultEnquiryMessage())}
        className="h-14 w-14 shadow-lg hover:shadow-xl hover:scale-105"
      />
    </div>
  );
}
