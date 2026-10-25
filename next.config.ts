import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [90],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "therootfood",
  project: "therootfood-web",
});
