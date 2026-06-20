import { getAssignmentDictionaryEntry } from "../data/germanAssignmentCatalog";
import { A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE } from "../data/courseBookCurriculumCorrections";
import {
  COURSE_BOOK_ASSESSMENT_TYPES,
  COURSE_BOOK_RESOURCE_TYPES,
  expandCourseBookEntries,
  findCourseBookEntry,
  normalizeCourseBookEntry,
} from "./courseBookEntries";

describe("course book task entries", () => {
  const combinedDay = {
    day: 2,
    topic: "German Alphabet + Personal Pronouns",
    chapter: "0.2_1.1",
    lesen_hören: [
      { chapter: "0.2", title: "German Alphabet", assignment: true, assignmentId: "A1-0.2" },
      { chapter: "1.1", title: "Personal Pronouns", assignment: true, assignmentId: "A1-1.1" },
    ],
  };

  it("creates one standardized course-book card per task on a multi-task day", () => {
    const entries = expandCourseBookEntries([combinedDay]);

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.chapter)).toEqual(["0.2", "1.1"]);
    expect(entries.map((entry) => entry.displayChapter)).toEqual(["0.2", "1.1"]);
    expect(entries.map((entry) => entry.topic)).toEqual(["German Alphabet", "Personal Pronouns"]);
    expect(entries.map((entry) => entry.lessonTitle)).toEqual(["German Alphabet", "Personal Pronouns"]);
    expect(entries.every((entry) => entry.day === 2 && entry.displayDay === 2)).toBe(true);
    expect(entries.every((entry) => entry.resourceType === COURSE_BOOK_RESOURCE_TYPES.readingListening)).toBe(true);
    expect(entries.every((entry) => entry.assessmentType === COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked)).toBe(true);
    expect(entries.every((entry) => entry.tutorMarked && entry.submissionRequired)).toBe(true);
    expect(entries.map((entry) => entry.assignment_id)).toEqual(["A1-0.2", "A1-1.1"]);
    expect(entries[0].lesen_hören.chapter).toBe("0.2");
    expect(entries[1].lesen_hören.chapter).toBe("1.1");
  });

  it("keeps a single-task day as one card while adding the canonical fields", () => {
    const day4 = { day: 4, topic: "Numbers", chapter: "2", assignment: true, assignmentId: "A1-2" };
    const entries = expandCourseBookEntries([day4]);

    expect(entries).toHaveLength(1);
    expect(entries[0]).not.toBe(day4);
    expect(entries[0]).toEqual(
      expect.objectContaining({
        day: 4,
        displayDay: 4,
        chapter: "2",
        displayChapter: "2",
        assignmentId: "A1-2",
        assignment_id: "A1-2",
        lessonTitle: "Numbers",
        resourceType: COURSE_BOOK_RESOURCE_TYPES.lesson,
        assessmentType: COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked,
        tutorMarked: true,
        selfPractice: false,
        submissionRequired: true,
      })
    );
  });

  it("normalizes legacy aliases without losing backwards compatibility", () => {
    const entry = normalizeCourseBookEntry({
      assignmentDay: "6",
      displayDay: "4",
      displayChapter: "2",
      assignment_id: "A1-2",
      title: "German Numbers",
      assignment: true,
      lesen_hören: { workbook_link: "/numbers", assignment: true },
    });

    expect(entry).toEqual(
      expect.objectContaining({
        day: 6,
        displayDay: 4,
        chapter: "2",
        displayChapter: "2",
        assignmentId: "A1-2",
        assignment_id: "A1-2",
        lessonTitle: "German Numbers",
        resourceType: COURSE_BOOK_RESOURCE_TYPES.readingListening,
      })
    );
    expect(entry.lesen_hören).toEqual(
      expect.objectContaining({
        day: 6,
        displayDay: 4,
        chapter: "2",
        assignmentId: "A1-2",
        resourceType: COURSE_BOOK_RESOURCE_TYPES.readingListening,
      })
    );
  });

  it("marks B2 and C1 entries as self-practice even when legacy data says assignment", () => {
    const entry = normalizeCourseBookEntry(
      { day: 1, chapter: "1.1", topic: "Identity", assignment: true },
      { level: "B2" }
    );

    expect(entry).toEqual(
      expect.objectContaining({
        assessmentType: COURSE_BOOK_ASSESSMENT_TYPES.selfPractice,
        tutorMarked: false,
        selfPractice: true,
        submissionRequired: false,
      })
    );
  });

  it("corrects the swapped A1 Day 3 titles and the Kapitel 1.2 grammar route", () => {
    const day3WithLegacyMismatch = {
      day: 3,
      displayDay: 3,
      chapter: "1.1",
      topic: "Personal Pronouns and Verb Conjugation",
      assignmentId: "A1-1.1",
      schreiben_sprechen: {
        chapter: "1.1",
        title: "Personal Pronouns and Verb Conjugation",
        assignment: false,
        assignmentId: "A1-1.1",
        grammarbook_link: "/campus/course/singular-pronouns-verb-conjugation-day-2",
        workbook_link: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      },
      lesen_hören: {
        chapter: "1.2",
        title: "Personal Information, Articles, Adjectives and W-Questions",
        assignment: true,
        assignmentId: "A1-1.2",
        grammarbook_link: "/campus/course/singular-pronouns-verb-conjugation-day-2",
        workbook_link: "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook",
      },
    };

    const entries = expandCourseBookEntries([day3WithLegacyMismatch], { level: "A1" });
    const chapter11 = entries.find((entry) => entry.chapter === "1.1");
    const chapter12 = entries.find((entry) => entry.chapter === "1.2");

    expect(chapter11).toEqual(
      expect.objectContaining({
        topic: "Personal Information, Articles, Adjectives and W-Questions",
        lessonTitle: "Personal Information, Articles, Adjectives and W-Questions",
        assignmentId: "A1-1.1-practice",
        assessmentType: COURSE_BOOK_ASSESSMENT_TYPES.selfPractice,
        grammarbook_link: null,
      })
    );
    expect(chapter11.schreiben_sprechen).toEqual(
      expect.objectContaining({
        title: "Personal Information, Articles, Adjectives and W-Questions",
        assignmentId: "A1-1.1-practice",
        grammarbook_link: null,
      })
    );

    expect(chapter12).toEqual(
      expect.objectContaining({
        topic: "Personal Pronouns and Verb Conjugation",
        lessonTitle: "Personal Pronouns and Verb Conjugation",
        assignmentId: "A1-1.2",
        assessmentType: COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked,
        grammarbook_link: A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE,
      })
    );
    expect(chapter12.lesen_hören).toEqual(
      expect.objectContaining({
        title: "Personal Pronouns and Verb Conjugation",
        assignmentId: "A1-1.2",
        grammarbook_link: A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE,
      })
    );
  });

  it("returns the corrected Day 3 titles from the assignment dictionary", () => {
    expect(
      getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-1.1-practice" })
    ).toEqual(
      expect.objectContaining({
        assignment_id: "A1-1.1-practice",
        title: "Personal Information, Articles, Adjectives and W-Questions",
        grammarPage: "",
      })
    );

    expect(getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-1.2" })).toEqual(
      expect.objectContaining({
        assignment_id: "A1-1.2",
        title: "Personal Pronouns and Verb Conjugation",
        grammarPage: A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE,
      })
    );
  });

  it("finds the correct task after opening or refreshing a chapter-specific lesson URL", () => {
    expect(findCourseBookEntry({ entries: [combinedDay], day: 2, chapter: "1.1" })).toEqual(
      expect.objectContaining({ chapter: "1.1", topic: "Personal Pronouns" })
    );
    expect(findCourseBookEntry({ entries: [combinedDay], day: 2, chapter: "A1-0.2" })).toEqual(
      expect.objectContaining({ chapter: "0.2", topic: "German Alphabet" })
    );
  });
});
