const { absolutePushLink } = require("../../pushLinks");

describe("push notification click links", () => {
  test("converts course routes into HTTPS links required by FCM", () => {
    expect(absolutePushLink("/campus/account")).toBe("https://www.falowen.app/campus/account");
    expect(absolutePushLink("/campus/course?day=17")).toBe("https://www.falowen.app/campus/course?day=17");
  });

  test("keeps click destinations on the Falowen origin", () => {
    expect(absolutePushLink("https://www.falowen.app/campus/account")).toBe("https://www.falowen.app/campus/account");
    expect(absolutePushLink("//example.com")).toBe("https://www.falowen.app/campus/account");
  });
});
