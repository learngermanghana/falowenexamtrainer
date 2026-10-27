import fs from "fs";
import path from "path";
import { getMockExam, getMockExamsForLevel } from "../data/mockExamCatalog";
import { A1_KOMBI_READING_PAPERS } from "../data/a1KombiReadingPapers";
import { A1_KOMBI_TASK_SETS } from "../data/a1KombiTaskSets";
import { buildA1KombiAttemptContract } from "../data/a1KombiMocks04to08";
import { getScoredMockSections, canReviewFullMock, restoreFullMockReviewState } from "../utils/mockReviewAccess";

const read = name => fs.readFileSync(path.resolve(__dirname, name), "utf8");
const app = read("../App.js");
const engine = read("./A1FinalMockExamPage.jsx");
const library = read("./MockExamLibraryPage.js");

describe("A1 Kombiprüfung Mocks 4–8 release flow", () => {
  test.each([4,5,6,7,8])("A1 Mock %s has an independent route, paper and correct module catalog card", n => {
    const id = `a1-final-0${n}`, mockId = `a1-mock-0${n}`;
    const route = `/campus/course/a1-final-mock-${n}`;
    expect(getMockExam(id)).toMatchObject({
      id, questionSetId: mockId, status: "preview",
      mode: n<=7 ? "full" : "kombi", route, sections: n<=7 ? ["Lesen","Hören","Schreiben","Sprechen"] : ["Lesen", "Schreiben", "Sprechen"],
    });
    expect(getMockExamsForLevel("A1").find(x => x.id === id)).toBeDefined();
    expect(app).toContain(`path="${route}"`);
    expect(app).toContain(`mockId="${mockId}"`);
    expect(A1_KOMBI_READING_PAPERS[n].questionCount).toBe(15);
    expect(A1_KOMBI_TASK_SETS[n].writing.teil2.points).toHaveLength(3);
    expect(A1_KOMBI_TASK_SETS[n].speaking.tasks.map(t => t.id)).toEqual(["teil1", "teil2", "teil3"]);
  });

  test("new exams contain different texts and tasks, and do not ship marking keys", () => {
    const numbers = [4,5,6,7,8];
    expect(new Set(numbers.map(n => A1_KOMBI_READING_PAPERS[n].paperText)).size).toBe(5);
    expect(new Set(numbers.map(n => A1_KOMBI_TASK_SETS[n].writing.teil2.situation)).size).toBe(5);
    for (const n of numbers) {
      const { paperText } = A1_KOMBI_READING_PAPERS[n];
      expect(paperText).not.toMatch(/LÖSUNGSSCHLÜSSEL|Musterlösungen|Lösungen: Modul Lesen/i);
      for (const field of A1_KOMBI_TASK_SETS[n].writing.teil1.formRows) {
        expect(field.kind).toBe("input");
        expect(field).not.toHaveProperty("answer");
      }
    }
  });

  test("legacy three-module exams remain reachable, while new Mocks 04/05/06/07 include Hören", () => {
    expect(engine).toContain('const hasPublishedListening = ["a1-mock-04", "a1-mock-05", "a1-mock-06", "a1-mock-07"].includes(mockId)');
    expect(engine).toContain('const hasHoren = !isKombi || (hasPublishedListening');
    expect(engine).toContain('moveToSection(hasHoren ? "hoeren" : "schreiben"');
    expect(engine).toContain('isKombiThree && stage === "schreiben" ? 15 * 60');
    expect(engine).toContain('isKombiThree ? "Start or resume 3 modules"');
    expect(engine).toContain('isKombi ? kombiSet.speaking');
    expect(engine).toContain('isKombi ? <A1KombiReadingSection');
    expect(engine).toContain('isKombiThree ? ["lesen","schreiben","sprechen"]');
    expect(library).toContain('mock.mode === "kombi"');
    expect(library).toContain("Hören is not included");
  });

  test("a completed /75 attempt stays immutable when a later /100 contract exists", () => {
    const original = buildA1KombiAttemptContract(4, {hoerenPublished:false});
    const future = buildA1KombiAttemptContract(4);
    expect(original.maxScore).toBe(75);
    expect(original.sections).toEqual(["lesen","schreiben","sprechen"]);
    expect(future.maxScore).toBe(100);
    expect(future.sections).toEqual(["lesen","hoeren","schreiben","sprechen"]);
    expect(original.sections).not.toContain("hoeren");
    expect(original.assessmentVersion).toBe("three-module-v1");
  });

  test("AI pending, backend pending and missing scores never show a final grade", () => {
    const state = {
      stage:"result", completed:true, assessmentVersion:"three-module-v1",
      sectionScores:{lesen:21,schreiben:17,sprechen:19},
      overall:{score:76,maxPoints:75,assessmentVersion:"three-module-v1"},
    };
    expect(getScoredMockSections(state)).toEqual(["lesen","schreiben","sprechen"]);
    expect(canReviewFullMock(state)).toBe(true);
    for (const altered of [
      { ...state, writingPending:true },
      { ...state, verificationPending:true },
      { ...state, overall:{score:76,maxPoints:100,assessmentVersion:"four-module-v2"} },
      { ...state, sectionScores:{lesen:21,schreiben:17} },
    ]) {
      expect(canReviewFullMock(altered)).toBe(false);
    }
    expect(restoreFullMockReviewState({...state,verificationPending:true})).toMatchObject({
      stage:"result",completed:true,
    });
    expect(engine).toContain("response?.verifiedOverall");
    expect(engine).toContain("response?.verifiedSectionScores");
    expect(engine).toContain("verificationPending:false");
  });

  test("original Mocks 1–3 preserve full four-module exam routes and scoring", () => {
    for (const n of [1,2,3]) {
      const id = `a1-final-0${n}`, existing = getMockExam(id);
      expect(existing.status).toBe("ready");
      expect(existing.mode).toBe("full");
      expect(existing.sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
    }
    expect(getScoredMockSections({assessmentVersion:"four-module-v1"})).toEqual([
      "lesen","hoeren","schreiben","sprechen",
    ]);
  });
});
