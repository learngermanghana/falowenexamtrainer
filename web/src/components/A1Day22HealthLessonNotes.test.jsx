import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import A1Day22HealthLessonNotes from "./A1Day22HealthLessonNotes";
import { getCanonicalA1TeacherVideoResource } from "../data/a1TeacherVideoResources";
import { normalizeLesson } from "../data/lessonModel";

test("A1 Day 22 chapter 14.1 uses the supplied teacher lecture, not the retired recording", () => {
  const resource = getCanonicalA1TeacherVideoResource(22, "14.1");
  expect(resource.url).toBe("https://youtu.be/qHwczAnb9lA");
  const lesson = normalizeLesson({
    day: 22, chapter: "14.1",
    lesen_hören: { chapter: "14.1" },
  }, "A1");
  expect(lesson.resources.teacherVideo.url).toBe(resource.url);
  expect(lesson.resources.videos.filter(video => /teacher/i.test(`${video.key} ${video.title}`)).map(video => video.url))
    .toEqual(["https://youtu.be/qHwczAnb9lA"]);
  expect(lesson.resources.aiVideo?.url).not.toBe(resource.url);
});

test("A1 Chapter 14.1 learner notes match the approved Day 22 slide topics", () => {
  const html = renderToStaticMarkup(<A1Day22HealthLessonNotes />);
  expect(html).toContain("Gesundheit und Körperteile");
  expect(html).toContain("Mein Kopf tut weh");
  expect(html).toContain("Meine Beine tun weh");
  expect(html).toContain("Könnten wir einen anderen Termin vereinbaren?");
  expect(html).toContain("weil ich krank bin");
  expect(html).toContain("Falowen Music");
  expect(html).toContain("Teil 3 Hören");
  expect(html).toContain("not a new graded Course Book task");
});
