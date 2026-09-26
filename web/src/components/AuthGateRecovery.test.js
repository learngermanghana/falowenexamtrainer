import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "AuthGate.js"), "utf8");

describe("login recovery actions", () => {
  test("maps credential failures to password reset", () => {
    expect(source).toContain('"auth/password-mismatch"');
    expect(source).toContain('kind: "reset"');
    expect(source).toContain("Reset password");
  });

  test("maps payment and contract failures to payment or renewal recovery", () => {
    expect(source).toContain('"auth/payment-status-blocked"');
    expect(source).toContain('"auth/contract-ended"');
    expect(source).toContain('kind: paystackLink ? "payment" : "support"');
    expect(source).toContain("Continue payment");
    expect(source).toContain("Renew your access");
  });

  test("maps inactive and blocked accounts to support", () => {
    expect(source).toContain('"auth/account-inactive"');
    expect(source).toContain('"auth/user-disabled"');
    expect(source).toContain('"auth/student-access-blocked"');
    expect(source).toContain("Contact support");
  });

  test("student-code lookup failure suggests email login", () => {
    expect(source).toContain('kind: "email"');
    expect(source).toContain("Try your email address");
    expect(source).toContain("Use email login");
  });

  test("new-user not-found recovery can create an account", () => {
    expect(source).toContain('kind: "signup"');
    expect(source).toContain("No account found");
    expect(source).toContain("Create account");
  });

  test("recovery is reset when the identifier changes", () => {
    expect(source).toContain("setRecoveryAction(null)");
    expect(source).toContain('aria-label="Login recovery"');
  });
});
