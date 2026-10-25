# TheRootFood — iOS & Android App Guide

The mobile apps are built with [Capacitor](https://capacitorjs.com) as a native shell around
the live website. Because the site is fully phone-first responsive, the apps get the complete
experience — product catalog, basket, Stripe checkout, chatbot, WhatsApp — with a single codebase.

## How it works

- `capacitor.config.ts` points the native shell at the production site (`server.url`).
- `mobile-shell/index.html` is only shown if the device is offline on first launch.
- `android/` and `ios/` contain the generated native projects (committed to the repo).

Any change deployed to the website is instantly live in both apps — no app-store re-release
needed for content or feature updates.

## Prerequisites

| Platform | Requirement                                                    |
| -------- | -------------------------------------------------------------- |
| iOS      | macOS with Xcode 15+, an Apple Developer account ($99/yr)      |
| Android  | Android Studio, a Google Play Developer account ($25 one-time) |

## Building

```bash
# After changing capacitor.config.ts or updating Capacitor:
npm run app:sync

# Open native IDEs:
npm run app:ios       # opens Xcode
npm run app:android   # opens Android Studio
```

### Android (Google Play)

1. Open Android Studio via `npm run app:android`.
2. Build → Generate Signed Bundle (create a keystore the first time — back it up, losing it means you can never update the app).
3. Upload the `.aab` to the [Google Play Console](https://play.google.com/console).
4. Fill in the store listing (use `public/og-image.png` and the icon set in `public/`).

### iOS (App Store)

1. Open Xcode via `npm run app:ios`.
2. Set your Team under Signing & Capabilities.
3. Product → Archive, then distribute to App Store Connect.
4. Complete the listing in [App Store Connect](https://appstoreconnect.apple.com).

## App icons & splash screens

Generate all sizes from the 512px brand icon:

```bash
npm install --save-dev @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor "#f5f0e8" --splashBackgroundColor "#f5f0e8"
```

(Place `assets/icon.png` (1024×1024) and `assets/splash.png` (2732×2732) first — you can
upscale `public/icon-512.png` or export fresh from the brand mark.)

## Store review notes

- Apple may flag "web wrapper" apps (Guideline 4.2) if they offer nothing app-like. Mitigations
  already in place: installable experience, cart, checkout, and chat all function natively in the
  shell. If pushed back, add push notifications (`@capacitor/push-notifications`) for order
  updates — that is the strongest "native value" signal.
- Both stores require the privacy policy URL: `https://therootfood.com/privacy`.

## Owner checklist before submitting

- [ ] Production site deployed at the URL in `capacitor.config.ts`
- [ ] Apple Developer + Google Play accounts created
- [ ] Keystore (Android) created and backed up securely
- [ ] App icons/splash generated
- [ ] Privacy policy URL added to both store listings
