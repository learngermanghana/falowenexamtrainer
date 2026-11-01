"use strict";
const { prepareFromTimetable } = require("../chatgptClassPreparation");
const data = require("../../data/chatgptLessonContent.generated.json");
const courseContent = (level, day) => data.levels?.[level]?.[String(day)] || null;
const baseSession = {
  status: "upcoming_session",
  className: "A1 Accra Klasse", timezone: "Africa/Accra",
  campusUrl: "https://www.falowen.app/campus",
  zoomUrl: "https://us06web.zoom.us/j/123?pwd=own",
  nextSession: {
    startsAt: "2026-11-03T10:00:00.000Z",
    localStart: "Tuesday, 03 Nov 2026, 10:00",
    timezone: "Africa/Accra",
    topic: "Greetings and Asking About Well-being",
    topicConfirmed: true,
    lessonDay: 1,
    lessonDaySource: "explicit_session_day",
    lessonUrl: "https://www.falowen.app/campus/course/lesson/A1/1",
  },
};
describe("Falowen ChatGPT next class preparation", () => {
  test("grounds A1 warm-up in original 10-question Day 1 workbook", () => {
    const r = prepareFromTimetable({ timetable: baseSession, level: "A1", courseContent });
    expect(r.status).toBe("upcoming_session");
    expect(r.exactLessonAvailable).toBe(true);
    expect(r.lesson.title).toMatch(/Greetings/);
    expect(r.lesson.workbookChapters.length).toBeGreaterThan(0);
    expect(r.practiceQuestions[0].question).toMatch(/7:00 Uhr/);
    expect(r.practiceQuestions[0]).not.toHaveProperty("answer");
    expect(r.nextSession.topic).toBe(baseSession.nextSession.topic);
    expect(r.zoomUrl).toContain("pwd=own");
    expect(r.chatInstructions).toMatch(/one practice question at a time/);
  });
  test("uses real A2 reading and does not present grammar links as full explanations", () => {
    const t = {
      ...baseSession, level: "A2",
      nextSession: {
        ...baseSession.nextSession,
        topic: "Small Talk 1.1", lessonDay: 1,
        lessonUrl: "https://www.falowen.app/campus/course/lesson/A2/1",
      },
    };
    const r = prepareFromTimetable({ timetable: t, level: "A2", courseContent });
    expect(r.lesson.reading.title).toBe("Neu im Büro");
    expect(r.lesson.reading.sampleText).toContain("Firma Keller");
    expect(r.lesson.grammar.fullExplanationIncluded).toBe(true);
    expect(r.lesson.grammar.teaching.length).toBeGreaterThan(0);
    expect(JSON.stringify(r.lesson.grammar.teaching)).toMatch(/weil|deshalb/i);
    expect(r.practiceQuestions[0].question).toMatch(/Seit wann/);
  });
  test("never guesses a day from a mere curriculum index", () => {
    const t = {
      ...baseSession, nextSession: { ...baseSession.nextSession,
        lessonDaySource: "curriculum_index_unverified" },
    };
    const r = prepareFromTimetable({ timetable: t, level: "A1", courseContent });
    expect(r.exactLessonAvailable).toBe(false);
    expect(r.practiceQuestions).toEqual([]);
    expect(r.clarification).toMatch(/no explicit verified course day/);
    expect(r.lesson).toBeUndefined();
  });
  test("does not invent a class or topic when none is recorded", () => {
    const r = prepareFromTimetable({
      timetable: { status: "class_not_assigned", level: "A1",
        clarification: "No assigned class", campusUrl: baseSession.campusUrl },
      level: "A1", courseContent,
    });
    expect(r.exactLessonAvailable).toBe(false);
    expect(r.nextSession).toBeNull();
    expect(r).not.toHaveProperty("zoomUrl");
  });
});
