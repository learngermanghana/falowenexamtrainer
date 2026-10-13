import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";

const webRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(webRoot, "..");
const generator = path.join(webRoot, "scripts/generate-a1-public-seo.mjs");
let fixtureDir;

beforeAll(() => {
  fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a1-seo-"));
  fs.copyFileSync(path.join(webRoot, "index.html"), path.join(fixtureDir, "index.html"));
  const result = spawnSync(process.execPath, [generator, fixtureDir], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
});

afterAll(() => {
  if (fixtureDir) fs.rmSync(fixtureDir, { recursive: true, force: true });
});

test("A1 public SEO pages have canonical metadata and real readable practice without JavaScript", () => {
  for (const [file, canonical, title] of [
    ["goethe-a1-preparation.html", "/goethe-a1-preparation", "Goethe A1 Practice Materials with Answers"],
    ["exam-practice-a1.html", "/exam-practice/a1", "Free Goethe A1 Exam Practice"]
  ]) {
    const html = fs.readFileSync(path.join(fixtureDir, "__seo", file), "utf8");
    expect(html).toContain('<link rel="canonical" href="https://www.falowen.app' + canonical + '"');
    expect(html).toContain('<meta property="og:url" content="https://www.falowen.app' + canonical + '"');
    expect(html).toContain("<title>" + title);
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('class="a1-seo-fallback"');
    expect(html).toContain("Wann beginnt der Flohmarkt?");
    expect(html).toContain("Show a model message");
    expect(html).toContain('href="/exam-practice/a1"');
    expect(html).not.toContain('<h1 id="falowen-startup-title">');
    expect(html).toContain('<div id="root">');
  }
});

test("builds these exact public routes and preserves protected exam noindex policy", () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, "vercel.json"), "utf8"));
  expect(vercel.routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: "/goethe-a1-preparation/?", dest: "/__seo/goethe-a1-preparation.html" }),
    expect.objectContaining({ src: "/exam-practice/a1/?", dest: "/__seo/exam-practice-a1.html" })
  ]));
  expect(vercel.headers).toEqual(expect.arrayContaining([
    expect.objectContaining({ source: "/exams/:path*", headers: expect.arrayContaining([
      expect.objectContaining({ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" })
    ]) })
  ]));
  const pkg = JSON.parse(fs.readFileSync(path.join(webRoot, "package.json"), "utf8"));
  expect(pkg.scripts.postbuild).toBe("node scripts/generate-a1-public-seo.mjs");
});

test("A1 landing and public Lesen route are already in sitemap", () => {
  const sitemap = fs.readFileSync(path.join(webRoot, "public/sitemap.xml"), "utf8");
  expect(sitemap).toContain("<loc>https://www.falowen.app/goethe-a1-preparation</loc>");
  expect(sitemap).toContain("<loc>https://www.falowen.app/exam-practice/a1</loc>");
});
