import { findCurrentOrNextSession } from "./courseBookNextClassLogic";
import {
  liveClassLessonLink,
  liveClassLessonNumber,
} from "./liveClassCardPresentation";

describe("homepage live-class consistency", () => {
  test("prefers canonical startsAt after a session is moved even when legacy date fields are stale", () => {
    const movedSession = {
      id: "moved-day-4",
      status: "scheduled",
      date: "2026-09-13",
      startTime: "09:00",
      endTime: "10:00",
      startsAt: new Date("2026-09-15T09:00:00.000Z"),
      endsAt: new Date("2026-09-15T10:00:00.000Z"),
    };

    expect(findCurrentOrNextSession(
      [movedSession],
      new Date("2026-09-14T10:00:00.000Z"),
    )).toBe(movedSession);
  });

  test("uses curriculum position for the lesson route instead of treating the assignment number as the day", () => {
    const summary = {
      klass: { name: "A1 Berlin Klasse", level: "A1" },
    };
    const session = {
      curriculumIndex: 3,
      assignmentIds: ["A1-2"],
      topic: "Numbers, Phone Numbers and Addresses",
    };

    expect(liveClassLessonNumber(session)).toBe(4);
    expect(liveClassLessonLink(summary, session)).toBe("/campus/course/lesson/A1/4?chapter=2");
  });
});
