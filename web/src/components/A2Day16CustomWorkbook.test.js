import fs from "fs";
import path from "path";
import { getA2ReadingTask } from "../data/a2ReadingTasks";
import { A2_LISTENING_MODES, getA2ListeningTask } from "../data/a2ListeningTasks";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const standardShell = read("A2StandardTabbedWorkbookPage.js");
const day16 = read("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");
const day19 = read("A2Day19EinkaufenWoUndWieWorkbookPage.js");

describe("A2 Day 16 and Day 19 complete workbooks", () => {
  it("keeps Grammar, speaking, writing, reading, listening and submission in the shared shell", () => {
    expect(day16).toContain("A2StandardTabbedWorkbookPage");
    expect(day19).toContain("A2StandardTabbedWorkbookPage");
    expect(standardShell).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");
    ["grammar", "sprechen", "schreiben", "lesen", "hoeren", "references", "submit"].forEach((tab) => {
      expect(standardShell).toContain(`displayedActiveTab === "${tab}"`);
    });
    expect(standardShell).toContain("<A2ReadingTaskPanel day={day} />");
    expect(standardShell).toContain("const listeningConfig = getA2ListeningTask(day)");
    expect(standardShell).toContain("const hoerenQuestions = listeningConfig?.questions || []");
    expect(standardShell).toContain("ContextualAssignmentSubmissionPage");
    expect(standardShell).toContain("getA2B1LessonProfile(\"A2\", day)");
  });

  it.each([
    [16, "6.16", "Wohlbefinden und Entspannung", "a2/day-16/day-16.mp3"],
    [19, "7.19", "Einkaufen? Wo und wie?", "1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB"],
  ])("retains A2 Day %i reading, listening and marking through the canonical task banks", (day, chapter, title, audioId) => {
    const source = day === 16 ? day16 : day19;
    const reading = getA2ReadingTask(day);
    const listening = getA2ListeningTask(day);
    const profile = getA2B1LessonProfile("A2", day);

    expect(source).toContain(`day={${day}}`);
    expect(source).toContain(`chapter="${chapter}"`);
    expect(source).toContain(`title="${title}"`);
    expect(reading).toMatchObject({ chapter });
    expect(reading.text.length).toBeGreaterThan(150);
    expect(reading.questions).toHaveLength(5);
    expect(listening).toMatchObject({ chapter, mode: A2_LISTENING_MODES.GRADED });
    if (day === 16) {
      expect(listening.audioKey).toBe(audioId);
      expect(listening.audioUrl).toBe("");
    } else {
      expect(listening.audioUrl).toContain(audioId);
    }
    expect(listening.questions).toHaveLength(5);
    expect(profile.sections.reading).toMatchObject({ visible: true, submitRequired: true });
    expect(profile.sections.part4).toMatchObject({ visible: true, submitRequired: true, contentType: "listening" });
    expect(profile.requiredSubmissionParts.map((part) => part.partId)).toEqual(
      expect.arrayContaining(["teil3", "teil4"]),
    );
  });

  it("makes the replacement teacher lecture accessible from the Day 16 direct workbook URL", () => {
    expect(standardShell).toContain('data-a2-day16-teacher-lecture="true"');
    expect(standardShell).toContain('getTeacherLectureVideoResources("A2", day)');
    expect(standardShell).toContain("Watch teacher lecture on YouTube");
    expect(standardShell).toContain("inlineTeacherLecture.url");
    expect(standardShell).toContain("getA2ListeningTask(day)");
  });

  it("keeps Day 16 speaking and the updated informal Markus writing assignment", () => {
    ["Körperliches Wohlbefinden", "Mentales Wohlbefinden", "Krankheiten &amp; Symptome", "E-Mail an Markus"].forEach((label) => {
      expect(day16).toContain(label);
    });
    expect(getA2ReadingTask(16).text).toContain("Yoga am Abend");
    expect(day16).toContain("Lieber Markus");
    expect(day16).not.toContain("Sehr geehrte Damen und Herren");
  });

  it("keeps Day 19 shopping practice and consumption listening", () => {
    expect(day19).toContain("Einladung zum Einkaufen");
    expect(getA2ReadingTask(19).text).toContain("Secondhand-Laden");
    expect(getA2ListeningTask(19).task).toContain("Konsumverhalten");
  });
});
