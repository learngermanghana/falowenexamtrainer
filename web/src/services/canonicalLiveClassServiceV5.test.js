jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn((...parts) => parts.join("/")),
  doc: jest.fn((...parts) => parts.join("/")),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn((...parts) => parts),
  where: jest.fn((...parts) => parts),
}));

import { getDoc, getDocs, onSnapshot } from "../firebase";
import { __private__, subscribeCanonicalLiveClass } from "./canonicalLiveClassServiceV5";

const classSnapshot = (id, data) => ({
  id,
  exists: () => true,
  data: () => data,
});

const querySnapshot = (...classes) => ({
  docs: classes.map(({ id, ...data }) => classSnapshot(id, data)),
});

const sessionSnapshot = (...sessions) => ({
  docs: sessions.map(({ id, ...data }) => ({ id, data: () => data })),
});

const staleBonnClass = {
  id: "a1-bonn-legacy",
  name: "A1 Bonn Klasse",
  levelId: "A1",
  status: "active",
  startDate: "2026-07-10",
  endDate: "2026-09-10",
  generatedSessionCount: 27,
};

const repairedBonnClass = {
  id: "a1-bonn-official",
  name: "A1 Bonn Klasse",
  levelId: "A1",
  status: "active",
  startDate: "2026-07-10",
  endDate: "2026-09-04",
  generatedSessionCount: 25,
  curriculumMappedSessionCount: 25,
  officialSessionCount: 25,
  sessionRepairStatus: "complete",
  lastSessionChangeType: "official-schedule-repair",
};

describe("canonical live class V5 class-record selection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("selects the repaired 25-session record when duplicate class names exist", async () => {
    getDocs.mockResolvedValue(querySnapshot(staleBonnClass, repairedBonnClass));

    const klass = await __private__.findPreferredCanonicalClass({
      className: "A1 Bonn Klasse",
    });

    expect(klass.id).toBe("a1-bonn-official");
    expect(klass.endDate).toBe("2026-09-04");
    expect(klass.curriculumMappedSessionCount).toBe(25);
  });

  test("preserves the explicit attendance class ID despite a repaired same-name record", async () => {
    getDoc.mockResolvedValue(classSnapshot(staleBonnClass.id, staleBonnClass));
    getDocs.mockResolvedValue(querySnapshot(staleBonnClass, repairedBonnClass));

    const klass = await __private__.findPreferredCanonicalClass({
      classId: staleBonnClass.id,
      className: "A1 Bonn Klasse",
    });

    expect(klass.id).toBe(staleBonnClass.id);
    expect(klass.sessionRepairStatus).toBeUndefined();
  });

  test("does not move a student to a different same-name cohort", async () => {
    const futureRepairedClass = {
      ...repairedBonnClass,
      id: "a1-bonn-future",
      startDate: "2026-10-01",
      endDate: "2026-11-27",
    };
    getDoc.mockResolvedValue(classSnapshot(staleBonnClass.id, staleBonnClass));
    getDocs.mockResolvedValue(querySnapshot(futureRepairedClass));

    const klass = await __private__.findPreferredCanonicalClass({
      classId: staleBonnClass.id,
      className: "A1 Bonn Klasse",
    });

    expect(klass.id).toBe(staleBonnClass.id);
  });

  test("keeps the assigned same-name class and emits a reschedule through its existing listener", async () => {
    const assignedClass = { ...staleBonnClass, endDate: "2100-01-01" };
    getDoc.mockResolvedValue(classSnapshot(assignedClass.id, assignedClass));
    getDocs.mockResolvedValue(querySnapshot(repairedBonnClass));
    const listeners = [];
    onSnapshot.mockImplementation((target, onNext) => {
      listeners.push({ target, onNext });
      return jest.fn();
    });
    const onChange = jest.fn();

    subscribeCanonicalLiveClass({
      classId: assignedClass.id,
      className: assignedClass.name,
      onChange,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getDocs).not.toHaveBeenCalled();
    const sessionListener = listeners.find(({ target }) => Array.isArray(target));
    expect(sessionListener).toBeDefined();

    const original = {
      id: "assigned-session",
      classId: assignedClass.id,
      classRecordId: assignedClass.id,
      className: assignedClass.name,
      topic: "Day 12: Admin lesson",
      startsAt: new Date("2099-08-20T18:00:00.000Z"),
      endsAt: new Date("2099-08-20T19:00:00.000Z"),
      status: "scheduled",
    };
    sessionListener.onNext(sessionSnapshot(original));
    const rescheduled = {
      ...original,
      startsAt: new Date("2099-08-22T18:00:00.000Z"),
      endsAt: new Date("2099-08-22T19:00:00.000Z"),
      previousStartsAt: original.startsAt,
    };
    sessionListener.onNext(sessionSnapshot(rescheduled));

    const latest = onChange.mock.calls.at(-1)[0];
    expect(latest.klass.id).toBe(assignedClass.id);
    expect(latest.nextSession.id).toBe("assigned-session");
    expect(latest.nextSession.topic).toBe("Day 12: Admin lesson");
    expect(latest.nextSession.startsAt).toEqual(rescheduled.startsAt);
    expect(latest.nextSession.previousStartsAt).toEqual(original.startsAt);
  });

  test("keeps an exact class record when no repaired duplicate exists", async () => {
    const uniqueClass = {
      id: "a1-accra-current",
      name: "A1 Accra Klasse",
      levelId: "A1",
      status: "active",
      startDate: "2026-07-12",
    };
    getDoc.mockResolvedValue(classSnapshot(uniqueClass.id, uniqueClass));
    getDocs.mockResolvedValue(querySnapshot());

    const klass = await __private__.findPreferredCanonicalClass({
      classId: uniqueClass.id,
      className: uniqueClass.name,
    });

    expect(klass.id).toBe(uniqueClass.id);
    expect(klass.officialSessionCount).toBe(25);
  });
});
