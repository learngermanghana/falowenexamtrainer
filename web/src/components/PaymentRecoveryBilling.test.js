import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("payment recovery billing flow", () => {
  test("account billing exposes explicit payment states", () => {
    const source = read("AccountSettings.js");
    [
      "Trial active",
      "Payment pending",
      "Part payment received",
      "Paid",
      "Payment needs attention",
      "Continue payment",
      "Pay balance",
    ].forEach((text) => expect(source).toContain(text));
    expect(source).toContain("handleRefreshPaymentStatus");
  });

  test("billing uses a compact two-column summary without a duplicate status card", () => {
    const source = read("AccountSettings.js");
    expect(source).toContain("data-account-billing-summary");
    expect(source).toContain('gridTemplateColumns: "repeat(2, minmax(0, 1fr))"');
    expect(source).toContain(">Tuition<");
    expect(source).toContain(">Paid<");
    expect(source).toContain(">Balance<");
    expect(source).toContain('"Trial ends" : "Access until"');
    expect(source).not.toContain(">Payment status<");
    expect(source).toContain("showSummary={false}");
  });

  test("billing hides empty contract detail rows and collapses transaction history", () => {
    const source = read("AccountSettings.js");
    expect(source).toContain("studentProfile?.contractStart || studentProfile?.contractEnd");
    expect(source).toContain("Course access details");
    expect(source).toContain("Transaction history{transactionHistory.length > 0");
    expect(source).toContain("transactionHistory.map((tx, index)");
    expect(source).not.toContain("transactionHistory.slice(0, 2)");
  });

  test("billing uses trial expiry when there is no contract end", () => {
    const source = read("AccountSettings.js");
    expect(source).toContain("Number.isFinite(trialLifecycle.endsAtMs)");
    expect(source).toContain("formatDate(accessUntil)");
  });

  test("transaction history sorts raw timestamps before rendering", () => {
    const source = read("AccountSettings.js");
    expect(source).toContain("const timestamp = toDateMs(rawDate)");
    expect(source).toContain("timestamp: Number.isFinite(timestamp) ? timestamp : 0");
    expect(source).toContain(".sort((a, b) => b.timestamp - a.timestamp)");
    expect(source).toContain("transactionHistory.map((tx, index)");
  });

  test("compact payment panel removes repeated trial warning and duplicate balance button", () => {
    const source = read("TuitionStatusCardLegacy.js");
    expect(source).toContain("showSummary && paymentGraceNotice");
    expect(source).toContain('background: "transparent"');
    expect(source).toContain('width: "100%"');
    expect(source).toContain("Paystack fee share");
    expect(source).not.toContain('t("accountSettings.tuition.payOutstanding"');
  });

  test("trial copy uses the 30-day recovery window instead of seven-day deletion", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../i18n/locales/en/translation.json"),
      "utf8"
    );
    expect(source).toContain("30-day recovery window");
    expect(source).not.toContain("student data will be deleted after 7 days");
  });

  test("refresh payment status re-fetches the student Firestore profile", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../context/AuthContext.js"), "utf8");
    expect(source).toContain("const refreshStudentProfile = useCallback");
    expect(source).toContain('getDoc(doc(db, "students", studentProfile.id))');
    expect(source).toContain("refreshStudentProfile,");
  });

  test("opening Paystack stores a local pending attempt without changing paid status", () => {
    const source = read("TuitionStatusCardLegacy.js");
    expect(source).toContain("savePaymentAttempt(studentProfile");
    expect(source).toContain("window.location.assign(url)");
    expect(source).not.toContain('paymentStatus: "paid"');
  });

  test("stale interrupted checkout markers expire after 24 hours", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../lib/paymentAttempt.js"), "utf8");
    expect(source).toContain("24 * 60 * 60 * 1000");
    expect(source).toContain("MAX_ATTEMPT_AGE_MS");
    expect(source).toContain("localStorage.removeItem");
  });

  test("payment return copy does not claim confirmation before webhook state updates", () => {
    const source = read("PaymentComplete.js");
    expect(source).toContain("Payment submitted");
    expect(source).toContain("only after Paystack confirmation");
    expect(source).toContain("/campus/account?tab=billing&payment=return");
    expect(source).not.toContain("Payment received");
  });
});
