import fs from "fs";
import path from "path";

const repositoryRoot = path.resolve(__dirname, "../../..");
const serviceWorker = fs.readFileSync(
  path.join(repositoryRoot, "web/public/firebase-messaging-sw.js"),
  "utf8",
);

describe("service worker build asset safety", () => {
  it("does not intercept Vite versioned JavaScript and CSS bundles", () => {
    expect(serviceWorker).toContain('const VERSIONED_ASSET_PREFIX = "/assets/"');
    expect(serviceWorker).toContain("isVersionedBuildAsset(requestUrl)");
    expect(serviceWorker).toContain("return;");
    expect(serviceWorker).not.toContain('const cacheableDestinations = ["style", "script", "image", "font"]');
  });

  it("never serves the offline HTML document as a static asset response", () => {
    const staticHandler = serviceWorker.slice(
      serviceWorker.indexOf("const handleStaticRequest"),
      serviceWorker.indexOf('self.addEventListener("fetch"'),
    );

    expect(staticHandler).not.toContain("caches.match(OFFLINE_URL)");
    expect(staticHandler).toContain("return Response.error()");
  });

  it("bumps the offline cache to replace older controlling workers", () => {
    expect(serviceWorker).toContain('`${CACHE_PREFIX}-v13`');
  });
});
