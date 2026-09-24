import {
  canResumeLearningLaunch, clearLearningSession, normalizeLearningHref,
  readLearningSession, saveLearningSession,
} from "./learningSession";

const lesson = "/campus/course/lesson/B1/13?view=workbook&assignmentId=B1-4.13&radio=done#schreiben";

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => jest.restoreAllMocks());

it("keeps the complete lesson URL and isolates students", () => {
  saveLearningSession("student-a", lesson);
  expect(readLearningSession("student-a", { standalone: false })?.href).toBe(lesson);
  expect(readLearningSession("student-b", { standalone: false })).toBeNull();
});

it("uses local storage only for an installed app whose tab was discarded", () => {
  saveLearningSession("student-a", lesson);
  sessionStorage.clear();
  expect(readLearningSession("student-a", { standalone: false })).toBeNull();
  expect(readLearningSession("student-a", { standalone: true })?.href).toBe(lesson);
});

it("prefers this tab's page over another tab's latest page", () => {
  saveLearningSession("student-a", lesson);
  const thisTab = sessionStorage.getItem("falowen:learning-session:student-a");
  saveLearningSession("student-a", "/campus/results");
  sessionStorage.setItem("falowen:learning-session:student-a", thisTab);
  expect(readLearningSession("student-a", { standalone: true })?.href).toBe(lesson);
});

it("expires old sessions and ignores corrupt or future data", () => {
  const clock = jest.spyOn(Date, "now").mockReturnValue(100_000_000);
  saveLearningSession("student-a", lesson);
  clock.mockReturnValue(100_000_000 + 25 * 60 * 60 * 1000);
  expect(readLearningSession("student-a", { standalone: false })).toBeNull();
  clock.mockReturnValue(99_000_000);
  expect(readLearningSession("student-a", { standalone: false })).toBeNull();
  sessionStorage.setItem("falowen:learning-session:student-a", "broken JSON");
  expect(readLearningSession("student-a", { standalone: false })).toBeNull();
});

it.each(["https://evil.example/campus", "//evil.example/campus", "/\\evil.example", "/login", "/signup", "/payment-complete", "/campus/../../login", "/campusish"])(
  "does not restore an unsafe or unrelated URL: %s", (href) => {
    expect(normalizeLearningHref(href)).toBeNull();
  }
);

it("only resumes a bare launch page and preserves explicit destinations", () => {
  expect(canResumeLearningLaunch("/", true)).toBe(true);
  expect(canResumeLearningLaunch("/campus", true)).toBe(true);
  expect(canResumeLearningLaunch("/", false)).toBe(false);
  expect(canResumeLearningLaunch(lesson, true)).toBe(false);
  expect(canResumeLearningLaunch("/campus?submitWork=1", true)).toBe(false);
  expect(canResumeLearningLaunch("/#announcements", true)).toBe(false);
});

it("removes both session copies on sign-out", () => {
  saveLearningSession("student-a", lesson);
  clearLearningSession("student-a");
  expect(readLearningSession("student-a", { standalone: true })).toBeNull();
});

it("tolerates blocked storage without breaking navigation", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new Error("Blocked"); });
  expect(() => saveLearningSession("student-a", lesson)).not.toThrow();
  expect(readLearningSession("student-a", { standalone: true })).toBeNull();
  expect(() => clearLearningSession("student-a")).not.toThrow();
});
