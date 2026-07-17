import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { normalizeLesson } from "../data/lessonModel";
import A1Day6FamilyAndHobbiesWorkbookPage from "./A1Day6FamilyAndHobbiesWorkbookPage";
import { findA1WorkbookByPath } from "./A1WorkbookRoutePage";
import { resolveLessonRouteEntry } from "../utils/lessonRouteEntry";

describe("A1 lesson and workbook routing regressions", () => {
  test("Day 2 chapter 1.1 overrides stale chapter 0.2 state and owns its resources", () => {
    const stale = resolveLessonRouteEntry({ entries: courseSchedules.A1, level: "A1", day: 2, chapter: "0.2" });
    const lesson = resolveLessonRouteEntry({
      entries: courseSchedules.A1,
      level: "A1",
      day: 2,
      chapter: "1.1",
      stateEntry: stale,
    });
    const resources = normalizeLesson(lesson, "A1").resources;

    expect(lesson.chapter).toBe("1.1");
    expect(lesson.topic).toContain("Personal Pronouns");
    expect(resources.grammarBook.url).toContain("singular-pronouns-verb-conjugation");
    expect(resources.workbook.url).toBe("/campus/course/a1-day-2-kapitel-1-1-workbook");
    expect(JSON.stringify(lesson)).not.toContain("german-alphabet-reviewing-workbook");
  });

  test("canonical A1 route resolution does not depend on mutable course schedule entries", () => {
    const day2 = resolveLessonRouteEntry({ entries: [], level: "A1", day: 2, chapter: "1.1" });
    const day7 = resolveLessonRouteEntry({ entries: [], level: "A1", day: 7, chapter: "3" });

    expect(day2).toMatchObject({
      lessonId: "A1-1.1",
      day: 2,
      chapter: "1.1",
      workbookRoute: "/campus/course/a1-day-2-kapitel-1-1-workbook",
    });
    expect(day7).toMatchObject({
      lessonId: "A1-3",
      day: 7,
      chapter: "3",
      workbookRoute: "/campus/course/a1-chapter-3-asking-about-prices-workbook",
    });
    expect(normalizeLesson(day7, "A1").resources.workbook.url).toBe(
      "/campus/course/a1-chapter-3-asking-about-prices-workbook",
    );
  });

  test("a client-side chapter change replaces every Chapter 0.2 resource", () => {
    const chapter02 = resolveLessonRouteEntry({ entries: courseSchedules.A1, level: "A1", day: 2, chapter: "0.2" });
    const chapter11 = resolveLessonRouteEntry({
      entries: courseSchedules.A1,
      level: "A1",
      day: 2,
      chapter: "1.1",
      stateEntry: chapter02,
    });

    expect(chapter11).not.toBe(chapter02);
    expect(chapter11.chapter).toBe("1.1");
    expect(JSON.stringify(normalizeLesson(chapter11, "A1").resources)).not.toContain("German Alphabet");
  });

  test("stale state from another day is never accepted for the requested route", () => {
    const staleDay7 = resolveLessonRouteEntry({ entries: courseSchedules.A1, level: "A1", day: 7, chapter: "3" });
    const day2 = resolveLessonRouteEntry({
      entries: courseSchedules.A1,
      level: "A1",
      day: 2,
      chapter: "1.1",
      stateEntry: staleDay7,
    });

    expect(day2.day).toBe(2);
    expect(day2.chapter).toBe("1.1");
    expect(day2.lessonId).toBe("A1-1.1");
  });

  test("Family and Hobbies slug resolves to immutable A1-2.3 and renders questions", () => {
    expect(findA1WorkbookByPath("/campus/course/a1-day-6-family-and-hobbies-workbook")).toMatchObject({
      lessonId: "A1-2.3",
      level: "A1",
      day: 6,
      chapter: "2.3",
    });

    render(
      <MemoryRouter>
        <A1Day6FamilyAndHobbiesWorkbookPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /Family, Languages, Yes\/No Questions and Hobbies/i })).toBeVisible();
    expect(screen.getByText("What is 'mother' in German?", { exact: false })).toBeVisible();
    expect(screen.getByRole("button", { name: /Open Group Discussion/i })).toBeEnabled();
  });
});
