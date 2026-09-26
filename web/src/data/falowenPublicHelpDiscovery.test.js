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
  const courseMap = JSON.parse(read(path.join(PUBLIC, "falowen-course-map.json")));
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
    expect(llms).toContain("https://www.falowen.app/falowen-course-map.json");
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

  test("publishes the generated A1-C2 lesson map with exact level rules", () => {
    expect(courseMap.counts).toMatchObject({ A1: 29, A2: 29, B1: 29, B2: 29, C1: 29, C2: 28 });
    expect(courseMap.lessons).toHaveLength(173);

    const a1Day1 = courseMap.lessons.find((lesson) => lesson.level === "A1" && lesson.day === 1);
    const a2Day6 = courseMap.lessons.find((lesson) => lesson.level === "A2" && lesson.day === 6);
    const a2Day14 = courseMap.lessons.find((lesson) => lesson.level === "A2" && lesson.day === 14);
    const b1Day15 = courseMap.lessons.find((lesson) => lesson.level === "B1" && lesson.day === 15);
    const b1Day21 = courseMap.lessons.find((lesson) => lesson.level === "B1" && lesson.day === 21);
    const b2Day6 = courseMap.lessons.find((lesson) => lesson.level === "B2" && lesson.day === 6);
    const c1Day16 = courseMap.lessons.find((lesson) => lesson.level === "C1" && lesson.day === 16);
    const c2Day2 = courseMap.lessons.find((lesson) => lesson.level === "C2" && lesson.day === 2);

    expect(a1Day1.sectionRoutes.radio).toContain("view=radio");
    expect(a1Day1.sectionRoutes.submit).toContain("view=submit");
    expect(a2Day6.sectionRoutes.hoeren).toContain("view=hoeren");
    expect(a2Day14.availableSections.some((section) => section.key === "hoeren")).toBe(false);
    expect(a2Day14.sectionRoutes.hoeren).toBeUndefined();
    expect(b1Day15.sectionRoutes.schreiben).toContain("view=schreiben");
    expect(b1Day21.availableSections.some((section) => section.key === "hoeren")).toBe(false);
    expect(b1Day21.sectionRoutes.hoeren).toBeUndefined();
    expect(b2Day6.skillFocus).toBe("hoeren");
    expect(b2Day6.sectionRoutes.hoeren).toContain("view=hoeren");
    expect(c1Day16.sectionRoutes.write).toContain("view=write");
    expect(c2Day2.skillFocus).toBe("hoeren");
    expect(c2Day2.media.audioAvailable).toBe(true);
    expect(courseMap.assistantRules.join(" ")).toContain("A1 through C2");
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
    expect(guide).toContain('href="/falowen-course-map.json"');
  });
});
