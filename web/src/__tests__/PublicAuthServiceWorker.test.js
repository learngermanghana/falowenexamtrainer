import fs from "fs";
import path from "path";

describe("authentication routes in the service worker", () => {
  const root = path.resolve(__dirname, "../../..");
  const source = fs.readFileSync(
    path.join(root, "web/public/firebase-messaging-sw.js"),
    "utf8"
  );

  it("keeps account setup routes network-only", () => {
    expect(source).toContain('"/signup"');
    expect(source).toContain('"/login"');
    expect(source).toContain('"/onboarding"');
    expect(source).toContain('"/forgot-password"');
    expect(source).toContain('"/password-reset"');
    expect(source).toContain('"/reset-password"');
    expect(source).toContain('fetch(request, { cache: "no-store" })');
    expect(source).toContain("handleAuthNavigationRequest(request)");
  });

  it("keeps installed apps on cache version 15 or newer", () => {
    const match = source.match(/CACHE_NAME = \`\\\$\{CACHE_PREFIX\}-v(\\d+)\`/);
    expect(match).not.toBeNull();
    expect(Number(match[1])).toBeGreaterThanOrEqual(15);
  });
});
