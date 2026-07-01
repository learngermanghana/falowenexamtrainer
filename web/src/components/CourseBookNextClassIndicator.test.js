import {
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  formatClassCountdown,
  resolveLevel,
} from "./CourseBookNextClassIndicator";

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

  test("ignores cancelled, completed and stale live sessions", () => {
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
        startsAt: new Date("2026-07-01T13:00:00.000Z"),
        endsAt: new Date("2026-07-01T14:30:00.000Z"),
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

  test("finds the Course Book statistics grid", () => {
    document.body.innerHTML = `
      <section>
        <div><h2>Course Book</h2></div>
        <div data-testid="stats">
          <div><p>Lessons</p><p>28</p></div>
          <div><p>Assignments</p><p>19</p></div>
        </div>
      </section>
    `;

    expect(findCourseBookStatGrid(document)).toBe(document.querySelector('[data-testid="stats"]'));
  });
});
