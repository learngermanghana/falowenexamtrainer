import {
  getCampusProgram,
  getProgramCampusTabs,
  getProgramAllowedSections,
  getProgramCourseRedirect,
  canSubmitSwahiliWorkbook,
} from "./campusProgram";

const german = { program: "german" };
const swahili = { program: "swahili" };
const tabs = [
  { section: "course", label: "Course Book" },
  { section: "music", label: "Music" },
  { section: "books", label: "Books" },
  { section: "vocab", label: "Vocabulary" },
  { section: "results", label: "Results" },
  { section: "account", label: "Account" },
];
const sections = {
  course: true, music: true, books: true, vocab: true,
  attendance: true, classMembers: true, discussion: true,
  results: true, account: true, "tutor-marking": true,
};

describe("Falowen programme-aware Campus", () => {
  test("normalizes the enrolled programme without reading the interface language", () => {
    expect(getCampusProgram({ program: " SWAHILI " })).toBe("swahili");
    expect(getCampusProgram(german)).toBe("german");
    expect(getCampusProgram({ language: "sw", program: "german" })).toBe("german");
    expect(getCampusProgram(null)).toBe("german");
  });

  test("reuses the shared tab definitions, filtering German-only destinations for Kiswahili", () => {
    expect(getProgramCampusTabs(tabs, swahili).map((tab) => tab.section)).toEqual(["course", "vocab", "account"]);
    expect(getProgramCampusTabs(tabs, swahili).find((tab) => tab.section === "vocab").label).toBe("Msamiati · Vocabulary");
    expect(getProgramCampusTabs(tabs, german)).toBe(tabs);
    expect(tabs).toHaveLength(6);
  });

  test("keeps German Campus sections unchanged and preserves common Swahili account access", () => {
    expect(getProgramAllowedSections(sections, german)).toBe(sections);
    const allowed = getProgramAllowedSections(sections, swahili);
    expect(allowed).toEqual(expect.objectContaining({
      course: true, account: true,
      music: false, books: false, vocab: true,
      results: false, attendance: false, classMembers: false, discussion: false,
    }));
    expect(sections.music).toBe(true);
  });

  test("keeps Kiswahili on published course routes and outside German exams", () => {
    for (const route of ["/exams/overview", "/campus/course/lesson/A1/1", "/campus/course/preview/A2"]) {
      expect(getProgramCourseRedirect({ pathname: route, studentProfile: swahili }))
        .toBe("/campus/course");
    }
    expect(getProgramCourseRedirect({
      pathname: "/campus/course/swahili/day-1", studentProfile: swahili,
    })).toBeNull();
    expect(getProgramCourseRedirect({
      pathname: "/campus/course/swahili/day-6/", studentProfile: swahili,
    })).toBeNull();
  });

  test("blocks cross-programme Campus workbook routes without blocking public preview", () => {
    expect(getProgramCourseRedirect({
      pathname: "/campus/course/swahili/day-1", studentProfile: german,
    })).toBe("/campus/course");
    expect(getProgramCourseRedirect({
      pathname: "/swahili/day-1", studentProfile: german,
    })).toBeNull();
    expect(getProgramCourseRedirect({
      pathname: "/campus/course/lesson/A1/1", studentProfile: german,
    })).toBeNull();
    expect(getProgramCourseRedirect({
      pathname: "/campus/course/lesson/A1/1", studentProfile: swahili, isStaff: true,
    })).toBeNull();
  });

  test("only enrolled Kiswahili students can write in signed-in Campus, never public preview", () => {
    const user = { uid: "student-1" };
    expect(canSubmitSwahiliWorkbook({ user, studentProfile: swahili })).toBe(true);
    expect(canSubmitSwahiliWorkbook({ user, studentProfile: swahili, preview: true })).toBe(false);
    expect(canSubmitSwahiliWorkbook({ user, studentProfile: german })).toBe(false);
    expect(canSubmitSwahiliWorkbook({ user: null, studentProfile: swahili })).toBe(false);
  });
});
