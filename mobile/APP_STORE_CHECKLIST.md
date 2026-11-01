# Falowen → Apple TestFlight readiness (November 2026)

**Current status:** The Codemagic **Personal Account** simulator workflow completed successfully (Build #2, 1m50s, App.app.zip). This proves the app compiles for a simulator; it does **not** prove it works on physical iPhones, has passed Apple review, or is signed for TestFlight.

**Cost policy:** Preserve the working Personal Account application and its free build allowance. Do not transfer it to the Falowen Team account just for App Preview. There are **no automatic build triggers**. Do not run the signed/TestFlight workflow before Apple membership, app setup, Apple signing credentials and product checks are complete.

## Ready now, without paying Apple

- [x] Separate Capacitor 8 iOS wrapper in `mobile/`, reusing React/Vite site in `web/`.
- [x] Working Codemagic unsigned simulator build on `feature/codemagic-ios-starter`.
- [x] Existing app-level Firebase settings group `falowen_firebase` imported by both workflows.
- [x] iOS microphone usage explanation (speaking exams).
- [x] Generate temporary **Falowen-branded** 1024px opaque app icon from the current `web/public/falo.png` on each build, without adding an image dependency. Review icon legibility on device; this is not final app artwork.
- [x] Signed build workflow retains explicit Apple credentials, builds an IPA with a Codemagic build number, and leaves App Store submission disabled.

## Blocking items before the *first signed upload*

- [ ] **Apple Developer Program:** enroll and pay the required membership, when actually ready for TestFlight.
- [ ] **Apple app identity:** confirm app name `Falowen` and bundle ID `app.falowen.student`. Before reserving this ID at Apple, make sure no other app owns it. If it needs to change, update `mobile/capacitor.config.json` and the signed workflow together.
- [ ] **App Store Connect app record:** create the app under the correct Apple team (iOS platform; use the confirmed bundle ID). Codemagic cannot create the initial App Store listing for you.
- [ ] **Apple credentials:** create an App Store Connect API key with necessary App Manager access and a distribution-signing private key. In the **Personal Account** Codemagic application, create the **secret** group `appstore_credentials` with `APP_STORE_CONNECT_PRIVATE_KEY`, `APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `CERTIFICATE_PRIVATE_KEY`. Never push .p8, .p12, private keys or tokens to GitHub or screenshots.
- [ ] **App Store metadata:** confirm seller name, app category (Education), support URL, language and contact. Make sure a publicly accessible privacy policy URL leads directly to Falowen's privacy policy (the existing https://register.falowen.app/ page includes policy text; verify it is appropriate for App Store use). Supply data-collection answers and age rating.
- [ ] **Review access:** provide a dedicated reviewer/demo learner account or fully functional demo mode; confirm no paywall blocks Apple's reviewer from evaluating representative course, exam and speaking features.
- [ ] **Screenshots:** capture real app screens at Apple's current required iPhone sizes. If the binary supports iPad, provide the applicable iPad screens too.
- [ ] **Final icon:** examine the existing branded icon at actual iPhone home-screen scale and substitute a better 1024px opaque asset if text becomes unreadable.
- [ ] **Third-party sign-in compliance:** if Google login remains a primary account option in iOS, review Apple's Guideline 4.8 equivalent privacy-preserving login requirement and applicable exceptions; do not assume a web popup is an acceptable native login flow.
- [ ] **Device acceptance testing:** test Firebase email/password sign-in, verification/password reset links, Google sign-in (popup might not work in WKWebView), enrolled-student access, the Campus, exam-room, MP3 playback, voice recording, recording permission, uploads/downloads and outside links. A passing **simulator compile** does not validate these.
- [ ] **App account lifecycle:** confirm account deletion is available **inside the iOS app** if learners can register there; comply with Apple's rule rather than only providing an email support request.
- [ ] **Digital purchasing:** audit every in-app pay/upgrade path (Paystack, billing, exam packs, tuition). Determine whether Apple's In-App Purchase rules or an applicable exception applies **before** App Store review. Do not assume website payment flows are automatically allowed inside iOS.
- [ ] **App-like experience:** demonstrate native value beyond a website wrapper. Working audio, speaking practice, course progress and assignments should be usable without Safari-only assumptions.

## How to publish later (only when ready)

1. Keep Codemagic workspace **Personal Account**. In Codemagic choose repository `learngermanghana/falowenexamtrainer` and branch `feature/codemagic-ios-starter` (or `main` only after PR merge).
2. Verify app-level group `falowen_firebase` is intact; add **`appstore_credentials`** only after Apple enrollment.
3. Select manual workflow **`falowen-ios-testflight`**: *Falowen iOS - Signed TestFlight upload (Apple required)*. Unlike the free simulator workflow, this signs an installable IPA and uploads it to App Store Connect.
4. Verify the build artifact `build/ios/ipa/*.ipa`; wait for Apple to process it in App Store Connect.
5. Assign the processed build to a small **internal TestFlight group** manually (this configuration sets `submit_to_testflight: false`, so it will not auto-submit to external testers). Test on a physical iPhone before inviting external learners.
6. Only after the acceptance checklist is complete, decide separately about App Store submission. The workflow explicitly sets `submit_to_app_store: false`.

### App Store listing copy — working draft, not submitted

- Name: **Falowen**
- Subtitle (draft): **German lessons and exam prep**
- Category: **Education**
- Description (draft): **Learn German with structured lessons, guided practice and tutor feedback. Study your course materials, practise reading and listening, submit assignments, and prepare for speaking and writing exams in one place.** Review language coverage and available features before submitting.
- Support URL candidate: https://www.falowen.app/help
- Privacy policy candidate: https://register.falowen.app/ (contains a privacy policy section; verify a direct policy link and current coverage before submission).

### References

- Codemagic publishing: https://docs.codemagic.io/yaml-publishing/app-store-connect/
- Codemagic signing: https://docs.codemagic.io/partials/code-signing-ios-configure-environment-vars/
- Apple's App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple's privacy listing requirements: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
- Screenshot requirements: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
