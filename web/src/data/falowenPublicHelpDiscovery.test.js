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
  const compactNavigationRunner = read(path.join(ROOT, "scripts", "runCompactStudentNavigationPatch.mjs"));
  const catalogueGenerator = read(path.join(WEB, "scripts", "generate-public-course-catalogue.mjs"));
  const catalogueSource = read(path.join(WEB, "scripts", "public-course-schedule-source.mjs"));

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
    expect(llms).toContain("https://www.falowen.app/falowen-course-schedules.md");
  });

  test("publishes structured intent routes, aliases, state rules and deprecated labels", () => {
    expect(navigation.sourceOfTruth.structuredNavigation).toBe("https://www.falowen.app/falowen-navigation.json");
    expect(navigation.navigation.find((item) => item.id === "course-book")).toMatchObject({
      label: "Course Book",
      route: "/campus/course",
    });
    expect(navigation.navigation.find((item) => item.id === "vocabulary")).toMatchObject({
      label: "Vocab",
      route: "/campus/vocab",
    });
    expect(navigation.intentRoutes.some((item) => item.intent === "submit teacher-marked work")).toBe(true);
    expect(navigation.accessStates.some((item) => item.state === "radio-gated")).toBe(true);
    expect(navigation.sourceOfTruth.courseSchedulesMarkdown).toBe(
      "https://www.falowen.app/falowen-course-schedules.md"
    );
    expect(navigation.courseSchedules.aiReference).toBe(
      "https://www.falowen.app/falowen-course-schedules.md"
    );
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

  test("documents the exact current Course Book and Vocab navigation labels", () => {
    [help, llms, guide].forEach((source) => {
      expect(source).toContain("Course Book");
      expect(source).toContain("Vocab");
      expect(source).toContain("/campus/course");
      expect(source).toContain("/campus/vocab");
      expect(source).toContain("My Library");
      expect(source).toContain("Learning Hub");
      expect(source).toContain("My Hub");
    });
    expect(compactNavigationPatch).toContain('label: "Vocab"');
    expect(compactNavigationPatch).toContain('route: "/campus/vocab"');
    expect(compactNavigationRunner).toContain(
      'replaceAll(\'key: "learn", label: "Learn"\', \'key: "learn", label: "Course Book"\')'
    );
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

  test("publishes help and A1-C2 day-by-day schedules in search discovery", () => {
    expect(sitemap).toContain("https://www.falowen.app/help");
    expect(sitemap).not.toContain("https://www.falowen.app/learn-german-ghana/falowen-guide");
    ["a1", "a2", "b1", "b2", "c1", "c2"].forEach((level) => {
      expect(sitemap).toContain(`https://www.falowen.app/courses/german-${level}.html`);
      expect(help).toContain(`https://www.falowen.app/courses/german-${level}.html`);
      expect(llms).toContain(`https://www.falowen.app/courses/german-${level}.html`);
    });
    expect(sitemap).toContain("https://www.falowen.app/course-catalogue.json");
    expect(robots).toContain("https://www.falowen.app/sitemap-courses.xml");
    expect(landing).toContain('href: "/help"');
    expect(catalogueSource).toContain('["A1", "A2", "B1", "B2", "C1", "C2"]');
    expect(catalogueGenerator).toContain('{ key: "C2", slug: "german-c2"');
    expect(catalogueGenerator).toContain("day-by-day course schedule");
  });

  test("generates AI-friendly A1-C2 schedule questions and Markdown", () => {
    expect(catalogueGenerator).toContain('path.join(publicDir, "falowen-course-schedules.md")');
    expect(catalogueGenerator).toContain('"What is Falowen');
    expect(catalogueGenerator).toContain('"**Question:**');
    expect(catalogueGenerator).toContain('"**Answer:**');
    expect(catalogueGenerator).toContain('"@type": "FAQPage"');
    expect(catalogueGenerator).toContain("faqEntities");
    expect(catalogueGenerator).toContain("Falowen ${shortLevel} Day ${lesson.day} is");
    expect(catalogueSource).toContain('["A1", "A2", "B1", "B2", "C1", "C2"]');

    expect(sitemap).toContain("https://www.falowen.app/falowen-course-schedules.md");
    expect(robots).toContain("Allow: /falowen-course-schedules.md");
    expect(help).toContain("https://www.falowen.app/falowen-course-schedules.md");
    expect(guide).toContain('href="/falowen-course-schedules.md"');
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
