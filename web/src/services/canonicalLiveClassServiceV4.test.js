jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn(),
  doc: jest.fn((...parts) => parts.join("/")),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

import { doc, getDoc } from "../firebase";
import {
  buildCanonicalLiveClassSummary,
  __private__,
} from "./canonicalLiveClassServiceV4";

const BONN_SESSION_DATES = [
  "2026-07-10T11:00:00.000Z",
  "2026-07-15T11:00:00.000Z",
  "2026-07-16T11:00:00.000Z",
  "2026-07-17T11:00:00.000Z",
  "2026-07-22T11:00:00.000Z",
  "2026-07-23T11:00:00.000Z",
  "2026-07-24T11:00:00.000Z",
  "2026-07-29T11:00:00.000Z",
  "2026-07-30T11:00:00.000Z",
  "2026-07-31T11:00:00.000Z",
  "2026-08-05T11:00:00.000Z",
  "2026-08-06T11:00:00.000Z",
  "2026-08-07T11:00:00.000Z",
  "2026-08-12T11:00:00.000Z",
  "2026-08-13T11:00:00.000Z",
  "2026-08-14T11:00:00.000Z",
  "2026-08-19T11:00:00.000Z",
  "2026-08-20T11:00:00.000Z",
  "2026-08-21T11:00:00.000Z",
  "2026-08-26T11:00:00.000Z",
  "2026-08-27T11:00:00.000Z",
  "2026-08-28T11:00:00.000Z",
  "2026-09-02T11:00:00.000Z",
  "2026-09-03T11:00:00.000Z",
  "2026-09-04T11:00:00.000Z",
  "2026-09-09T11:00:00.000Z",
  "2026-09-10T11:00:00.000Z",
];

const OFFICIAL_TOPICS = [
  ["Day 0: Orientation and Tutorial", ["A1-TUTORIAL"]],
  ["Day 1: Greetings and Asking About Well-being", ["A1-0.1"]],
  ["Day 2: German Alphabet + Personal Pronouns and Verb Conjugation", ["A1-0.2", "A1-1.1"]],
  ["Day 3: Personal Information, Articles, Adjectives and W-Questions + Present-Tense Verb Conjugation Practice", ["A1-1.1-PRACTICE", "A1-1.2"]],
  ["Day 4: Numbers, Phone Numbers and Addresses", ["A1-2"]],
  ["Day 5: Self-Introduction Practice with Articles", ["A1-1.3"]],
  ["Day 6: Family and Hobbies", ["A1-2.3"]],
  ["Day 7: Asking About Prices and Preferences", ["A1-3"]],
  ["Day 8: Countries and Languages", ["A1-4"]],
  ["Day 9: Nominative and Accusative Cases", ["A1-5"]],
  ["Day 10: Objects, Colors and Possessive Articles", ["A1-6"]],
  ["Day 11: The 12 Hour Clock", ["A1-7"]],
  ["Day 12: The 24 Hour Clock and Dates", ["A1-8"]],
  ["Day 13: Numbers, Time and Prices Revision", ["A1-3.5"]],
  ["Day 14: Modal Verbs", ["A1-3.6"]],
  ["Day 15: Goethe A1 Speaking Exam Structure", ["A1-4.7"]],
  ["Day 16: Food and Negation + Food and Daily Life", ["A1-9", "A1-10"]],
  ["Day 17: Instructions and the German Imperative", ["A1-11"]],
  ["Day 18: Two-way Prepositions + Professions and Prepositions", ["A1-12.1", "A1-12.2"]],
  ["Day 19: Goethe A1 Speaking Practice", ["A1-5.9"]],
  ["Day 20: Introduction to Letter Writing", ["A1-12.3"]],
  ["Day 21: Weather", ["A1-13"]],
  ["Day 22: Health and Body Parts", ["A1-14.1"]],
  ["Day 23: Dative and Accusative Verbs", ["A1-14.2"]],
  ["Day 24: Conjunctions and Basic Sentence Structure", ["A1-5.10"]],
];

function sessionAt({ id, index, topic, assignmentIds, official = false }) {
  const startsAt = new Date(BONN_SESSION_DATES[index]);
  return {
    id,
    classId: "a1-bonn-current",
    classRecordId: "a1-bonn-current",
    className: "A1 Bonn Klasse",
    status: "scheduled",
    topic,
    assignmentIds,
    startsAt,
    endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000),
    ...(official ? {
      curriculumIndex: index,
      curriculumDay: index,
      curriculumSource: "courseDictionary-day-groups",
      curriculumVersion: 2,
      manualDateOverride: true,
    } : {}),
  };
}

