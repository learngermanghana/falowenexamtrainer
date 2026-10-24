import { C1_FORMAL_EMAIL_TEMPLATE } from "./c1FormalEmailTemplate";
import { C1_WRITING_CHEAT_SHEET } from "./writingCheatSheets";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { EXAM_WRITING_MODULES } from "./examWritingWorkspace";

describe("C1 writing practice template consistency", () => {
  test("formal email template is shared between Course Book cheat sheet and Exams Room", () => {
    const section = C1_WRITING_CHEAT_SHEET.find(({ id }) => id === "c1-formal-letter-template");
    expect(section).toBeDefined();
    expect(section.items).toBe(C1_FORMAL_EMAIL_TEMPLATE);
    expect(section.items).toHaveLength(7);
    expect(section.items[0].meaning).toContain("Betreff:");
    expect(section.items[1].meaning).toContain("Sehr geehrte Frau");
    expect(section.items[2].meaning).toContain("mit diesem Schreiben möchte ich mich");
    expect(section.items[5].meaning).toContain("Möglicherweise ließe sich");
    expect(section.items[6].meaning).toContain("Mit freundlichen Grüßen");
  });

  test("C1 opinion template has six complete paragraphs including concrete example and counterargument", () => {
    const paragraphs = C1_APPROVED_OPINION_ESSAY_TEMPLATE.split(/\n\n+/);
    expect(paragraphs).toHaveLength(6);
    expect(paragraphs[0]).toContain("öffentlichen Diskurs");
    expect(paragraphs[1]).toContain("Zunächst lässt sich anführen");
    expect(paragraphs[2]).toContain("Als anschauliches Beispiel");
    expect(paragraphs[3]).toContain("Nichtsdestoweniger");
    expect(paragraphs[4]).toContain("zielführende Alternative");
    expect(paragraphs[5]).toContain("trotz der Einwände");
    expect(C1_APPROVED_OPINION_ESSAY_TEMPLATE).not.toContain("In der heutigen Zeit wird oft");
  });

  test("C1 Exams Room has 10 unique four-point tasks in each of two parts", () => {
    const [discussion, email] = EXAM_WRITING_MODULES.C1.parts;
    expect(discussion.tasks).toHaveLength(10);
    expect(email.tasks).toHaveLength(10);
    expect(discussion.tasks.every(t => t.points.length === 4)).toBe(true);
    expect(email.tasks.every(t => t.points.length === 4 && t.register === "formal")).toBe(true);
    expect(new Set([...discussion.tasks, ...email.tasks].map(t => t.id)).size).toBe(20);
    expect(discussion.description).toMatch(/50 minutes/);
    expect(email.description).toMatch(/25 minutes/);
  });
});
