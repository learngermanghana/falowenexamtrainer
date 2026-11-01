"use strict";

const {
  getStudentTimetable, resolveStudentClass, matchedStudentClass,
  sessionMatchesClass, upcomingSessions, zoomUrl, verifiedDayFromAssignment,
} = require("../chatgptClassTimetable");

const iso = (value) => new Date(value).toISOString();

function firebaseFixture({ classes = {}, sessions = {}, zoomProfiles = {} } = {}) {
  const stores = { classes, classSessions: sessions, zoomProfiles };
  const reads = [];
  const db = {
    collection(name) {
      const rows = stores[name] || {};
      return {
        doc(id) {
          return {
            async get() {
              reads.push({ name, type: "doc", id });
              return { id, exists: Object.hasOwn(rows, id), data: () => rows[id] };
            },
          };
        },
        where(field, op, value) {
          if (op !== "==") throw Error("Unexpected operator");
          return {
            limit(max) {
              return {
                async get() {
                  reads.push({ name, type: "query", field, value });
                  const docs = Object.entries(rows).filter(([, row]) => row[field] === value)
                    .slice(0, max).map(([id, data]) => ({ id, data: () => data }));
                  return { docs, empty: !docs.length };
                },
              };
            },
          };
        },
      };
    },
  };
  return { db, reads };
}
const student = (classId = "cohort-A1", level = "A1") => ({
  id: "student1", data: { uid: "uid1", role: "student", level, classId },
});
const classes = {
  "cohort-A1": {
    id: "cohort-A1", name: "A1 Accra Klasse", levelId: "A1", timezone: "Africa/Accra",
    status: "active", zoomProfileId: "zoom-A1",
  },
  "cohort-other": {
    id: "cohort-other", name: "A1 Berlin Klasse", levelId: "A1", timezone: "Africa/Accra",
    status: "active", zoomUrl: "https://us06web.zoom.us/j/12345?pwd=othersecret",
  },
};
const sessions = {
  "old": { classId: "cohort-A1", startsAt: "2026-10-20T10:00:00.000Z", endsAt: "2026-10-20T11:00:00.000Z", status: "completed" },
  "cancelled": { classId: "cohort-A1", startsAt: "2026-11-02T08:00:00.000Z", endsAt: "2026-11-02T09:00:00.000Z", status: "cancelled" },
  "rescheduled": { classRecordId: "cohort-A1", classId: "cohort-A1",
    startsAt: "2026-11-03T10:00:00.000Z", endsAt: "2026-11-03T11:00:00.000Z",
    previousStartsAt: "2026-11-02T10:00:00.000Z", status: "rescheduled", curriculumDay: 5,
    topic: "Fragen und Antworten" },
  "future": { classId: "cohort-A1", startsAt: "2026-11-05T10:00:00.000Z",
    endsAt: "2026-11-05T11:00:00.000Z", status: "scheduled", topic: "Meine Familie", curriculumDay: 6 },
  "outsider": { classId: "cohort-other", startsAt: "2026-11-02T06:00:00.000Z",
    endsAt: "2026-11-02T07:00:00.000Z", status: "scheduled", topic: "Private lesson" },
  "forged": { classId: "cohort-A1", classRecordId: "cohort-other", startsAt: "2026-11-01T14:00:00.000Z",
    endsAt: "2026-11-01T15:00:00.000Z", topic: "Other cohort" },
};
const now = new Date("2026-11-01T13:00:00.000Z");

