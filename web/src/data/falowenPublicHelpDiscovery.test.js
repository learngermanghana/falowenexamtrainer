import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "..");
const WEB = path.resolve(SRC, "..");
const PUBLIC = path.join(WEB, "public");
const ROOT = path.resolve(WEB, "..");

const read = (filename) => fs.readFileSync(filename, "utf8");

describe("Falowen public help and AI discovery", () => {
  const help = read(path.join(PUBLIC, "falowen-help.md"));
  const llms = read(path.join(PUBLIC, "llms.txt"));
  const navigation = JSON.parse(read(path.join(PUBLIC, "falowen-navigation.json")));
  const robots = read(path.join(PUBLIC, "robots.txt"));
  const sitemap = read(path.join(PUBLIC, "sitemap.xml"));
  const app = read(path.join(SRC, "App.js"));
  const landing = read(path.join(SRC, "components", "LandingPageSimple.js"));
  const guide = read(path.join(SRC, "components", "PublicStudentGuidePage.js"));
  const studyBuddy = read(path.join(SRC, "services", "studyBuddyService.js"));
  const backendApp = read(path.join(ROOT, "functions", "functionz", "app.js"));
  const compactNavigationPatch = read(path.join(ROOT, "scripts", "patchCompactStudentNavigation.mjs"));

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
    expect(llms).toContain("https://www.falowen.app/falowen-navigation.json");
  });

  test("publishes structured intent routes, aliases, state rules and deprecated labels", () => {
    expect(navigation.sourceOfTruth.structuredNavigation).toBe("https://www.falowen.app/falowen-navigation.json");
    expect(navigation.navigation.find((item) => item.id === "course-book")).toMatchObject({
      label: "Learn → Course Book",
      route: "/campus/course",
    });
    expect(navigation.intentRoutes.some((item) => item.intent === "submit teacher-marked work")).toBe(true);
    expect(navigation.accessStates.some((item) => item.state === "radio-gated")).toBe(true);
    expect(navigation.deprecatedLabels).toEqual(expect.arrayContaining(["My Library", "Learning Hub", "My Hub", "My Course", "Falowen AI", "Discussion"]));
  });

  test("documents the exact current Learn to Course Book path and rejects invented labels", () => {
    [help, llms, guide].forEach((source) => {
      expect(source).toContain("Learn");
      expect(source).toContain("Course Book");
      expect(source).toContain("/campus/course");
      expect(source).toContain("My Library");
      expect(source).toContain("Learning Hub");
      expect(source).toContain("My Hub");
    });
    expect(compactNavigationPatch).toContain('label: "Learn"');
    expect(compactNavigationPatch).toContain('route: "/campus/course"');
  });

  test("keeps both Study Buddy prompt layers aligned with Falowen navigation support", () => {
    [studyBuddy, backendApp].forEach((source) => {
      expect(source).toContain("FALOWEN NAVIGATION SUPPORT (authoritative)");
      expect(source).toContain("https://www.falowen.app/campus/course");
      expect(source).toContain("My Library");
      expect(source).toContain("Learning Hub");
      expect(source).toContain("My Hub");
    });
    expect(studyBuddy).toContain("Falowen navigation/support questions are not unrelated");
    expect(backendApp).toContain("Falowen navigation/support questions are NEVER off-topic");
  });

  test("does not block OpenAI search or Google Extended from public help", () => {
    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("User-agent: Google-Extended");
    expect(robots).toContain("Allow: /");
  });

  test("keeps only the canonical help page in the sitemap and links it from the homepage", () => {
    expect(sitemap).toContain("https://www.falowen.app/help");
    expect(sitemap).not.toContain("https://www.falowen.app/learn-german-ghana/falowen-guide");
    expect(landing).toContain('href: "/help"');
  });

  test("serves canonical /help and redirects the legacy guide route", () => {
    expect(app).toContain('location.pathname === "/help"');
    expect(app).toContain('location.pathname === "/learn-german-ghana/falowen-guide"');
    expect(app).toContain('<Navigate to="/help" replace />');
    expect(guide).toContain('canonicalPath: "/help"');
    expect(guide).toContain('href="/falowen-help.md"');
    expect(guide).toContain('href="/falowen-navigation.json"');
  });
});
