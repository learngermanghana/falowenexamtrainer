import fs from "fs";
import path from "path";
import { A1_ASSIGNMENT_ORDER, A1_ASSIGNMENT_REGISTRY } from "../data/a1AssignmentRegistry";
import { getA1CanonicalLesson, getA1CanonicalLessonForLegacyRoute } from "../data/a1CanonicalLessonCatalog";
import { getA1TutorDraftProfile } from "../data/a1TutorDraftProfiles";

describe("A1 Day 2 unified foundations assignment", () => {
  test("has one current assignment and keeps old identities readable", () => {
    expect(A1_ASSIGNMENT_ORDER.filter(id => ["A1-0.2", "A1-1.1", "A1-0.2_1.1"].includes(id))).toEqual(["A1-0.2_1.1"]);
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2"]).toBeDefined();
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.1"]).toBeDefined();
    expect(getA1CanonicalLesson("0.2")?.assignmentKey).toBe("A1-0.2_1.1");
    expect(getA1CanonicalLessonForLegacyRoute({ day: 2, identity: "1.1" })?.assignmentKey).toBe("A1-0.2_1.1");
    expect(getA1CanonicalLessonForLegacyRoute({ day: 3, identity: "1.1" })?.kind).toBe("practice");
  });
  test("uses five aligned 20-mark sections and separate draft storage", () => {
    const assignment = A1_ASSIGNMENT_REGISTRY["A1-0.2_1.1"];
    expect(assignment.sections.map(s => s.key)).toEqual(["teil-1", "teil-2", "teil-3", "teil-4", "teil-5"]);
    const profile = getA1TutorDraftProfile(assignment.assignmentKey);
    expect(Object.keys(profile.sections)).toEqual(assignment.sections.map(s => s.key));
    expect(profile.sections["teil-5"].writing).toBe(true);
    expect(profile.sections["teil-1"].items[4]).toMatchObject({ number: 5, type: "short" });
    expect(profile.sections["teil-2"].items.every(item => item.type === "choice")).toBe(true);
    for (const key of ["teil-1", "teil-2", "teil-3", "teil-4"]) {
      expect(profile.sections[key].items).toHaveLength(5);
    }
    const source = fs.readFileSync(path.join(__dirname, "A1Day2UnifiedWorkbookPage.js"), "utf8");
    expect(source).toContain("100 marks");
    expect(source).toContain("Review & Submit");
    expect(source).toContain('fallbackAssignmentKey="A1-0.2_1.1"');
    expect(source).toContain("Phonetisches Wörter-Rätsel");
    expect(source).toContain("du, ihr oder Sie?");
    expect(source).toContain("kah – ah – tay – tset – ay");
    expect(source).not.toContain("DeE6LKXyLWs");
  });
});
