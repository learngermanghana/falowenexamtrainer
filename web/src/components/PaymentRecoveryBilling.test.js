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
      "Refresh payment status",
      "Continue payment",
      "Pay balance",
    ].forEach((text) => expect(source).toContain(text));
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