describe("canonical live class V4 compatibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("converts Falowen Admin official curriculum indexes from one-based to zero-based", () => {
    const normalized = __private__.normalizeSession({
      id: "a1-bonn-day-3",
      data: () => ({
        classId: "a1-bonn",
        topic: "Day 3: Personal Information",
        assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
        curriculumIndex: 3,
        curriculumDay: 3,
        curriculumSource: "courseDictionary-day-groups",
        curriculumVersion: 2,
        startsAt: "2026-07-17T11:00:00.000Z",
        endsAt: "2026-07-17T12:00:00.000Z",
      }),
    });

    expect(normalized.curriculumIndex).toBe(2);
    expect(normalized.storedCurriculumIndex).toBe(3);
    expect(normalized.curriculumDay).toBe(3);
  });

  test("uses the student's exact class document before matching duplicate class names", async () => {
    getDoc.mockResolvedValue({
      id: "a1-bonn-current",
      exists: () => true,
      data: () => ({
        name: "A1 Bonn Klasse",
        scheduleRules: [
          { day: "wed", startTime: "11:00" },
          { day: "thu", startTime: "11:00" },
          { day: "fri", startTime: "11:00" },
        ],
      }),
    });

    const klass = await __private__.findPreferredCanonicalClass({
      classId: "a1-bonn-current",
      className: "A1 Bonn Klasse",
    });

    expect(doc).toHaveBeenCalledWith({}, "classes", "a1-bonn-current");
    expect(klass.id).toBe("a1-bonn-current");
    expect(klass.scheduleRules.map((rule) => rule.day)).toEqual(["wed", "thu", "fri"]);
    expect(klass.officialSessionCount).toBe(25);
    expect(klass.curriculumMappedSessionCount).toBe(25);
  });

  test("prefers the complete 25 grouped A1 sessions over a stale generated count of 27", () => {
    const officialSessions = OFFICIAL_TOPICS.map(([topic, assignmentIds], index) => sessionAt({
      id: `official-${index}`,
      index,
      topic,
      assignmentIds,
      official: true,
    }));
    const legacyAssignments = [
      "A1-TUTORIAL", "A1-0.1", "A1-0.2", "A1-1.1", "A1-1.1-PRACTICE", "A1-1.2",
      "A1-2", "A1-1.3", "A1-2.3", "A1-3", "A1-4", "A1-5", "A1-6", "A1-7",
      "A1-8", "A1-3.5", "A1-3.6", "A1-4.7", "A1-9", "A1-10", "A1-11",
      "A1-12.1", "A1-12.2", "A1-5.9", "A1-12.3", "A1-14.2", "A1-5.10",
    ];
    const legacySessions = legacyAssignments.map((assignmentId, index) => sessionAt({
      id: `legacy-${index}`,
      index,
      topic: `${assignmentId.replace("A1-", "")}. Legacy individual lesson`,
      assignmentIds: [assignmentId],
    }));

    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a1-bonn-current",
        classId: "a1-bonn-current",
        name: "A1 Bonn Klasse",
        levelId: "A1",
        startDate: "2026-07-10",
        endDate: "2026-09-10",
        generatedSessionCount: 27,
      },
      sessions: [...officialSessions, ...legacySessions],
      now: new Date("2026-07-17T12:30:00.000Z"),
    });

    expect(summary.authoritativeSchedule).toBe(true);
    expect(summary.expectedOfficialSessionCount).toBe(25);
    expect(summary.officialCoverageCount).toBe(25);
    expect(summary.sessions).toHaveLength(25);
    expect(summary.totalCount).toBe(25);
    expect(summary.sessions[3]).toMatchObject({
      id: "official-3",
      topic: OFFICIAL_TOPICS[3][0],
      assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
    });
    expect(summary.nextSession).toMatchObject({
      id: "official-4",
      topic: OFFICIAL_TOPICS[4][0],
      assignmentIds: ["A1-2"],
    });
    expect(summary.sessions.some((session) => String(session.id).startsWith("legacy-"))).toBe(false);
  });
});
