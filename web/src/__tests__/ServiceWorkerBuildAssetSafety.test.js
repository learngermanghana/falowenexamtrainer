import fs from "fs";
import path from "path";

const repositoryRoot = path.resolve(__dirname, "../../..");
const serviceWorker = fs.readFileSync(
  path.join(repositoryRoot, "web/public/firebase-messaging-sw.js"),
  "utf8",
);
const viteConfig = fs.readFileSync(
  path.join(repositoryRoot, "web/vite.config.js"),
  "utf8",
);

describe("service worker build asset safety", () => {
  it("serves Vite versioned JavaScript and CSS bundles from the exact build cache", () => {
    expect(serviceWorker).toContain('const VERSIONED_ASSET_PREFIX = "/assets/"');
    expect(serviceWorker).toContain("handleVersionedBuildAssetRequest(request)");
    expect(serviceWorker).toContain("event.respondWith(handleVersionedBuildAssetRequest(request))");
    expect(serviceWorker).not.toContain('const cacheableDestinations = ["style", "script", "image", "font"]');
  });

  it("emits and refreshes a revisioned build manifest after later deployments", () => {
    expect(viteConfig).toContain("createHash('sha256')");
    expect(viteConfig).toContain("JSON.stringify({ revision, assets }, null, 2)");
    expect(serviceWorker).toContain("cachedManifest?.revision === manifest.revision");
    expect(serviceWorker).toContain("refreshBuildAssetPrecache()");
    expect(serviceWorker).toContain("event.waitUntil(");
  });

  it("rejects incomplete build precaches so they can retry", () => {
    expect(serviceWorker).toContain("await Promise.all(");
    expect(serviceWorker).not.toContain("Promise.allSettled");
    expect(serviceWorker).toContain("Failed to refresh build asset precache");
    expect(serviceWorker).toContain("await refreshBuildAssetPrecache({ force: true })");
  });

  it("retains the current and immediately previous build while pruning older chunks", () => {
    expect(serviceWorker).toContain("const pruneObsoleteBuildAssets");
    expect(serviceWorker).toContain("/\\.(?:js|css)$/.test(url.pathname)");
    expect(serviceWorker).toContain("!retainedAssetSet.has(url.pathname)");
    expect(serviceWorker).toContain("cachedManifest?.revision === manifest.revision");
    expect(serviceWorker).toContain("cachedManifest.previousAssets");
    expect(serviceWorker).toContain("(cachedManifest?.assets || [])");
    expect(serviceWorker).toContain("...manifest.assets");
    expect(serviceWorker).toContain("...previousAssets");
    expect(serviceWorker).toContain("JSON.stringify({ ...manifest, previousAssets })");

    const refreshBlock = serviceWorker.slice(
      serviceWorker.indexOf("const refreshBuildAssetPrecache"),
      serviceWorker.indexOf('self.addEventListener("install"'),
    );
    expect(refreshBlock.indexOf("await precacheBuildAssets(cache, manifest.assets)")).toBeLessThan(
      refreshBlock.indexOf("await pruneObsoleteBuildAssets(cache, retainedAssets)")
    );
    expect(refreshBlock.indexOf("await pruneObsoleteBuildAssets(cache, retainedAssets)")).toBeLessThan(
      refreshBlock.indexOf("await cache.put(")
    );
  });

  it("returns successful network responses even when runtime cache writes fail", () => {
    const cacheHandler = serviceWorker.slice(
      serviceWorker.indexOf("const cacheNetworkResponse"),
      serviceWorker.indexOf("const handleAuthNavigationRequest"),
    );

    expect(cacheHandler).toContain("try {");
    expect(cacheHandler).toContain("await cache.put(request, response.clone())");
    expect(cacheHandler).toContain("Failed to cache network response");
    expect(cacheHandler).toContain("return response");
  });

  it("never serves the offline HTML document as a static asset response", () => {
    const staticHandler = serviceWorker.slice(
      serviceWorker.indexOf("const handleStaticRequest"),
      serviceWorker.indexOf('self.addEventListener("fetch"'),
    );

    expect(staticHandler).not.toContain("caches.match(OFFLINE_URL)");
    expect(staticHandler).toContain("return Response.error()");
  });

  it("uses the current offline cache version", () => {
    expect(serviceWorker).toContain('`${CACHE_PREFIX}-v14`');
  });
});
