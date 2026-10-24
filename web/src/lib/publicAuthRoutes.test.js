import {
  isPublicAuthPath,
  normalizePublicPath,
} from "./publicAuthRoutes";

describe("public auth route helpers", () => {
  it("recognizes signup and login with or without trailing slashes", () => {
    expect(isPublicAuthPath("/signup")).toBe(true);
    expect(isPublicAuthPath("/signup/")).toBe(true);
    expect(isPublicAuthPath("/login")).toBe(true);
    expect(isPublicAuthPath("/login/")).toBe(true);
  });

  it("does not classify the landing page or campus as public auth", () => {
    expect(isPublicAuthPath("/")).toBe(false);
    expect(isPublicAuthPath("/campus/course")).toBe(false);
  });

  it("normalizes empty and repeated trailing slashes", () => {
    expect(normalizePublicPath("")).toBe("/");
    expect(normalizePublicPath("/signup///")).toBe("/signup");
  });
});
