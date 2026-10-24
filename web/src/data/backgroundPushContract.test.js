import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "..");

describe("background push contract", () => {
  test("messaging service worker initializes Firebase on a cold start", () => {
    const worker = fs.readFileSync(
      path.join(process.cwd(), "public", "firebase-messaging-sw.js"),
      "utf8"
    );
    expect(worker).toContain('importScripts("/__falowen-firebase-config.js")');
    expect(worker).toContain("initializeMessaging(self.__FALOWEN_FIREBASE_CONFIG__)");
    expect(worker).toContain("messaging.onBackgroundMessage");
    expect(worker).toContain("if (payload?.notification) return;");
  });

  test("production build emits a Firebase config file for the service worker", () => {
    const buildIdentity = fs.readFileSync(
      path.join(root, "scripts", "writeBuildIdentity.mjs"),
      "utf8"
    );
    expect(buildIdentity).toContain("__falowen-firebase-config.js");
    expect(buildIdentity).toContain("REACT_APP_FIREBASE_API_KEY");
    expect(buildIdentity).toContain("REACT_APP_FIREBASE_MESSAGING_SENDER_ID");
    expect(buildIdentity).toContain("REACT_APP_FIREBASE_APP_ID");
  });

  test("messaging worker and bootstrap config bypass browser caches", () => {
    const firebaseClient = fs.readFileSync(
      path.join(process.cwd(), "src", "firebase.js"),
      "utf8"
    );
    expect(firebaseClient).toContain('updateViaCache: "none"');

    const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
    for (const source of [
      "/firebase-messaging-sw.js",
      "/__falowen-firebase-config.js",
    ]) {
      const header = config.headers.find((entry) => entry.source === source);
      expect(header).toBeTruthy();
      expect(header.headers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: "Cache-Control",
            value: expect.stringMatching(/no-store/),
          }),
        ])
      );
    }
  });

  test("students can verify the current device with a delayed backend push", () => {
    const settings = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "NotificationSettingsCard.js"),
      "utf8"
    );
    expect(settings).toContain("Send test notification");
    expect(settings).toContain("sendPushTestNotification");
    expect(settings).toContain("delaySeconds: 8");

    const functionsIndex = fs.readFileSync(
      path.join(root, "functions", "index.js"),
      "utf8"
    );
    expect(functionsIndex).toContain("exports.sendPushTestNotification = onCall");
    expect(functionsIndex).toContain("findOwnedMessagingToken");
    expect(functionsIndex).toContain("Background push is working on this device.");

    const deployWorkflow = fs.readFileSync(
      path.join(root, ".github", "workflows", "deploy-functions.yml"),
      "utf8"
    );
    expect(deployWorkflow).toContain("functions:falowenexamtrainer:sendPushTestNotification");
    expect(deployWorkflow).toContain("Push test callable export was not discovered");
    expect(settings).toContain("getPushTestErrorMessage");
    expect(settings).not.toContain("? error.message\n          : \"Could not send the background push test");
  });
  test("iPhone push setup is gated by the installed Home Screen context", () => {
    const firebaseClient = fs.readFileSync(
      path.join(process.cwd(), "src", "firebase.js"),
      "utf8"
    );
    const authContext = fs.readFileSync(
      path.join(process.cwd(), "src", "context", "AuthContext.js"),
      "utf8"
    );
    const settings = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "NotificationSettingsCard.js"),
      "utf8"
    );
    const manifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "public", "manifest.json"), "utf8")
    );

    expect(firebaseClient).toContain("const getPushEnvironment = () =>");
    expect(firebaseClient).toContain("environment.ios && !environment.standalone");
    expect(firebaseClient.indexOf("ensureNotificationPermission()")).toBeLessThan(
      firebaseClient.indexOf("isSupported().catch")
    );
    expect(authContext).toContain("if (!pushEnvironment.notificationApi)");
    expect(settings).toContain("Home Screen app");
    expect(settings).toContain("Web Push unavailable");
    expect(manifest.display).toBe("standalone");
    expect(manifest.id).toBe("/");
  });

});
