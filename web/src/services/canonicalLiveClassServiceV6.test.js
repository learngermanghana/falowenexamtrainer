import { repairA1LiveClassChronology } from "./canonicalLiveClassServiceV6";

const at = (day) => new Date(`2026-09-${String(day).padStart(2, "0")}T11:00:00.000Z`);

const session = (id, day, assignmentId, curriculumDay) => ({
  id,
  startsAt: at(day),
  endsAt: new Date(at(day).getTime() + 60 * 60 * 1000),
  status: "scheduled",
  assignmentIds: [assignmentId],
  chapterIds: [assignmentId],
  curriculumIds: [assignmentId],
  assignment_id: assignmentId,
  curriculumDay,
  curriculumIndex: curriculumDay,
  curriculumSource: "legacy",
  topic: `Day ${curriculumDay}: stale`,
});

test("legacy A1 timetable preserves the admin lesson even when its date position differs", () => {
  const sessions = [
    session("d0", 2, "A1-Tutorial", 0),
    session("d1", 3, "A1-0.1", 1),
    session("d2", 4, "A1-0.2", 2),
    session("d3", 5, "A1-1.1-practice", 3),
    session("d4", 6, "A1-2", 4),
    session("d5", 7, "A1-1.3", 5),
    session("d6", 8, "A1-2.3", 6),
    session("d7", 9, "A1-3", 7),
    session("d8", 14, "A1-4", 8),
    // A delayed lesson retains the identity stored by the admin.
    session("next", 15, "A1-1.2", 7),
  ];

  const repaired = repairA1LiveClassChronology({
    klass: { id: "berlin", name: "A1 Berlin Klasse", levelId: "A1" },
    sessions,
    nextSession: sessions[9],
  });

  expect(repaired.nextSession.curriculumDay).toBe(7);
  expect(repaired.nextSession.assignmentIds).toEqual(["A1-1.2"]);
  expect(repaired.nextSession.topic).toMatch(/^Day 7:/);
  expect(repaired.nextSession.chronologyRepaired).not.toBe(true);
});

test("official repaired A1 sessions keep their explicit curriculum identity", () => {
  const official = {
    ...session("official", 15, "A1-4", 8),
    curriculumSource: "courseDictionaryDayGroups",
    curriculumVersion: 2,
    curriculumIndex: 8,
  };
  const repaired = repairA1LiveClassChronology({
    klass: { name: "A1 Berlin Klasse", levelId: "A1" },
    sessions: [official],
    nextSession: official,
  });

  expect(repaired.nextSession.assignmentIds).toEqual(["A1-4"]);
  expect(repaired.nextSession.curriculumDay).toBe(8);
  expect(repaired.nextSession.chronologyRepaired).not.toBe(true);
});

test("Dortmund Day 14 survives rescheduling, partial snapshots and date reordering", () => {
  const modal = { ...session("modal", 14, "A1-3.6", 14),
    topic: "Day 14: Modal Verbs", previousStartsAt: at(7) };
  const laterLesson = session("prepositions", 8, "A1-12.1", 18);
  for (const sessions of [[modal], [modal, laterLesson], [laterLesson, modal]]) {
    const result = repairA1LiveClassChronology({
      klass: { id: "xTq2ZiYSmtVlpr3I5Zon", name: "A1 Dortmund Klasse" },
      sessions, nextSession: modal,
    });
    expect(result.nextSession).toEqual(modal);
    expect(result.sessions.find(item => item.id === "modal")).toEqual(modal);
  }
});
