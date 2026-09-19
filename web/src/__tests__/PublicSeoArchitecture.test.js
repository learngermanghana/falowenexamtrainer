import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), "utf8");

describe("public SEO architecture", () => {
  const app = read("App.js");
  const levelPage = read("components/GermanLevelSeoPage.js");
  const marketPage = read("components/SeoLandingPage.js");
  const home = read("components/LandingPageSimple.js");
  const indexHtml = fs.readFileSync(path.resolve(root, "../index.html"), "utf8");
  const sitemap = fs.readFileSync(path.resolve(root, "../public/sitemap.xml"), "utf8");
  const robots = fs.readFileSync(path.resolve(root, "../public/robots.txt"), "utf8");

  test("publishes A1-C2 course and exam landing routes before authentication", () => {
    expect(app).toContain("/^\\/learn-german-(a1|a2|b1|b2|c1|c2)");
    expect(app).toContain("/^\\/goethe-(a1|a2|b1|b2|c1|c2)-preparation");
    expect(app).toContain("<GermanLevelSeoPage");
    expect(levelPage).toContain('"@type": "Course"');
    expect(levelPage).toContain('"@type": "LearningResource"');
    expect(levelPage).toContain("Falowen is an independent learning platform");
  });

  test("uses A1-C2 in the homepage and country SEO copy", () => {
    expect(indexHtml).toContain("Learn German A1–C2 Online");
    expect(indexHtml).toContain('"educationalLevel": ["A1", "A2", "B1", "B2", "C1", "C2"]');
    expect(home).toContain("German A1–C2");
    expect(marketPage).toContain("A1 to C2");
    expect(marketPage).toContain("A1-C2 German Classes");
  });

  test("indexes public SEO pages instead of authenticated Campus and Exam routes", () => {
    ["a1", "a2", "b1", "b2", "c1", "c2"].forEach((level) => {
      expect(sitemap).toContain(`/learn-german-${level}`);
      expect(sitemap).toContain(`/goethe-${level}-preparation`);
    });
    expect(sitemap).not.toContain("/campus/");
    expect(sitemap).not.toContain("/exams/");
    expect(robots).toContain("Disallow: /campus/");
    expect(robots).toContain("Disallow: /exams/");
  });

  test("keeps strong internal links between the homepage, levels and exam preparation", () => {
    expect(home).toContain("/learn-german-");
    expect(home).toContain("/goethe-");
    expect(marketPage).toContain("/learn-german-");
    expect(marketPage).toContain("/goethe-");
  });
});
