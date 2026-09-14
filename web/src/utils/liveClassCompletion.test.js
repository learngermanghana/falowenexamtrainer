import { liveClassSessionStatus } from "./liveClassCardPresentation";

const now = new Date("2026-09-14T17:00:00Z");
const old = { startsAt: "2026-09-07T18:00:00Z", endsAt: "2026-09-07T19:00:00Z" };
test("a passed date is not evidence of a taught lesson", () => {
  expect(liveClassSessionStatus({ ...old, status: "scheduled" }, now)).toBe("Awaiting completion");
  expect(liveClassSessionStatus({ ...old, status: "completed" }, now)).toBe("Completed");
  expect(liveClassSessionStatus({ ...old, status: "cancelled" }, now)).toBe("Cancelled");
});
test("rescheduled Day 14 uses its current date", () => {
  expect(liveClassSessionStatus({ ...old, status: "scheduled",
    startsAt: "2026-09-14T18:00:00Z", endsAt: "2026-09-14T19:00:00Z",
    previousStartsAt: old.startsAt }, now)).toBe("Today");
});
