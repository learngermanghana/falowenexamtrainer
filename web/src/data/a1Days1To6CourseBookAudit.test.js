import fs from "fs";
import path from "path";
import {
  getConfiguredInAppWorkbookResourceRoute,
  hasOnlyInAppWorkbookRoutesForLevel,
} from "./inAppWorkbookRoutes";
import { getA1GrammarRoute } from "./a1GrammarRoutes";
import { getA1Assignment } from "./a1AssignmentRegistry";
import { getA1CanonicalLessonForLegacyRoute } from "./a1CanonicalLessonCatalog";
import { getCanonicalA1TeacherVideoResource } from "./a1TeacherVideoResources";
import { validateA1CanonicalSubmissionCompleteness } from "../components/A1CanonicalSubmissionPanel";

const source = (file) =>
  fs.readFileSync(path.join(process.cwd(), "src", "components", file), "utf8");

const earlyWorkbookRoutes = [
  [1, "0.1", "/campus/course/a1-day-1-greetings-workbook"],
  [2, "0.2", "/campus/course/a1-day-2-german-alphabet-reviewing-workbook"],
  [2, "1.1", "/campus/course/a1-day-2-kapitel-1-1-workbook"],
  [3, "1.1", "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook"],
  [3, "1.2", "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook"],
  [4, "2", "/campus/course/a1-day-4-numbers-for-beginners-workbook"],
  [5, "1.3", "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"],
  [6, "2.3", "/campus/course/a1-day-6-family-and-hobbies-workbook"],
];

const tutorMarkedAssignments = [
  ["A1-0.1", 1, "0.1"],
  ["A1-0.2", 2, "0.2"],
  ["A1-1.1", 2, "1.1"],
  ["A1-1.2", 3, "1.2"],
  ["A1-2", 4, "2"],
];

describe("A1 Course Book consolidation · Days 1-6", () => {
  test("all early workbook destinations stay inside Falowen", () => {
    earlyWorkbookRoutes.forEach(([day, chapter, expectedRoute]) => {
      const route = getConfiguredInAppWorkbookResourceRoute({ level: "A1", day, chapter });
      expect(route).toBe(expectedRoute);
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toContain("drive.google.com");
    });

    expect(hasOnlyInAppWorkbookRoutesForLevel("A1")).toBe(true);
  });

  test("Days 1-4 keep their canonical tutor-marked assignment identities", () => {
    tutorMarkedAssignments.forEach(([assignmentKey, day, chapter]) => {
      const assignment = getA1Assignment(assignmentKey);
      expect(assignment).toBeTruthy();
      expect(assignment.day).toBe(day);
      expect(assignment.chapter).toBe(chapter);
      expect(assignment.submissionEnabled).toBe(true);
      expect(assignment.workbookRoute).toBe(
        getConfiguredInAppWorkbookResourceRoute({ level: "A1", day, chapter }),
      );
    });
  });

  test("Day 3 Kapitel 1.1 plus Days 5-6 remain self-practice, not fake assignments", () => {
    [
      [3, "1.1", "Kapitel 1.1 Self-practice"],
      [5, "1.3", "Introducing Yourself and Articles"],
      [6, "2.3", "Family and Hobbies"],
    ].forEach(([day, identity, title]) => {
      const lesson = getA1CanonicalLessonForLegacyRoute({ day, identity });
      expect(lesson).toBeTruthy();
      expect(lesson.kind).toBe("practice");
      expect(lesson.assignmentKey).toBeNull();
      expect(lesson.title).toBe(title);
      expect(lesson.destination).toBe(
        getConfiguredInAppWorkbookResourceRoute({ level: "A1", day, chapter: identity }),
      );
    });
  });

  test("only verified early grammar routes are exposed", () => {
    expect(getA1GrammarRoute({ day: 1, chapter: "0.1" })).toBe(
      "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1",
    );
    expect(getA1GrammarRoute({ day: 2, chapter: "0.2" })).toBe(
      "/campus/course/german-alphabet-grammar-notes-day-2",
    );
    expect(getA1GrammarRoute({ day: 2, chapter: "1.1" })).toBe(
      "/campus/course/singular-pronouns-verb-conjugation-day-2",
    );
    expect(getA1GrammarRoute({ day: 3, chapter: "1.2" })).toBe(
      "/campus/course/a1-day-3-kapitel-1-2-grammar-notes",
    );
    expect(getA1GrammarRoute({ day: 4, chapter: "2" })).toBe(
      "/campus/course/german-numbers-1-10-with-pronunciation",
    );
    expect(getA1GrammarRoute({ day: 3, chapter: "1.1" })).toBe("");
    expect(getA1GrammarRoute({ day: 5, chapter: "1.3" })).toBe("");
    expect(getA1GrammarRoute({ day: 6, chapter: "2.3" })).toBe("");
  });

  test("A1-0.2 requires all seven Teil 1 and five Teil 2 Hören answers", () => {
    const incomplete = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: "Teil 1:\n1. C\n2. B\n3. A\n4. C\n5. B\n6. A\n7. C",
    });
    expect(incomplete.ok).toBe(false);
    expect(incomplete.message).toContain("Teil 2 · Hören answers 1, 2, 3, 4, 5");

    const complete = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: [
        "Teil 1:",
        "1. C", "2. B", "3. A", "4. C", "5. B", "6. A", "7. C",
        "Teil 2 · Hören:",
        "1. Wasser", "2. Berlin", "3. Anna", "4. neun", "5. Schule",
      ].join("\n"),
    });
    expect(complete).toEqual({ ok: true, message: "" });

    expect(validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.1",
      text: "",
    }).ok).toBe(true);
  });

  test("Day 2 workbook uses consecutive Teil numbering", () => {
    const workbook = source("A1Day3GermanAlphabetReviewingWorkbookPage.js");
    expect(workbook).toContain("Teil 2 · Hören");
    expect(workbook).not.toContain("Teil 3 · Hören");
    expect(workbook).toContain("A1-0.2");
  });

  test("Day 3 teacher lectures use the requested canonical videos", () => {
    expect(getCanonicalA1TeacherVideoResource(3, "1.1")?.url).toBe(
      "https://youtu.be/Ygbpt6yC_f4",
    );
    expect(getCanonicalA1TeacherVideoResource(3, "1.2")?.url).toBe(
      "https://youtu.be/9CTJ-2nsY8U",
    );

    const practice = source("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");
    expect(practice).toContain("getCanonicalA1TeacherVideoResource");
    expect(practice).toContain("teacherVideoUrl");
    expect(practice).toContain("AI lesson video");
  });

  test("native Days 1-6 workbook ownership and download support remain wired", () => {
    const app = fs.readFileSync(path.join(process.cwd(), "src", "App.js"), "utf8");
    [
      "A1Day1GreetingsWorkbookPage",
      "A1Day3GermanAlphabetReviewingWorkbookPage",
      "A1Day2Kapitel11WorkbookPage",
      "A1Day3SchreibenSprechenKapitel11WorkbookPage",
      "A1Day3PronounsIntroducingYourselfWorkbookPage",
      "A1Day4NumbersForBeginnersWorkbookPage",
      "A1Day5IntroducingYourselfArticlesWorkbookPage",
      "A1WorkbookRoutePage",
      "BookPdfDownloadInjector",
    ].forEach((name) => expect(app).toContain(name));

    const day6Route = source("A1WorkbookRoutePage.jsx");
    expect(day6Route).toContain("A1Day6FamilyAndHobbiesWorkbookPage");
    expect(day6Route).toContain("A1-2.3");
  });
});
