import fs from "fs";
import path from "path";

const read = (name) =>
  fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Next-level preview upgrade routing", () => {
  test("routes preview upgrade CTAs into the Account upgrade flow", () => {
    const preview = read("NextLevelPreviewPage.js");

    expect(preview).toContain('const upgradeHref = "/campus/account?tab=upgrade";');
    expect(preview).not.toContain("/classes/?level=");
  });

  test("Account honors the upgrade tab query parameter", () => {
    const account = read("AccountSettings.js");

    expect(account).toContain('new URLSearchParams(window.location.search).get("tab")');
    expect(account).toContain('["studentData", "notifications", "billing", "upgrade"].includes(requestedTab)');
  });
});
