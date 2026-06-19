import { expandCourseBookEntries, findCourseBookEntry } from "./courseBookEntries";

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

  it("creates one course-book card per task on a multi-task day", () => {
    const entries = expandCourseBookEntries([combinedDay]);

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.chapter)).toEqual(["0.2", "1.1"]);
    expect(entries.map((entry) => entry.topic)).toEqual(["German Alphabet", "Personal Pronouns"]);
    expect(entries.every((entry) => entry.day === 2)).toBe(true);
    expect(entries[0].lesen_hören.chapter).toBe("0.2");
    expect(entries[1].lesen_hören.chapter).toBe("1.1");
  });

  it("keeps a single-task day as one normal day card", () => {
    const day4 = { day: 4, topic: "Numbers", chapter: "2", assignment: true };
    const entries = expandCourseBookEntries([day4]);

    expect(entries).toHaveLength(1);
    expect(entries[0]).toBe(day4);
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
