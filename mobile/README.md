# Falowen iOS (Capacitor + Codemagic)

**Progress:** The Personal Account Codemagic free unsigned simulator workflow **successfully built Falowen (Build #2)** on 1 November 2026. This establishes compilation only, not on-device or Apple TestFlight validation.

**Next:** [TestFlight readiness checklist](./APP_STORE_CHECKLIST.md) — release blockers, cost safeguards and planned App Store metadata.

The existing Falowen React/Vite site remains in `web/` and keeps its Vercel deployment. This folder is a **separate, native iOS shell** for packaging the same web build, not a second student website. Codemagic generates the Xcode project during the build: you do **not** need a Mac just to run CI.

## Phase 1: Free unsigned simulator build (no Apple payment)

1. Create a Codemagic account at https://codemagic.io and connect GitHub repository `learngermanghana/falowenexamtrainer`.
2. Select a `codemagic.yaml` workflow (repository root) on the branch containing these changes.
3. In Codemagic **Application settings > Environment variables**, create/select the application-level group **`falowen_firebase`** and put all six **web Firebase project configuration** values from the existing Falowen Vercel frontend in that group. Both YAML workflows import this group. Set their variable names exactly:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

   These are frontend configuration values, not Firebase Admin/service-account credentials. **Do not commit credentials to GitHub.** The build will fail early with the name of the first missing value. Additional frontend environment variables can be added if your Falowen production build requires them.
4. Choose **Falowen iOS - Free unsigned simulator build** (`falowen-ios-simulator`) and press **Start new build** manually. It deliberately has no automatic push trigger to save free build minutes.
5. On success, inspect the `App.app` artifact. It is an *unsigned iOS Simulator app*, **not** an installable iPhone IPA or App Store release.

The build: installs repository and web dependencies, builds Vite assets to `web/dist/`, installs pinned Capacitor 8 into `mobile/`, creates `mobile/ios/`, syncs assets, generates a **temporary Falowen-branded iOS icon** using the existing `web/public/falo.png`, and compiles an unsigned Xcode simulator target. Neither Xcode nor generated files are committed to the main website repository.

## Phase 2: Paid Apple Developer membership / TestFlight

Do this **only after** a simulator build succeeds and the iOS experience has been tested.

1. Join the Apple Developer Program (normally US$99/year), then create an App Store Connect app for bundle identifier `app.falowen.student`. **Confirm the final bundle ID before your first Apple registration**, and update both `mobile/capacitor.config.json` and `codemagic.yaml` together if it changes.
2. Under Codemagic environment variables, create a secure group named `appstore_credentials`. Add:
   - `APP_STORE_CONNECT_KEY_IDENTIFIER`
   - `APP_STORE_CONNECT_ISSUER_ID`
   - `APP_STORE_CONNECT_PRIVATE_KEY` (the full .p8 contents, secret)
   - `CERTIFICATE_PRIVATE_KEY` (for automatic signing, secret)
3. Choose the **Falowen iOS - Signed TestFlight upload (Apple required)** (`falowen-ios-testflight`) workflow manually. This workflow generates the project again, signs an IPA and uploads the IPA to App Store Connect. The initial configuration does **not** automatically submit it to external TestFlight groups or for App Store review.
4. Finish App Store Connect metadata (privacy policy, age rating, screenshots, descriptions, account deletion support where applicable), set up internal TestFlight testers and evaluate Apple review requirements.

References:
- https://docs.codemagic.io/yaml-code-signing/ios-simulator-builds/
- https://docs.codemagic.io/yaml-code-signing/signing-ios/
- https://docs.codemagic.io/yaml-publishing/app-store-connect/
- https://capacitorjs.com/docs/ios

## iPhone release checklist (required before distribution)

- **Login:** Confirm email/password sign-in and account creation inside WKWebView. Google `signInWithPopup` is used in Falowen's web code and may need a native-safe authentication flow before iOS release.
- **Password reset and verification:** The iOS build sets `REACT_APP_AUTH_CONTINUE_URL=https://www.falowen.app` so Firebase email action links open the real HTTPS site, not `capacitor://localhost`. Test end-to-end.
- **Speaking:** Test microphone permissions, record/stop/playback and AI examiner audio on an actual iPhone. The Codemagic build now writes `NSMicrophoneUsageDescription` into the generated iOS `Info.plist`. Additional permissions/plugins, if needed, must be configured and tested before signed distribution.
- **Music and listening:** Test streaming, auto-play restrictions, lyric sync and background behaviour.
- **Navigation:** Test deep links, redirects, React Router refreshes, downloads and PDF opening.
- **Payments:** Evaluate App Store In-App Purchase requirements for selling digital courses/exams; existing web Paystack checkout must not simply be reused for in-app digital purchases without confirming Apple policy and applicable exceptions.
- **App presentation:** The workflow now generates a provisional native Falowen icon from existing site artwork. Review it on-device and approve or replace before distribution; review splash assets and demonstrate native-value features beyond a website wrapper.
- **Security and costs:** Do not put Apple signing keys in the repository. Build workflows are manual to avoid unnecessary Codemagic minutes.

## Local macOS development (optional)

```bash
npm ci
npm ci --prefix web
npm run build --prefix web

cd mobile
npm install --no-package-lock
npx cap add ios
npx cap sync ios
python3 scripts/prepare_ios.py
sh scripts/generate_icon.sh
npx cap open ios
```

`mobile/capacitor.config.json` intentionally points to `../web/dist`. The iOS Xcode project is generated and ignored in Git; create it again after cleaning your workspace.

**Status:** An unsigned iOS Simulator compile **succeeded** on Codemagic Personal Account. A signed iPhone IPA, TestFlight upload, real-device acceptance testing and App Store review remain **not yet completed**. Refer to [APP_STORE_CHECKLIST.md](./APP_STORE_CHECKLIST.md).
