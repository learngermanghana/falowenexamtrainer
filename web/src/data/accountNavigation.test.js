import fs from "fs";
import path from "path";

describe("Account navigation", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "components", "AccountSettings.js"),
    "utf8"
  );

  test("Delete account is a navigable sub-tab, not a card shown under all tabs", () => {
    expect(source).toContain('"upgrade", "deleteAccount"].includes(requestedTab)');
    expect(source).toContain('{ key: "deleteAccount", label: "Delete account" }');
    expect(source).toContain('{activeTab === "deleteAccount" ? <AccountDeletionCard /> : null}');
    expect(source).not.toMatch(/^\s*<AccountDeletionCard \/>\s*$/m);
  });

  test("the existing deletion safeguards are still delegated to the deletion card", () => {
    expect(source).toContain('import { AccountDeletionCard } from "./AccountDeletion"');
  });
});
