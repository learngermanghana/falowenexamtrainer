import fs from "fs";
import path from "path";

const repositoryRoot = path.resolve(__dirname, "../../..");
const readRepositoryFile = (relativePath) =>
  fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");

describe("public signup deployment routing", () => {
  it("sends signup requests to the React app before checking static files", () => {
    const config = JSON.parse(readRepositoryFile("vercel.json"));

    const signupRouteIndex = config.routes.findIndex(
      (route) => route.src === "/signup/?" && route.dest === "/index.html"
    );
    const filesystemIndex = config.routes.findIndex(
      (route) => route.handle === "filesystem"
    );

    expect(signupRouteIndex).toBeGreaterThanOrEqual(0);
    expect(filesystemIndex).toBeGreaterThanOrEqual(0);
    expect(signupRouteIndex).toBeLessThan(filesystemIndex);
  });

  it("does not ship a static signup page that redirects away from the form", () => {
    expect(
      fs.existsSync(path.join(repositoryRoot, "web/public/signup/index.html"))
    ).toBe(false);
  });

  it("does not auto-find and click signup buttons from the HTML shell", () => {
    const html = readRepositoryFile("web/public/index.html");

    expect(html).not.toContain("falowen:auto-open-signup");
    expect(html).not.toContain("tryOpenSignup");
    expect(html).not.toContain("button.falowen-home-primary");
  });

  it("does not load AdSense globally before the route is known", () => {
    const html = readRepositoryFile("web/public/index.html");

    expect(html).not.toContain("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  });

  it("keeps signup and login navigation responses out of the offline cache", () => {
    const serviceWorker = readRepositoryFile("web/public/firebase-messaging-sw.js");

    expect(serviceWorker).toContain('new Set(["/signup", "/login"])');
    expect(serviceWorker).toContain("handleAuthNavigationRequest");
    expect(serviceWorker).toContain("isPublicAuthPath(requestUrl.pathname)");
    expect(serviceWorker).toContain('fetch(request, { cache: "no-store" })');
  });
});
