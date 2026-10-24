import { classCatalog } from "./classCatalog";
import { courseSchedulesByName } from "./courseSchedules";

describe("A1 Bonn fallback schedule", () => {
  test("matches the Wednesday-to-Friday 11:00 timetable", () => {
    const klass = classCatalog["A1 Bonn Klasse"];
    expect(klass.startDate).toBe("2026-07-15");
    expect(klass.endDate).toBe("2026-09-10");
    expect(klass.schedule).toEqual([
      { day: "Wednesday", startTime: "11:00", endTime: "12:00" },
      { day: "Thursday", startTime: "11:00", endTime: "12:00" },
      { day: "Friday", startTime: "11:00", endTime: "12:00" },
    ]);
  });

  test("generates Day 1, Day 2 and Day 3 on July 15, 16 and 17", () => {
    const days = courseSchedulesByName["A1 Bonn Klasse"].days.slice(0, 3);
    expect(days.map(({ dayNumber, date, weekday }) => ({ dayNumber, date, weekday }))).toEqual([
      { dayNumber: 1, date: "2026-07-15", weekday: "Wednesday" },
      { dayNumber: 2, date: "2026-07-16", weekday: "Thursday" },
      { dayNumber: 3, date: "2026-07-17", weekday: "Friday" },
    ]);
  });
});