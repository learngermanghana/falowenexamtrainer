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

  it("finds the correct task after opening or refreshing a chapter-specific lesson URL", () => {
    expect(findCourseBookEntry({ entries: [combinedDay], day: 2, chapter: "1.1" })).toEqual(
      expect.objectContaining({ chapter: "1.1", topic: "Personal Pronouns" })
    );
    expect(findCourseBookEntry({ entries: [combinedDay], day: 2, chapter: "A1-0.2" })).toEqual(
      expect.objectContaining({ chapter: "0.2", topic: "German Alphabet" })
    );
  });
});
