import { areSameContactNumber } from "./signupContactValidation";

describe("student and emergency contact validation", () => {
  test("rejects identical Ghana numbers in local, spaced, + and 00 forms", () => {
    expect(areSameContactNumber("024 123 4567", "+233241234567", "GH")).toBe(true);
    expect(areSameContactNumber("+233241234567", "00233 24 123 4567", "GH")).toBe(true);
    expect(areSameContactNumber("0241234567", "024 123 4567", "GH")).toBe(true);
  });

  test("compares international learners' contacts without assuming Ghana", () => {
    expect(areSameContactNumber("0803 123 4567", "+2348031234567", "NG")).toBe(true);
    expect(areSameContactNumber("9123456789", "+919123456789", "IN")).toBe(true);
    expect(areSameContactNumber("2685550123", "+12685550123", "AG")).toBe(true);
  });

  test("allows real distinct numbers and ignores incomplete inputs", () => {
    expect(areSameContactNumber("024 123 4567", "020 987 6543", "GH")).toBe(false);
    expect(areSameContactNumber("024 123 4567", "", "GH")).toBe(false);
    expect(areSameContactNumber("024 123 4567", "123", "GH")).toBe(false);
  });
});
