# Falowen iOS (Capacitor + Codemagic)

The existing Falowen React/Vite site remains in `web/` and keeps its Vercel deployment. This folder is a **separate, native iOS shell** for packaging the same web build, not a second student website. Codemagic generates the Xcode project during the build: you do **not** need a Mac just to run CI.

## Phase 1: Free unsigned simulator build (no Apple payment)

1. Create a Codemagic account at https://codemagic.io and connect GitHub repository `learngermanghana/falowenexamtrainer`.
2. Select a `codemagic.yaml` workflow (repository root) on the branch containing these changes.
3. In the Codemagic **Application settings > Environment variables**, add the six **web Firebase project configuration** values also used in the existing Falowen Vercel frontend. Set their names exactly:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

   These are frontend configuration values, not Firebase Admin/service-account credentials. **Do not commit credentials to GitHub.** The build will fail early with the name of the first missing value. Additional frontend environment variables can be added if your Falowen production build requires them.
4. Choose **Falowen iOS - Free unsigned simulator build** (`falowen-ios-simulator`) and press **Start new build** manually. It deliberately has no automatic push trigger to save free build minutes.
5. On success, inspect the `App.app` artifact. It is an *unsigned iOS Simulator app*, **not** an installable iPhone IPA or App Store release.

The build: installs the repository and web dependencies, builds Vite assets to `web/dist/`, installs pinned Capacitor 8 into `mobile/`, creates `mobile/ios/`, syncs assets, and compiles an unsigned Xcode simulator target. Neither Xcode nor generated files are committed to the main website repository.

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
- **App presentation:** Replace the default generated Capacitor app icon/splash images with proper Falowen artwork; add native-value features as needed so the submission is not just a thin website wrapper.
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
npx cap open ios
```

`mobile/capacitor.config.json` intentionally points to `../web/dist`. The iOS Xcode project is generated and ignored in Git; create it again after cleaning your workspace.

**Status:** CI configuration and wrapper scaffold only. Until Codemagic runs successfully and the native feature checklist is completed, Falowen is **not** a tested, published iOS app.
