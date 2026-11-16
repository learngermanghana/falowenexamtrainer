import { groupTimetableSessionsByMonth, selectFeaturedTimetableSession } from "./fullClassTimetableView";

const s = (id, startsAt, endsAt) => ({ id, startsAt, endsAt });

describe("full-class timetable Figma view model", () => {
  const now = new Date("2026-11-16T09:30:00Z");
  const sessions = [
    s("day0", "2026-11-11T11:00:00Z", "2026-11-11T12:00:00Z"),
    s("day1", "2026-11-16T11:00:00Z", "2026-11-16T12:00:00Z"),
    s("day2", "2026-11-17T11:00:00Z", "2026-11-17T12:00:00Z"),
    s("day3", "2026-12-03T11:00:00Z", "2026-12-03T12:00:00Z"),
  ];

  it("features the real next lesson without substituting a screenshot date", () => {
    expect(selectFeaturedTimetableSession(sessions, now)).toEqual({
      session: sessions[1],
      isLatest: false,
    });
    expect(selectFeaturedTimetableSession(sessions, new Date("2026-11-17T11:30:00Z"))).toEqual({
      session: sessions[2],
      isLatest: false,
    });
  });

  it("shows the last real session when the timetable is finished", () => {
    expect(selectFeaturedTimetableSession(sessions, new Date("2027-01-01T00:00:00Z")))
      .toEqual({ session: sessions[3], isLatest: true });
    expect(selectFeaturedTimetableSession([])).toBeNull();
  });

  it("groups chronological sessions by Ghana month and keeps their original records", () => {
    const groups = groupTimetableSessionsByMonth(sessions);
    expect(groups.map(group => group.month)).toEqual(["November 2026", "December 2026"]);
    expect(groups[0].sessions.map(entry => entry.id)).toEqual(["day0", "day1", "day2"]);
    expect(groups[1].sessions).toEqual([sessions[3]]);
  });

  it("handles missing session dates without inventing one", () => {
    const groups = groupTimetableSessionsByMonth([s("unknown", null, null)]);
    expect(groups).toEqual([{
      month: "Date to be confirmed",
      sessions: [s("unknown", null, null)],
    }]);
  });

  it("uses the Ghana time-zone month at UTC month boundaries", () => {
    const boundary = s("end", "2026-11-30T23:45:00Z", "2026-12-01T00:45:00Z");
    expect(groupTimetableSessionsByMonth([boundary])[0].month).toBe("November 2026");
  });
});
