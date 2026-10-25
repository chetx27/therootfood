import type { CapacitorConfig } from "@capacitor/cli";

/**
 * The mobile apps are a native shell around the live site (remote-URL app).
 * The website is already phone-first responsive, so iOS/Android get the full
 * experience — basket, WhatsApp ordering, chatbot — with zero duplicate code.
 *
 * To build:
 *   npx cap sync
 *   npx cap open ios      (requires Xcode, macOS)
 *   npx cap open android  (requires Android Studio)
 *
 * See APP.md for the full publishing guide.
 */
const config: CapacitorConfig = {
  appId: "com.therootfood.app",
  appName: "TheRootFood",
  webDir: "mobile-shell",
  server: {
    url: "https://therootfood.com",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#f5f0e8",
  },
  android: {
    backgroundColor: "#f5f0e8",
    allowMixedContent: false,
  },
};

export default config;
