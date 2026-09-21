import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "..");
const WEB = path.resolve(SRC, "..");
const PUBLIC = path.join(WEB, "public");

const read = (filename) => fs.readFileSync(filename, "utf8");

describe("Falowen public help and AI discovery", () => {
  const help = read(path.join(PUBLIC, "falowen-help.md"));
  const llms = read(path.join(PUBLIC, "llms.txt"));
  const robots = read(path.join(PUBLIC, "robots.txt"));
  const sitemap = read(path.join(PUBLIC, "sitemap.xml"));
  const app = read(path.join(SRC, "App.js"));
  const landing = read(path.join(SRC, "components", "LandingPageSimple.js"));
  const guide = read(path.join(SRC, "components", "PublicStudentGuidePage.js"));

  test("publishes the canonical learner routes in the AI-readable help source", () => {
    [
      "/placement-test",
      "/signup?program=german",
      "/login/",
      "/campus/course",
      "/campus/results",
      "/campus/attendance",
      "/campus/examFile",
      "/exams/overview",
      "/exams/study",
      "/campus/vocab",
      "/campus/account?tab=billing",
    ].forEach((route) => expect(help).toContain(route));
  });

  test("publishes llms discovery links to the official help sources", () => {
    expect(llms).toContain("https://www.falowen.app/help");
    expect(llms).toContain("https://www.falowen.app/falowen-help.md");
  });

  test("does not block OpenAI search or Google Extended from public help", () => {
    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("User-agent: Google-Extended");
    expect(robots).toContain("Allow: /");
  });

  test("keeps the help page discoverable from the sitemap and homepage", () => {
    expect(sitemap).toContain("https://www.falowen.app/help");
    expect(landing).toContain('href: "/help"');
  });

  test("serves the public help route with a canonical /help page", () => {
    expect(app).toContain('location.pathname === "/help"');
    expect(guide).toContain('canonicalPath: "/help"');
    expect(guide).toContain('href="/falowen-help.md"');
  });
});
