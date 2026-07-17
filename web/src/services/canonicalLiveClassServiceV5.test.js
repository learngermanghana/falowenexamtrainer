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

import { getDoc, getDocs } from "../firebase";
import { __private__ } from "./canonicalLiveClassServiceV5";

const classSnapshot = (id, data) => ({
  id,
  exists: () => true,
  data: () => data,
});

const querySnapshot = (...classes) => ({
  docs: classes.map(({ id, ...data }) => classSnapshot(id, data)),
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

  test("replaces a stale student class ID with the repaired same-name record", async () => {
    getDoc.mockResolvedValue(classSnapshot(staleBonnClass.id, staleBonnClass));
    getDocs.mockResolvedValue(querySnapshot(staleBonnClass, repairedBonnClass));

    const klass = await __private__.findPreferredCanonicalClass({
      classId: staleBonnClass.id,
      className: "A1 Bonn Klasse",
    });

    expect(klass.id).toBe("a1-bonn-official");
    expect(klass.sessionRepairStatus).toBe("complete");
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
