jest.mock("../firebase", () => ({ db: null }));
import { buildCanonicalLiveClassSummary } from "../services/canonicalLiveClassService";
import { liveClassLessonNumber, liveClassLessonLink, upcomingLiveClassSessions } from "./liveClassCardPresentation";

const klass = { id: "Y4xjoaF5wK0RmDyIEvkY", name: "A2 Munich Klasse", levelId: "A2" };
const rows = [
  ["09", 17, "6.17", "In die Apotheke gehen"],
  ["14", 18, "7.18", "Die Bank anrufen"],
  ["15", 19, "7.19", "Einkaufen – wo und wie?"],
  ["16", 20, "7.20", "Reklamationssituationen"],
];
const sessions = rows.map(([date, day, chapter, title]) => ({
  id: `munich-${date}`, classId: klass.id, status: "scheduled",
  startsAt: new Date(`2026-09-${date}T19:00:00Z`), endsAt: new Date(`2026-09-${date}T20:30:00Z`),
  curriculumDay: day, curriculumIndex: day,
  topic: `${chapter}. ${title}`, assignmentIds: [`A2-${chapter}`],
}));

test("Munich homepage, timetable and following lesson preserve the admin lesson tuple", () => {
  const now = new Date("2026-09-15T16:00:00Z");
  const summary = buildCanonicalLiveClassSummary({ klass, sessions, now });
  expect(summary.nextSession.id).toBe("munich-15");
  expect(summary.nextSession.assignmentIds).toEqual(["A2-7.19"]);
  expect(liveClassLessonNumber(summary.nextSession)).toBe(19);
  expect(liveClassLessonLink(summary, summary.nextSession)).toBe("/campus/course/lesson/A2/19?chapter=7.19");
  expect(summary.sessions.map(liveClassLessonNumber)).toEqual([17, 18, 19, 20]);
  const next = upcomingLiveClassSessions(summary, summary.nextSession, now);
  expect(next.map(liveClassLessonNumber)).toEqual([20]);
});

test("moving a session changes its date without advancing its lesson destination", () => {
  const moved = { ...sessions[2], startsAt: new Date("2026-09-17T19:00:00Z"),
    endsAt: new Date("2026-09-17T20:30:00Z"), status: "rescheduled" };
  const summary = buildCanonicalLiveClassSummary({ klass, sessions: [moved], now: new Date("2026-09-17T18:00:00Z") });
  expect(liveClassLessonLink(summary, summary.nextSession)).toBe("/campus/course/lesson/A2/19?chapter=7.19");
});