describe("Falowen ChatGPT live timetable", () => {
  test("reads the assigned cohort only, handles cancellations and reschedules", async () => {
    const { db, reads } = firebaseFixture({
      classes, sessions, zoomProfiles: { "zoom-A1": { joinUrl: "https://us06web.zoom.us/j/67890?pwd=onlyourclass" } },
    });
    const response = await getStudentTimetable({ db, student: student(), now });
    expect(response.status).toBe("upcoming_session");
    expect(response.className).toBe("A1 Accra Klasse");
    expect(response.nextSession.startsAt).toBe(iso("2026-11-03T10:00:00.000Z"));
    expect(response.nextSession.topic).toBe("Fragen und Antworten");
    expect(response.nextSession.lessonDay).toBe(5);
    expect(response.nextSession.lessonUrl).toContain("/lesson/A1/5");
    expect(response.nextSession.localStart).toContain("03 Nov 2026");
    expect(response.timezone).toBe("Africa/Accra");
    expect(response.upcomingSessions).toHaveLength(2);
    expect(response.upcomingSessions.some((item) => item.topic === "Private lesson")).toBe(false);
    expect(response.zoomUrl).toContain("onlyourclass");
    expect(response.zoomUrl).not.toContain("othersecret");
    expect(reads.some((read) => read.name === "zoomProfiles" && read.id === "zoom-A1")).toBe(true);
    expect(reads.some((read) => read.name === "classes" && read.id === "cohort-other")).toBe(false);
  });

  test("never infers a live cohort from an A1 course level alone", async () => {
    const { db, reads } = firebaseFixture({ classes, sessions });
    const response = await getStudentTimetable({ db, student: { id:"student2", data: { level: "A1" } }, now });
    expect(response.status).toBe("class_not_assigned");
    expect(response.classAssigned).toBe(false);
    expect(response.nextSession).toBeUndefined();
    expect(reads).toHaveLength(0);
  });

  test("resolves exact class name without relying on its level; rejects ambiguous matches", async () => {
    const exact = firebaseFixture({ classes, sessions });
    const identity = student("none");
    identity.data = { level: "A1", className: "A1 Accra Klasse" };
    const found = await getStudentTimetable({ db: exact.db, student: identity, now });
    expect(found.status).toBe("upcoming_session");
    expect(found.className).toBe("A1 Accra Klasse");
    const dup = firebaseFixture({ classes: {
      a: { name: "A1 Accra Klasse", levelId: "A1" },
      b: { name: "A1 Accra Klasse", levelId: "A1" },
    } });
    const fail = await resolveStudentClass(dup.db, identity.data);
    expect(fail.status).toBe("ambiguous_class");
  });

  test("returns no invented future date, session, or Zoom link", async () => {
    const { db, reads } = firebaseFixture({ classes, sessions: { old: sessions.old } });
    const result = await getStudentTimetable({ db, student: student(), now });
    expect(result.status).toBe("no_upcoming_session");
    expect(result.nextSession).toBeNull();
    expect(result.upcomingSessions).toEqual([]);
    expect(result).not.toHaveProperty("zoomUrl");
    expect(reads.some((read) => read.name === "zoomProfiles")).toBe(false);
  });

  test("refuses a class whose level differs from the connected student's level", async () => {
    const { db, reads } = firebaseFixture({ classes, sessions });
    const result = await getStudentTimetable({ db, student: student("cohort-A1", "B1"), now });
    expect(result.status).toBe("class_level_mismatch");
    expect(reads.some((read) => read.name === "classSessions")).toBe(false);
  });

  test("self-study profile without class never receives an unrelated timetable", async () => {
    const { db } = firebaseFixture({ classes, sessions });
    const result = await getStudentTimetable({ db, student: { id:"self", data:{level:"B2"} }, now });
    expect(result.status).toBe("class_not_assigned");
    expect(result.clarification).toContain("self-study");
  });

  test("blocks forged cross-class session owners and malicious Zoom URLs", () => {
    expect(matchedStudentClass({ classId: "cohort-A1" }, { id: "cohort-other", name:"A1 Berlin Klasse" })).toBe(false);
    expect(sessionMatchesClass(sessions.forged, { id:"cohort-A1", name:"A1 Accra Klasse" })).toBe(false);
    expect(upcomingSessions([sessions.cancelled, sessions.forged, sessions.rescheduled],
      { id:"cohort-A1", name:"A1 Accra Klasse",status:"active" },now)).toHaveLength(1);
    expect(zoomUrl("https://zoom.us.evil.example/j/111?pwd=secret")).toBe("");
    expect(zoomUrl("javascript:alert(1)")).toBe("");
    expect(zoomUrl("http://zoom.us/j/111")).toBe("");
    expect(zoomUrl("https://us06web.zoom.us/j/111?pwd=abc")).toContain("zoom.us/j/111");
  });

  test("accepts Firebase Timestamp session dates", async () => {
    const timestamp = { toDate: () => new Date("2026-11-04T09:00:00Z") };
    const { db } = firebaseFixture({ classes, sessions: {
      "timestamp": { classId:"cohort-A1", startsAt:timestamp,
        endsAt:{toDate:()=>new Date("2026-11-04T10:00:00Z")},topic:"Ein neuer Tag" },
    } });
    const result = await getStudentTimetable({ db, student:student(), now });
    expect(result.nextSession.startsAt).toBe("2026-11-04T09:00:00.000Z");
  });
  test("confirms a lesson day from the canonical assignment ID without assuming calendar index", async () => {
    expect(verifiedDayFromAssignment({ assignmentIds: ["A1-0.1"] }, "A1")).toBe(1);
    expect(verifiedDayFromAssignment({ assignmentIds: ["A2-1.1"] }, "A2")).toBe(1);
    expect(verifiedDayFromAssignment({ assignmentIds: ["A2-1.1"] }, "A1")).toBeNull();
    const { db } = firebaseFixture({
      classes,
      sessions: { indexed: {
        classId: "cohort-A1",
        startsAt: "2026-11-06T10:00:00.000Z",
        endsAt: "2026-11-06T11:00:00.000Z",
        curriculumIndex: 29,
        assignmentIds: ["A1-0.1"],
        topic: "Greetings",
        status: "scheduled",
      } },
    });
    const result = await getStudentTimetable({ db, student: student(), now });
    expect(result.nextSession.lessonDay).toBe(1);
    expect(result.nextSession.lessonDaySource).toBe("assignment_identity");
  });

});
