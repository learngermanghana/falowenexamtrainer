import fs from "node:fs";
import path from "node:path";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

const practices = A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.kind === "practice");

describe("A1 self-learning destination ownership", () => {
  test("keeps all ten A1 self-learning books in the canonical practice catalog", () => {
    expect(practices.map(({ day, chapter, destination }) => ({ day, chapter, destination }))).toEqual([
      { day: 3, chapter: "1.1", destination: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook" },
      { day: 3, chapter: "1.2", destination: "/campus/course/a1-day-3-kapitel-1-2-workbook" },
      { day: 5, chapter: "1.3", destination: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook" },
      { day: 6, chapter: "2.3", destination: "/campus/course/a1-day-6-family-and-hobbies-workbook" },
      { day: 13, chapter: "3.5", destination: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook" },
      { day: 14, chapter: "3.6", destination: "/campus/course/modal-verbs-day-14-3-6" },
      { day: 15, chapter: "4.7", destination: "/campus/course/speaking-exams-intro-4-7" },
      { day: 19, chapter: "5.9", destination: "/campus/course/verboten-erlaubt-5-9" },
      { day: 23, chapter: "14.2", destination: "/campus/course/dative-and-accusative-verbs-14-2" },
      { day: 24, chapter: "5.10", destination: "/campus/course/conjunctions-5-10" },
    ]);
  });

  test("every practice destination with Falowen Radio has a route-level radio gate", () => {
    const radioPractices = practices.filter((practice) => getA1RadioResource(practice.day, practice.chapter));
    expect(radioPractices.map((practice) => `${practice.day}:${practice.chapter}`)).toEqual([
      "3:1.1",
      "3:1.2",
      "5:1.3",
      "6:2.3",
      "13:3.5",
      "14:3.6",
      "15:4.7",
      "19:5.9",
    ]);

    radioPractices.forEach((practice) => {
      expect(resolveA1RadioFirstWorkbookRoute(practice.destination, "")).toEqual(
        expect.objectContaining({ day: practice.day }),
      );
    });

    expect(resolveA1RadioFirstWorkbookRoute(
      "/campus/course/a1-day-6-family-and-hobbies-workbook",
      "",
    )).toEqual({ day: 6, chapter: "2.3" });
  });

  test("completed Radio stays on the canonical practice book and embeds workbook media", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1CoursePracticeAutoMount.js"),
      "utf8",
    );

    expect(source).toContain("buildA1SelfLearningDestinationHref(practice.destination, location.search)");
    expect(source).toContain('mediaMount.id = "falowen-a1-practice-media-mount"');
    expect(source).toContain('mediaMount.setAttribute("data-a1-self-learning-workbook-media", "true")');
    expect(source).toContain("<A1WorkbookMediaPanel");
    expect(source).not.toContain("const materialsCompleted = hasCompletedSelfLearningMaterials(location.search)");
  });

  test("shared A2 Day 17 context cannot receive A1 Day 14 media", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1CoursePracticeAutoMount.js"),
      "utf8",
    );

    expect(source).toContain("const sharedA2Day17 =");
    expect(source).toContain('pathname === "/campus/course/modal-verbs-day-14-3-6"');
    expect(source).toContain('String(routeSearch.get("level") || "").toUpperCase() === "A2"');
    expect(source).toContain('Number(routeSearch.get("day")) === 17');
    expect(source).toContain("const practice = sharedA2Day17 ? null : getA1SelfLearningPracticeForLocation(location)");
  });
});
