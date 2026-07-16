import fs from "fs";
import path from "path";
import {
  isRescheduledLiveClass,
  liveClassAssignmentLabel,
  liveClassCleanTitle,
  liveClassLessonLabel,
  liveClassLessonLink,
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
  upcomingLiveClassSessions,
} from "../utils/liveClassCardPresentation";

const source = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

const lesson20 = {
  id: "a2-day-20",
  classId: "a2-koln",
  className: "A2 Koln Klasse",
  topic: "Lesson 20: Reklamationssituationen",
  assignmentIds: ["A2-7.20"],
  curriculumIndex: 19,
  startsAt: "2026-07-15T19:00:00.000Z",
  endsAt: "2026-07-15T21:00:00.000Z",
  previousStartsAt: "2026-07-14T19:00:00.000Z",
  rescheduleReason: "Wrong date corrected",
  status: "scheduled",
};

const summary = {
  klass: { id: "a2-koln", name: "A2 Koln Klasse", levelId: "A2" },
  sessions: [
    lesson20,
    {
      id: "a2-day-21",
      topic: "Lesson 21: Ein Wochenende planen",
      assignmentIds: ["A2-8.21"],
      startsAt: "2026-07-16T19:00:00.000Z",
      endsAt: "2026-07-16T21:00:00.000Z",
      status: "scheduled",
    },
    {
      id: "cancelled-day-22",
      topic: "Lesson 22: Cancelled",
      startsAt: "2026-07-17T19:00:00.000Z",
      endsAt: "2026-07-17T21:00:00.000Z",
      status: "cancelled",
    },
    {
      id: "a2-day-23",
      topic: "Lesson 23: Wie kommst du zur Arbeit?",
      assignmentIds: ["A2-8.23"],
      startsAt: "2026-07-18T19:00:00.000Z",
      endsAt: "2026-07-18T21:00:00.000Z",
      status: "scheduled",
    },
  ],
};

const a1BonnDay3 = {
  id: "a1-bonn-2026-07-17",
  classId: "a1-bonn",
  className: "A1 Bonn Klasse",
  topic: "Personal Information, Articles, Adjectives and W-Questions + Present-Tense Verb Conjugation Practice",
  assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
  curriculumDay: 3,
  curriculumIndex: 2,
  startsAt: "2026-07-17T11:00:00.000Z",
  endsAt: "2026-07-17T12:00:00.000Z",
  status: "scheduled",
};

const a1BonnSummary = {
  klass: { id: "a1-bonn", name: "A1 Bonn Klasse", levelId: "A1" },
  sessions: [a1BonnDay3],
};

describe("lesson-first live class presentation", () => {
  test("shows the correct A2 lesson identity and direct lesson route", () => {
    expect(liveClassLessonLabel(lesson20, "A2")).toBe("Lesson 20");
    expect(liveClassCleanTitle(lesson20)).toBe("Reklamationssituationen");
    expect(liveClassAssignmentLabel(lesson20)).toBe("A2-7.20");
    expect(liveClassLessonLink(summary, lesson20)).toBe("/campus/course/lesson/A2/20?chapter=7.20");
    expect(isRescheduledLiveClass(lesson20)).toBe(true);
  });

  test("uses the official A1 curriculum day instead of the chapter suffix", () => {
    expect(liveClassLessonLabel(a1BonnDay3, "A1")).toBe("Day 3");
    expect(liveClassCleanTitle(a1BonnDay3)).toBe(
      "Personal Information, Articles, Adjectives and W-Questions + Present-Tense Verb Conjugation Practice",
    );
    expect(liveClassLessonLink(a1BonnSummary, a1BonnDay3)).toBe(
      "/campus/course/lesson/A1/3?chapter=1.1-PRACTICE",
    );
  });

  test("previews the next two active lessons and excludes cancellations", () => {
    expect(
      upcomingLiveClassSessions(summary, lesson20, new Date("2026-07-15T12:00:00.000Z"), 2)
        .map((session) => session.id),
    ).toEqual(["a2-day-21", "a2-day-23"]);
  });

  test("keeps the last known summary available while the live schedule refreshes", () => {
    window.localStorage.clear();
    saveLiveClassSummaryCache({ classId: "a2-koln", className: "A2 Koln Klasse" }, summary);
    const cached = loadLiveClassSummaryCache({ classId: "a2-koln", className: "A2 Koln Klasse" });
    expect(cached.klass.name).toBe("A2 Koln Klasse");
    expect(cached.sessions).toHaveLength(4);
    expect(cached.isCachedSummary).toBe(true);
  });

  test("does not load schedules stored by the previous seven-day cache", () => {
    window.localStorage.clear();
    window.localStorage.setItem(
      "falowen:live-class-summary:v1:a2-koln",
      JSON.stringify({ cachedAt: Date.now(), summary }),
    );
    expect(loadLiveClassSummaryCache({ classId: "a2-koln", className: "A2 Koln Klasse" })).toBeNull();
  });
});

describe("live class card UI protection", () => {
  test("the shared card prioritizes lesson, actions, reschedule state and after-this preview", () => {
    const card = source("./NextLiveClassCard.js");
    expect(card).toContain("NEXT LIVE CLASS");
    expect(card).toContain("Open lesson");
    expect(card).toContain("View timetable");
    expect(card).toContain("Join class");
    expect(card).toContain("liveClassJoinOpensAt");
    expect(card).toContain("After this");
    expect(card).toContain("Previously:");
  });

  test("the full calendar places next class before progress and collapses the complete register", () => {
    const fullCard = source("./ClassCalendarCardV2.js");
    expect(fullCard.indexOf("<NextLiveClassCard")).toBeGreaterThan(-1);
    expect(fullCard.indexOf("<NextLiveClassCard")).toBeLessThan(fullCard.indexOf("canonicalSummary.progress"));
    expect(fullCard).toContain("Upcoming sessions");
    expect(fullCard).toContain("showing the next");
    expect(fullCard).toContain("Show all {sessions.length} sessions");
    expect(fullCard).not.toContain("<details open");
    expect(fullCard).toContain("loadLiveClassSummaryCache");
    expect(fullCard).toContain("Updating schedule…");
  });

  test("the Course Book indicator uses the same shared card and cached summary", () => {
    const courseBookCard = source("./CourseBookNextClassIndicator.js");
    expect(courseBookCard).toContain("NextLiveClassCard");
    expect(courseBookCard).toContain("loadLiveClassSummaryCache");
    expect(courseBookCard).toContain("saveLiveClassSummaryCache");
    expect(courseBookCard).toContain("compact");
  });

  test("existing ClassCalendarCard imports automatically receive the redesigned version", () => {
    expect(source("./ClassCalendarCard.js").trim()).toBe('export { default } from "./ClassCalendarCardV2";');
  });
});
