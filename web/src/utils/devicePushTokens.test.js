import {
  getMessagingTokenForDevice,
  mergeMessagingTokenForDevice,
  removeMessagingTokenForDevice,
} from "./devicePushTokens";

describe("device push tokens", () => {
  const desktop = { deviceId: "desktop", token: "desktop-token", platform: "Win32", lastSeen: "old" };
  const phone = { deviceId: "phone", token: "phone-token", platform: "iPhone", lastSeen: "now" };

  test("never treats another device's legacy token as the phone token", () => {
    expect(getMessagingTokenForDevice({ messagingToken: "desktop-token", messagingTokens: [desktop] }, "phone")).toBeNull();
    expect(getMessagingTokenForDevice({ messagingToken: "desktop-token", messagingTokens: [desktop, phone] }, "phone")).toBe("phone-token");
  });

  test("adding a phone preserves an existing desktop token", () => {
    const tokens = mergeMessagingTokenForDevice([desktop], phone);
    expect(tokens).toEqual([desktop, phone]);
  });

  test("refreshing a device replaces only its own token and removes duplicate token ownership", () => {
    const tokens = mergeMessagingTokenForDevice([desktop, phone], { ...phone, token: "new-phone-token" });
    expect(tokens).toHaveLength(2);
    expect(getMessagingTokenForDevice({ messagingTokens: tokens }, "desktop")).toBe("desktop-token");
    expect(getMessagingTokenForDevice({ messagingTokens: tokens }, "phone")).toBe("new-phone-token");
  });

  test("signing out on phone retains desktop token", () => {
    expect(removeMessagingTokenForDevice([desktop, phone], "phone", "phone-token")).toEqual([desktop]);
  });
});
