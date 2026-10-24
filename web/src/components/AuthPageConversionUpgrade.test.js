import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("Falowen auth conversion upgrades", () => {
  test("signup clearly supports trial-first or immediate payment", () => {
    const signup = read("SignUpPageLegacy.js");
    expect(signup).toContain("Create account & start 7-day trial");
    expect(signup).toContain("Start your 7-day trial without payment, or pay immediately after signup if you prefer.");
    expect(signup).toContain("You can explore before payment or pay right away if you prefer.");
    expect(signup).toContain("Your 7-day Falowen trial is active now");
  });

  test("signup exposes placement help and a direct learning handoff", () => {
    const signup = read("SignUpPageLegacy.js");
    expect(signup).toContain('href="/placement-test"');
    expect(signup).toContain("Not sure of your level? Take the placement test");
    expect(signup).toContain("Your Falowen account is ready");
    expect(signup).toContain('window.location.href = "/campus"');
  });

  test("password visibility is inline instead of a floating mobile control", () => {
    const signup = read("SignUpPageLegacy.js");
    const wrapper = read("SignUpPage.js");
    expect(signup).toContain('type={showPasswords ? "text" : "password"}');
    expect(wrapper).not.toContain("signup-password-visibility");
    expect(wrapper).not.toContain("passwordFieldActive");
  });

  test("login uses a normal returning-student message", () => {
    const auth = read("AuthGate.js");
    expect(auth).toContain("Welcome back");
    expect(auth).toContain("continue from where you stopped");
    expect(auth).not.toContain("Use your existing email and choose a new password");
  });
});
