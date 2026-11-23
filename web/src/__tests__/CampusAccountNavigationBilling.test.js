import fs from "fs";
import path from "path";

const source = relativePath => fs.readFileSync(
  path.resolve(__dirname, "../", relativePath),
  "utf8",
);

const navigationPatch = fs.readFileSync(
  path.resolve(__dirname, "../../../scripts/patchCompactStudentNavigation.mjs"),
  "utf8",
);
const account = source("components/AccountSettings.js");
const tuitionCard = source("components/TuitionStatusCardLegacy.js");
const navigationMap = JSON.parse(source("../public/falowen-navigation.json"));

describe("Account navigation and balance-aware billing", () => {
  test("the main Campus menu has an Account destination before Falowen Home", () => {
    const accountEntry = '{ key: "account", label: "Account", route: "/campus/account", enabled: true }';
    const homeEntry = '{ key: "home", label: "Falowen Home", route: "/", enabled: true }';
    expect(navigationPatch).toContain(accountEntry);
    expect(navigationPatch.indexOf(accountEntry)).toBeLessThan(navigationPatch.indexOf(homeEntry));
    expect(navigationPatch).toContain(
      'if (item.key === "account") return location.pathname.startsWith("/campus/account");'
    );
    expect(navigationPatch).toContain(
      '["vocab", "books", "classMembers", "account", "home"].includes(item.key)'
    );
    expect(navigationPatch).toContain("prebuild re-runs this script on patched trees");
    expect(navigationPatch).toContain("Earlier Campus builds may still be running");
  });

  test("student navigation guide links directly to the authenticated Account page", () => {
    const entry = navigationMap.navigation.find(item => item.id === "account");
    expect(entry).toEqual(expect.objectContaining({
      label: "Account",
      route: "/campus/account",
      requiresLogin: true,
    }));
  });

  test("Billing keeps the summary and history but does not prompt already-paid or zero-balance students", () => {
    expect(account).toContain('const paymentCleared = normalizedPaymentStatus === "paid" || hasClearedBalance(balanceDue);');
    expect(account).toContain("shouldOfferTuitionPayment({ balanceDue, paymentCleared })");
    expect(account).toContain("{hasOutstandingTuition ? (");
    expect(account).toContain("data-account-billing-summary");
    expect(account).toContain("Transaction history");
    expect(tuitionCard).toContain("{maxPayable <= 0 ? null");
    expect(account).toContain('paymentPurpose="level_upgrade"');
  });
});
