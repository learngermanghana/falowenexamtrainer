import fs from "fs";
import path from "path";
import { getA1RadioResource } from "../data/a1RadioResources";
import { getB2C1RadioResource } from "../data/b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "../data/lessonModel";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("requested Falowen Radio lessons", () => {
  it("keeps the approved A1 Day 1 greetings and well-being radio video", () => {
    expect(getA1RadioResource(1)).toEqual(
      expect.objectContaining({
        key: "a1-day1-greetings-wellbeing-falowen-radio",
        title: "Greetings and Asking About Well-being · Kapitel 0.1",
        youtubeId: "rqnqC3AyfDk",
      }),
    );
  });

  it("keeps the existing A1 Day 1 assignment behind the radio gate", () => {
    const source = read("A1Day1GreetingsWorkbookPage.js");

    expect(source).toContain('import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate"');
    expect(source).toContain('import { getA1RadioResource } from "../data/a1RadioResources"');
    expect(source).toContain('<RadioFirstWorkbookGate level="A1" day={1} resource={radio}>');
    expect(source).toContain("<A1TutorMarkedWorkbookShell");
    expect(source).toContain('fallbackAssignmentKey="A1-0.1"');
    expect(source).toContain('chapter="0.1"');
  });

  it("adds the approved A1 Day 2 Kapitel 0.2 German Alphabet radio only to that workbook", () => {
    expect(getA1RadioResource(2, "0.2")).toEqual(
      expect.objectContaining({
        key: "a1-day2-german-alphabet-falowen-radio",
        title: "German Alphabet · Kapitel 0.2",
        youtubeId: "7F9nEMpvRpY",
      }),
    );
    expect(getA1RadioResource(2, "1.1")).toBeNull();

    const source = read("A1Day3GermanAlphabetReviewingWorkbookPage.js");
    expect(source).toContain('import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate"');
    expect(source).toContain('const radio = getA1RadioResource(day, "0.2")');
    expect(source).toContain('<RadioFirstWorkbookGate level={level} day={day} resource={radio}>');
    expect(source).toContain('assignment.chapter === "0.2"');
    expect(source).toContain('return alphabetAssignment?.assignmentKey || "A1-0.2"');
  });

  test.each([
    ["B2", 26, "Behörden, Termine und formelle Kommunikation 6.1", "Bg_mSJcwkPE"],
    ["C1", 11, "Engagement und Ehrenamt 3.1", "orR1ptbJtnc"],
    ["C1", 12, "Freizeit und Kultur 3.2", "TTK_idHXnZs"],
    ["C1", 13, "Mehrsprachigkeit 3.3", "noCqZEAmJew"],
  ])("adds %s Day %i to the shared self-learning radio registry", (level, day, title, youtubeId) => {
    expect(getB2C1RadioResource(level, day)).toEqual(
      expect.objectContaining({ title, youtubeId }),
    );

    expect(
      normalizeB2C1Lesson(
        { level, day, chapter: level === "B2" ? "6.1" : `3.${day - 10}`, title },
        level,
      ).resources.falowenRadio,
    ).toEqual(expect.objectContaining({ title, youtubeId }));
  });

  it("reuses the existing radio-first guided pages for B2 and C1", () => {
    const b2Source = read("B2Day25To28GuidedLessonPage.js");
    const c1Source = read("CompactC1LessonPage.js");

    expect(b2Source).toContain("const radio = canonicalLesson?.resources?.falowenRadio || null");
    expect(b2Source).toContain("<FalowenRadioTabContent");
    expect(c1Source).toContain("const radio = canonicalLesson?.resources?.falowenRadio || null");
    expect(c1Source).toContain("<FalowenRadioTabContent");
  });

  it("allows an explicit radio resource without changing existing A2 and B1 lookups", () => {
    const source = read("RadioFirstWorkbookGate.js");

    expect(source).toContain("const RadioFirstWorkbookGate = ({ level, day, children, resource = null })");
    expect(source).toContain("const radio = resource || getRadioResource(level, day)");
  });
});
