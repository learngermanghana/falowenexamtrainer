import fs from "fs";
import path from "path";
import { A2_EARLY_COURSE_ALIGNMENT } from "./a2CurriculumAlignment";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import { courseSchedules } from "./courseSchedule";
import { getConfiguredInAppWorkbookResourceRoute } from "./inAppWorkbookRoutes";

const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
const componentRoot = path.resolve(__dirname, "../components");
const standardWorkbookSource = fs.readFileSync(
  path.join(componentRoot, "A2StandardTabbedWorkbookPage.js"),
  "utf8",
);

const standardWorkbookComponents = Object.freeze({
  2: "A2Day2PersonenBeschreibenWorkbookPage.js",
  3: "A2Day3ComparisonsWorkbookPage.js",
  4: "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js",
  5: "A2Day5FreizeitWorkbookPage.js",
  6: "A2Day6MoebelRaeumeWorkbookPage.js",
  7: "A2Day7WohnungSuchenWorkbookPage.js",
  8: "A2Day8RezepteUndEssenWorkbookPage.js",
  9: "A2Day9UrlaubWorkbookPage.js",
  10: "A2Day10TourismusTraditionelleFesteWorkbookPage.js",
  11: "A2Day11UnterwegsVerkehrsmittelWorkbookPage.js",
});

const normalize = (value = "") => String(value || "").trim();
const routePathname = (route = "") => normalize(route).split(/[?#]/)[0];
const isRegisteredRoute = (route = "") => {
  const pathname = routePathname(route);
  if (!pathname) return false;
  if (appSource.includes(`path="${pathname}"`)) return true;
  return (
    appSource.includes('path="/campus/course/lesson/:level/:day"') &&
    /^\/campus\/course\/lesson\/A2\/\d+$/i.test(pathname)
  );
};

const getRuntimeEntry = (day, chapter) =>
  getCurriculumEntriesForLevel("A2").find(
    (entry) => Number(entry.day ?? entry.assignmentDay) === Number(day) && normalize(entry.chapter) === chapter,
  );

const getScheduleLesson = (day) =>
  (courseSchedules.A2 || []).find((entry) => Number(entry.day) === Number(day));

const getPrimaryResource = (lesson) =>
  Array.isArray(lesson?.lesen_hören) ? lesson.lesen_hören[0] : lesson?.lesen_hören;

describe("A2 Course Book batch audit · Days 1–12", () => {
  test("keeps the first twelve A2 teaching days explicitly aligned", () => {
    expect(Object.keys(A2_EARLY_COURSE_ALIGNMENT).map(Number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  test("keeps assignment, lecture, grammar and workbook resources synchronized at runtime", () => {
    Object.entries(A2_EARLY_COURSE_ALIGNMENT).forEach(([dayKey, expected]) => {
      const day = Number(dayKey);
      const entry = getRuntimeEntry(day, expected.chapter);
      const lesson = getScheduleLesson(day);
      const resource = getPrimaryResource(lesson);

      expect(entry).toBeTruthy();
      expect(entry.assignment_id || entry.assignmentId).toBe(expected.assignmentId);
      expect(entry.video).toBe(expected.video);
      expect(entry.grammarPage).toBe(expected.grammarPage);
      expect(entry.workbookRoute).toBe(expected.workbookRoute);
      expect(entry.submissionRequired).toBe(true);
      expect(entry.progressionEligible).toBe(true);

      expect(lesson).toBeTruthy();
      expect(normalize(lesson.chapter)).toBe(expected.chapter);
      expect(lesson.assignmentId || lesson.assignment_id).toBe(expected.assignmentId);
      expect(lesson.assignment).toBe(true);
      expect(resource?.video || resource?.youtube_link).toBe(expected.video);
      expect(resource?.grammarbook_link || resource?.grammarPage).toBe(expected.grammarPage);
      expect(resource?.workbook_link || resource?.workbookRoute).toBe(expected.workbookRoute);
    });
  });

  test("keeps first-batch grammar and workbook destinations inside registered Falowen routes", () => {
    Object.entries(A2_EARLY_COURSE_ALIGNMENT).forEach(([dayKey, expected]) => {
      const day = Number(dayKey);

      [expected.grammarPage, expected.workbookRoute].forEach((route) => {
        expect(route).toMatch(/^\/campus\/course\//);
        expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
        expect(route).not.toMatch(/^https?:\/\/(?:www\.)?falowen\.app/i);
        expect(isRegisteredRoute(route)).toBe(true);
      });

      expect(getA2GrammarRoute({ day, chapter: expected.chapter })).toBe(expected.grammarPage);
      expect(
        getConfiguredInAppWorkbookResourceRoute({ level: "A2", day, chapter: expected.chapter }),
      ).toBe(expected.workbookRoute);
    });
  });

  test("keeps Day 2 on the current canonical lecture instead of the retired schedule video", () => {
    expect(A2_EARLY_COURSE_ALIGNMENT[2].video).toBe("https://youtu.be/3_X7pyFA5A4");
    expect(getPrimaryResource(getScheduleLesson(2))?.video).toBe("https://youtu.be/3_X7pyFA5A4");
    expect(getPrimaryResource(getScheduleLesson(2))?.video).not.toBe("https://youtu.be/Tor-mPRS3j4");
  });

  test("keeps Days 2–11 on native standard workbook ownership and canonical chapter identity", () => {
    Object.entries(standardWorkbookComponents).forEach(([dayKey, fileName]) => {
      const day = Number(dayKey);
      const expected = A2_EARLY_COURSE_ALIGNMENT[day];
      const source = fs.readFileSync(path.join(componentRoot, fileName), "utf8");

      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).toContain(`day={${day}}`);
      expect(source).toContain(`chapter="${expected.chapter}"`);
      expect(source).not.toMatch(/locked\s+to\s+A2-[\w.-]+/i);
      expect(source).not.toMatch(/internal\s+assignment/i);
      expect(source).not.toMatch(/official\s+position/i);
    });
  });

  test("normalizes the old mixed-language listening submission wording in the shared workbook shell", () => {
    expect(standardWorkbookSource).toContain("normalizeLearnerTaskCopy");
    expect(standardWorkbookSource).toContain("Trage anschließend deine endgültigen Antwortbuchstaben im Submit-Bereich ein.");
  });

  test("keeps Day 12 on its native workbook wrapper and current listening-media repair", () => {
    const wrapper = fs.readFileSync(
      path.join(componentRoot, "A2Day12MeinTraumberufWorkbookPage.js"),
      "utf8",
    );
    const legacy = fs.readFileSync(
      path.join(componentRoot, "A2Day12MeinTraumberufWorkbookPageLegacy.js"),
      "utf8",
    );

    expect(wrapper).toContain("A2Day12MeinTraumberufWorkbookPageLegacy");
    expect(wrapper).toContain('YOUTUBE_URL = "https://youtu.be/VGzHSjn3O-A"');
    expect(wrapper).toContain("patchListeningMedia");
    expect(legacy).toContain('assignmentKey: "A2-5.12"');
    expect(legacy).toContain('canonicalAssignmentKey: "A2-5.12"');
  });
});
