import {
  COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE,
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  findOrCreateCourseBookNextClassMount,
  formatClassCountdown,
  resolveLevel,
} from "../utils/courseBookNextClassLogic";

describe("CourseBookNextClassIndicator", () => {
  test("handles a null student profile while authentication is loading", () => {
    expect(resolveLevel(null)).toBe("");
  });

  test("shows days and hours until the next class", () => {
    const now = new Date("2026-07-01T10:00:00.000Z");
    const session = {
      startsAt: new Date("2026-07-03T16:00:00.000Z"),
      endsAt: new Date("2026-07-03T17:30:00.000Z"),
    };

    expect(formatClassCountdown(session, now)).toBe("Starts in 2 days 6 hours");
  });

  test("shows hours and minutes when the class is less than one day away", () => {
    const now = new Date("2026-07-01T10:00:00.000Z");
    const session = {
      startsAt: new Date("2026-07-01T16:20:00.000Z"),
      endsAt: new Date("2026-07-01T17:50:00.000Z"),
    };

    expect(formatClassCountdown(session, now)).toBe("Starts in 6 hours 20 minutes");
  });

  test("uses Ghana wall-clock fields for countdowns when browser timezone differs", () => {
    const now = new Date("2026-07-01T16:36:00.000Z");
    const session = {
      date: "2026-07-01",
      startTime: "17:00",
      endTime: "18:30",
      startsAt: new Date("2026-07-01T18:00:00.000Z"),
      endsAt: new Date("2026-07-01T19:30:00.000Z"),
    };

    expect(formatClassCountdown(session, now)).toBe("Starts in 24 minutes");
  });

  test("shows the live state during class", () => {
    const now = new Date("2026-07-01T16:30:00.000Z");
    const session = {
      startsAt: new Date("2026-07-01T16:00:00.000Z"),
      endsAt: new Date("2026-07-01T17:30:00.000Z"),
    };

    expect(formatClassCountdown(session, now)).toBe("Class is live now");
  });

  test("does not keep showing live after the scheduled end time", () => {
    const now = new Date("2026-07-01T17:45:00.000Z");
    const session = {
      status: "live",
      startsAt: new Date("2026-07-01T16:00:00.000Z"),
      endsAt: new Date("2026-07-01T17:30:00.000Z"),
    };

    expect(formatClassCountdown(session, now)).toBe("Class has ended");
  });

  test("ignores cancelled, past completed and stale live sessions", () => {
    const now = new Date("2026-07-01T10:00:00.000Z");
    const expected = {
      id: "upcoming",
      startsAt: new Date("2026-07-02T10:00:00.000Z"),
      endsAt: new Date("2026-07-02T11:30:00.000Z"),
    };
    const sessions = [
      {
        id: "cancelled",
        status: "cancelled",
        startsAt: new Date("2026-07-01T12:00:00.000Z"),
        endsAt: new Date("2026-07-01T13:30:00.000Z"),
      },
      {
        id: "completed",
        status: "completed",
        startsAt: new Date("2026-07-01T08:00:00.000Z"),
        endsAt: new Date("2026-07-01T09:30:00.000Z"),
      },
      {
        id: "stale-live",
        status: "live",
        startsAt: new Date("2026-07-01T07:00:00.000Z"),
        endsAt: new Date("2026-07-01T08:30:00.000Z"),
      },
      expected,
    ];

    expect(findCurrentOrNextSession(sessions, now)).toBe(expected);
  });

  test("uses the repaired Admin Day 3 time even when its stored status is stale", () => {
    const now = new Date("2026-07-17T09:45:00.000Z");
    const adminDay3 = {
      id: "a1-bonn-admin-day-3",
      status: "completed",
      curriculumDay: 3,
      assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
      topic: "Day 3: Personal Information, Articles, Adjectives and W-Questions",
      startsAt: new Date("2026-07-17T11:00:00.000Z"),
      endsAt: new Date("2026-07-17T12:00:00.000Z"),
    };
    const adminDay6 = {
      id: "a1-bonn-admin-day-6",
      status: "scheduled",
      curriculumDay: 6,
      startsAt: new Date("2026-07-22T11:00:00.000Z"),
      endsAt: new Date("2026-07-22T12:00:00.000Z"),
    };

    expect(findCurrentOrNextSession([adminDay3, adminDay6], now)).toBe(adminDay3);
  });

  test("finds the Course Book statistics grid and keeps the A1 live-class card outside it", () => {
    document.body.innerHTML = `
      <div data-testid="course-root">
        <section data-testid="hero">
          <div><h2>Course Book</h2></div>
          <div data-testid="stats">
            <div><p>Lessons</p><p>28</p></div>
            <div><p>Assignments</p><p>19</p></div>
          </div>
        </section>
      </div>
    `;

    const stats = document.querySelector('[data-testid="stats"]');
    const hero = document.querySelector('[data-testid="hero"]');
    expect(findCourseBookStatGrid(document)).toBe(stats);
    expect(findOrCreateCourseBookNextClassMount(document, "A2")).toBe(stats);

    const a1Mount = findOrCreateCourseBookNextClassMount(document, "A1");
    expect(a1Mount).not.toBe(stats);
    expect(a1Mount.getAttribute(COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE)).toBe("true");
    expect(a1Mount.previousElementSibling).toBe(hero);
    expect(findOrCreateCourseBookNextClassMount(document, "A1")).toBe(a1Mount);
  });
});
