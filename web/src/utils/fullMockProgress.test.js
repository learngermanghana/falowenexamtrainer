import fs from "fs";
import path from "path";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import {
  FULL_MOCK_SKILLS,
  getFullMockSkillForStage,
  getFullMockProgress,
  getFullMockWeakestSkills,
  getFullMockPracticeRoutes,
} from "./fullMockProgress";

const component = (name) => fs.readFileSync(path.resolve(__dirname, "../components", name), "utf8");

describe("A1–C2 honest mock completion and recovery", () => {
  it("uses four distinct skills for full mocks A1, A2, B1 and B2", () => {
    expect(FULL_MOCK_SKILLS.map((skill) => skill.key)).toEqual(["lesen", "hoeren", "schreiben", "sprechen"]);
    ["A1", "A2", "B1", "B2"].forEach((level) => {
      const mock = getMockExamsForLevel(level, { includeCourse: true }).find((item) => item.mode === "full");
      expect(mock).toBeTruthy();
      expect(mock.sections).toEqual(["Lesen", "Hören", "Schreiben", "Sprechen"]);
      const source = component(`${level}FinalMockExamPage.jsx`);
      expect(source).toContain("<FullMockGuide");
      expect(source).toContain("<FullMockRecovery");
    });
  });

  it("counts zero-score completed sections as complete, never missing or failed", () => {
    expect(getFullMockProgress({ stage: "hoeren", completedSkills: ["lesen"] })).toMatchObject({
      count: 1, total: 4, current: "hoeren", complete: false,
    });
    expect(getFullMockProgress({
      stage: "result", completedSkills: ["lesen", "hoeren", "schreiben"], complete: true,
    }).complete).toBe(false);
    expect(getFullMockProgress({
      stage: "result", completedSkills: ["lesen", "hoeren", "schreiben", "sprechen"], complete: true,
    }).complete).toBe(true);
    expect(getFullMockWeakestSkills({ lesen: 20, hoeren: 0, schreiben: 15, sprechen: 8 })
      .map((skill) => skill.key)).toEqual(["hoeren", "sprechen", "schreiben", "lesen"]);
  });

  it("understands B2's separately timed reading and listening Teile", () => {
    ["teil1", "teil2", "teil3", "teil4"].forEach((stage) =>
      expect(getFullMockSkillForStage(stage)).toBe("lesen"));
    ["hoeren-teil1", "hoeren-teil2", "hoeren-teil3", "hoeren-teil4"].forEach((stage) =>
      expect(getFullMockSkillForStage(stage)).toBe("hoeren"));
    expect(getFullMockSkillForStage("schreiben")).toBe("schreiben");
    expect(getFullMockSkillForStage("sprechen")).toBe("sprechen");
  });

  it("preserves completed B2 scores and numbers successive retakes", () => {
    const source = component("B2FinalMockExamPage.jsx");
    expect(source).toContain("if (!state.resultSyncScoreDocId) return");
    expect(source).toContain("attemptNumber: Math.max(1, Number(state.attemptNumber) || 1)");
    expect(source).toContain("Math.max(1, Number(current.attemptNumber) || 1) + 1");
    expect(source).toContain("<FullMockRecovery");
  });

  it("labels C1 as reading-only and C2 as unpublished instead of inventing four-module scores", () => {
    const c1 = getMockExamsForLevel("C1", { includeCourse: true });
    const c2 = getMockExamsForLevel("C2", { includeCourse: true });
    expect(c1).toHaveLength(1);
    expect(c1[0].mode).toBe("section-preview");
    expect(c1[0].sections).toEqual(["Lesen only (four Teile)"]);
    expect(c2).toHaveLength(1);
    expect(c2[0].status).toBe("planned");
    expect(c2[0].mode).toBe("section-preview");
    expect(component("C1FinalMockExamPage.jsx")).toContain("kein vollständiger vierteiliger C1-Mock");
    expect(component("MockExamLibraryPage.js")).toContain("No overall mock pass/fail score");
  });

  it("never links to nonexistent B2/C2 listening or reading native sample URLs", () => {
    expect(getFullMockPracticeRoutes("B1")).toEqual({
      lesen: "/exams/lesen/b1/sample-1", hoeren: "/exams/horen/b1/sample-1",
      schreiben: "/exams/writing", sprechen: "/exams/speaking",
    });
    expect(getFullMockPracticeRoutes("B2").hoeren).toBe("/exams/horen");
    expect(getFullMockPracticeRoutes("C2").lesen).toBe("/exams/lesen");
  });
});
