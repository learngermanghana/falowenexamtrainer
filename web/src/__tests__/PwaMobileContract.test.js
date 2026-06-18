import fs from "fs";
import path from "path";

const readPublicFile = (name) =>
  fs.readFileSync(path.join(process.cwd(), "public", name), "utf8");

describe("iPhone PWA contract", () => {
  it("enables viewport safe areas and Apple standalone mode", () => {
    const html = readPublicFile("index.html");

    expect(html).toContain("viewport-fit=cover");
    expect(html).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(html).toContain('name="apple-mobile-web-app-status-bar-style"');
  });

  it("opens all standalone routes inside the Falowen app scope", () => {
    const manifest = JSON.parse(readPublicFile("manifest.json"));

    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.display).toBe("standalone");
  });
});
