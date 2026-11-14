import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { businessInfo } from "@/lib/business-info";
import PlausibleProvider from "next-plausible";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { ScrollToTopOnLoad } from "@/components/shared/scroll-to-top-on-load";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["SOFT", "opsz"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#2D5C42",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "TheRootFood | Farm Produce and Fresh Bakes, Bangalore",
  description: "Stone-ground ragi flour, country eggs, goat meat, vetiver and goat milk soap from our farm, plus cakes and brownies from Nitara's Fine Bakes. Order on WhatsApp.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "TheRootFood | Farm Produce and Fresh Bakes, Bangalore",
    description: "Flours, eggs, meat and cakes from our farm and bakery. Order on WhatsApp.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TheRootFood, farm produce and fresh bakes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheRootFood | Farm Produce and Fresh Bakes, Bangalore",
    description: "Flours, eggs, meat and cakes from our farm and bakery. Order on WhatsApp.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <PlausibleProvider src="https://plausible.io/js/script.js" init={{}}>
        <body className="font-sans antialiased">
          <CartProvider>
            <ScrollToTopOnLoad />
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
              Skip to main content
            </a>
            <main id="main-content">
              {children}
            </main>
            <CartDrawer />
            <ChatWidget />
            <Toaster richColors position="top-center" />
          </CartProvider>
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                ...businessInfo,
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com"}/icon-512.png`,
                image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com"}/icon-512.png`,
              }),
            }}
          />
        </body>
      </PlausibleProvider>
    </html>
  );
}
