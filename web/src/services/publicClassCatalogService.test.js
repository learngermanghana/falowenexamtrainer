import {
  findPublicClassName,
  isPublicClassOpen,
  publicClassLabel,
  slugifyPublicClass,
} from "./publicClassCatalogService";

describe("publicClassCatalogService", () => {
  test("normalizes a class name into a stable public slug", () => {
    expect(slugifyPublicClass("A1 München Klasse")).toBe("a1-munchen-klasse");
  });

  test("keeps future and active ongoing classes open", () => {
    const now = new Date("2026-06-23T12:00:00Z");
    expect(isPublicClassOpen({ startDate: "2026-07-01", registrationOpen: true }, now)).toBe(true);
    expect(isPublicClassOpen({ startDate: "2026-06-01", endDate: "2026-07-01", status: "active", registrationOpen: true }, now)).toBe(true);
  });

  test("hides classes closed by admin", () => {
    const now = new Date("2026-06-23T12:00:00Z");
    expect(isPublicClassOpen({ startDate: "2026-07-01", publicVisible: false }, now)).toBe(false);
    expect(isPublicClassOpen({ startDate: "2026-07-01", registrationOpen: false }, now)).toBe(false);
  });

  test("finds a class by its slug and formats its signup label", () => {
    const classes = [{
      id: "abc",
      slug: "a1-munich-klasse",
      title: "A1 Munich Klasse",
      startDate: "2026-07-01",
      meetingDays: [{ day: "Monday", startTime: "18:00", endTime: "19:00" }],
    }];
    expect(findPublicClassName(classes, "a1-munich-klasse")).toBe("A1 Munich Klasse");
    expect(publicClassLabel(classes[0])).toContain("Monday 18:00-19:00");
  });
});
