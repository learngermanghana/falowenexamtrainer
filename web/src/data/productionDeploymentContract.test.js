import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "..");

describe("production deployment contract", () => {
  test("production builds run critical checks and stamp a build identity", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    expect(pkg.scripts.build).toContain("gate:production");
    expect(pkg.scripts.build).toContain("generate:build-identity");
    expect(pkg.scripts["generate:build-identity"]).toContain("writeBuildIdentity.mjs");
  });

  test("the live build identity cannot be cached", () => {
    const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
    const identity = config.headers.find((entry) => entry.source === "/__falowen-build.json");
    expect(identity).toBeTruthy();
    expect(identity.headers).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "Cache-Control", value: expect.stringMatching(/no-store/) }),
    ]));
    expect(config.git?.deploymentEnabled?.main).toBe(true);
    expect(config.git?.deploymentEnabled?.["*"]).toBe(false);
  });

  test("production health workflow verifies the live SHA", () => {
    const workflow = fs.readFileSync(path.join(root, ".github/workflows/production-release.yml"), "utf8");
    expect(workflow).toMatch(/branches:\s*\n\s*- main/);
    expect(workflow).toContain("npm run build");
    expect(workflow).toContain("VERCEL_PROJECT_ID");
    expect(workflow).toContain("vercel@latest deploy --prebuilt --prod");
    expect(workflow).toContain("/api/deployment-status");
    expect(workflow).toContain("checkProductionIdentity.mjs");
    expect(workflow).toContain("EXPECTED_SHA");
  });

  test("the production API reports the deployed Vercel SHA against main", () => {
    const api = fs.readFileSync(path.join(root, "api/index.js"), "utf8");
    expect(api).toContain("deployment-status");
    expect(api).toContain("VERCEL_GIT_COMMIT_SHA");
    expect(api).toContain("falowenexamtrainer");
    expect(api).toContain("commits/main");
  });
});
