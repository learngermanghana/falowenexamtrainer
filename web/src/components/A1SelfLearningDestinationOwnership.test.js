import fs from "node:fs";
import path from "node:path";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

const practices = A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.kind === "practice");

describe("A1 self-learning destination ownership", () => {
  test("keeps all nine A1 self-learning books in the canonical practice catalog", () => {
    expect(practices.map(({ day, chapter, destination }) => ({ day, chapter, destination }))).toEqual([
      { day: 3, chapter: "1.1", destination: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook" },
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
    expect(radioPractices.map((practice) => practice.day)).toEqual([3, 5, 6, 13, 14, 15, 19]);

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

  test("destination pages use a fixed materials overlay while native Day 14 owns its selector", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1CoursePracticeAutoMount.js"),
      "utf8",
    );

    expect(source).toContain("A1_NATIVE_DESTINATION_MATERIAL_PATHS");
    expect(source).toContain('"/campus/course/modal-verbs-day-14-3-6"');
    expect(source).toContain('mount.setAttribute("data-a1-self-learning-destination-overlay", "true")');
    expect(source).toContain('document.body.appendChild(mount)');
    expect(source).toContain('document.body.style.overflow = "hidden"');
    expect(source).toContain("materialsCompleted || (journeyResources?.radio && !radioCompleted)");
  });
});
