import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Firebase UID student identity recovery", () => {
  test("resolves the signed-in Firebase UID before falling back to email", () => {
    const source = read("../context/AuthContext.js");

    expect(source).toContain('where("uid", "==", user.uid)');
    expect(source).toContain("fetchStudentProfileByUid(credential.user.uid)");
    expect(source).toContain("authEmail: normalizedEmail");
    expect(source).toContain("profileFromCode.authEmail || profileFromCode.loginEmail || profileFromCode.email");
    expect(source).toContain("diagnostic?.profile?.authEmail || diagnostic?.profile?.loginEmail");

    const googleStart = source.indexOf("const loginWithGoogle");
    const googleEnd = source.indexOf("const refreshUser", googleStart);
    const googleLogin = source.slice(googleStart, googleEnd);

    expect(googleLogin).toContain("fetchStudentProfileByUid(credential.user.uid)");
    expect(googleLogin).toContain("authEmail: email");
    expect(googleLogin).not.toContain("\n        email,\n");
  });

  test("onboarding always exposes a sign-out recovery action", () => {
    const source = read("OnboardingChecklist.js");

    expect(source).toContain('import { useAuth } from "../context/AuthContext"');
    expect(source).toContain("const { logout } = useAuth()");
    expect(source).toContain("onClick={logout}");
    expect(source).toContain("Sign out");
  });
});
