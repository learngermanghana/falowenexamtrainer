import { buildLiveClassView } from "./liveClassView";

test("builds a one-hour Thursday schedule", () => {
  const result = buildLiveClassView({
    klass: {
      id: "demo",
      levelId: "A1",
      timezone: "Africa/Accra",
      scheduleRules: [{ day: "Thu", startTime: "18:00", durationMinutes: 60 }],
    },
    sessions: [],
  });
  expect(result.classDetails.schedule[0]).toEqual({
    day: "Thursday",
    startTime: "18:00",
    endTime: "19:00",
  });
});
