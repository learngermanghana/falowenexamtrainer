import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import { validateA2B1WorkbookSubmissionSections } from "./a2B1WorkbookSectionProfile";

describe("validateA2B1WorkbookSubmissionSections", () => {
  it("blocks an empty workbook", () => {
    const result = validateA2B1WorkbookSubmissionSections({ level: "A2", day: 21, text: "" });
    expect(result.ok).toBe(false);
    expect(result.missingParts.length).toBeGreaterThan(0);
  });

  it("blocks a required section that contains only its heading", () => {
    const profile = getA2B1LessonProfile("B1", 24);
    const first = profile.requiredSubmissionParts[0];
    const result = validateA2B1WorkbookSubmissionSections({
      level: "B1", day: 24, text: `Teil ${first.number} · ${first.label}`,
    });
    expect(result.ok).toBe(false);
    expect(result.missingParts).toContain(first.partId);
  });

  it("accepts answers under every required part and ignores non-required parts", () => {
    const profile = getA2B1LessonProfile("A2", 21);
    const text = profile.requiredSubmissionParts
      .map((part) => `Teil ${part.number} · ${part.label}: Antwort ${part.number}`)
      .join("\n");
    const result = validateA2B1WorkbookSubmissionSections({ level: "A2", day: 21, text });
    expect(result.ok).toBe(true);
    expect(result.missingParts).toEqual([]);
  });

  it("allows a legacy unlabelled answer for a single-part assignment", () => {
    const singlePartDay = Array.from({ length: 28 }, (_, index) => index + 1)
      .find((day) => getA2B1LessonProfile("A2", day)?.requiredSubmissionParts?.length === 1);
    expect(singlePartDay).toBeTruthy();
    const result = validateA2B1WorkbookSubmissionSections({
      level: "A2", day: singlePartDay, text: "Das ist meine Antwort.",
    });
    expect(result.ok).toBe(true);
  });
});
