const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const read = (path) => readFileSync(join(__dirname, "..", path), "utf8");

test("only the public build manifest receives a short browser HTTP cache", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const manifest = vercel.headers.find(row => row.source === "/offline-build-assets.json");
  assert.ok(manifest);
  const caching = manifest.headers.find(row => row.key.toLowerCase() === "cache-control");
  assert.equal(caching.value, "public, max-age=300, must-revalidate");
  assert.ok(!vercel.headers.some(row => row.source === "/api/(.*)" && /public|max-age/.test(JSON.stringify(row.headers))));
});

test("private exam saves continue to reach the authenticated API router unchanged", () => {
  const vercel = JSON.parse(read("vercel.json"));
  assert.ok(vercel.routes.some(row => row.src === "/api/(.*)" && row.dest === "/api/index.js"));
  const api = read("api/index.js");
  assert.match(api, /return app\(req, res\)/);
  const service = read("web/src/services/a1FinalMockService.js");
  assert.match(service, /\/a1-mock\/attempt\/save/);
  assert.match(service, /Authorization/);
  // Do not cache or suppress ongoing A1 mock progress while reducing GET traffic.
});

test("both document and worker manifest lookups are throttled, and offline precaching remains", () => {
  const page = read("web/src/serviceWorkerRegistration.js");
  const worker = read("web/public/firebase-messaging-sw.js");
  assert.match(page, /BUILD_REVISION_CHECK_INTERVAL_MS = 30 \* 60 \* 1000/);
  assert.match(page, /BUILD_REVISION_CHECK_MIN_GAP_MS = 10 \* 60 \* 1000/);
  assert.match(page, /document.visibilityState === "hidden"/);
  assert.match(page, /checkForNewBuildWhenDue/);
  assert.match(worker, /BUILD_MANIFEST_RECHECK_MS = 30 \* 60 \* 1000/);
  assert.match(worker, /refreshBuildPrecacheWhenDue/);
  assert.match(worker, /await precacheBuildAssets\(cache, manifest.assets\)/);
  assert.match(worker, /await refreshBuildAssetPrecache\(\{ force: true \}\)/);
});
