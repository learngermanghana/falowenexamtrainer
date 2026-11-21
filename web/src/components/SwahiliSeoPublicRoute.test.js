import fs from "fs";
import path from "path";

const webRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(webRoot, "..");

test("Swahili public page is crawlable and has canonical, educational content and schema", () => {
  const html = fs.readFileSync(path.join(webRoot, "public/__seo/swahili.html"), "utf8");
  expect(html).toContain('<link rel="canonical" href="https://www.falowen.app/learn-swahili">');
  expect(html).toContain("Learn Swahili online in Ghana and across Africa");
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain('href="/signup?program=swahili"');
  expect(html).toContain('href="/placement-test?language=swahili"');
  expect(html).not.toContain('href="/placement-test?program=swahili"');
  expect(html).toContain("Dr. Ruth Ndekiro Shao");
  expect(html).not.toContain("enable JavaScript to run");
});

test("Swahili static route precedes fallback, is sitemap listed and keeps German routes", () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, "vercel.json"), "utf8"));
  const swahili = vercel.routes.findIndex(route => route.src === "/learn-swahili/?");
  const german = vercel.routes.findIndex(route => route.src === "/goethe-a1-preparation/?");
  expect(swahili).toBeGreaterThanOrEqual(0);
  expect(swahili).toBeLessThan(german);
  expect(vercel.routes[swahili].dest).toBe("/__seo/swahili.html");
  const sitemap = fs.readFileSync(path.join(webRoot, "public/sitemap.xml"), "utf8");
  expect(sitemap).toContain("<loc>https://www.falowen.app/learn-swahili</loc>");
  expect(sitemap).toContain("<loc>https://www.falowen.app/learn-german-ghana</loc>");
  const homepage = fs.readFileSync(path.join(webRoot, "index.html"), "utf8");
  expect(homepage).toContain("Falowen Kiswahili A1 Course");
});
