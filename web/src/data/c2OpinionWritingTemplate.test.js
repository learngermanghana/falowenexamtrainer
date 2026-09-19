import { getC2ExamStandard } from "./c2ExamStandardContent";
import { buildC2OpinionWritingTemplate } from "./c2OpinionWritingTemplate";

describe("C2 saved opinion writing template", () => {
  test.each(Array.from({ length: 14 }, (_, index) => index * 2 + 1))(
    "Day %i opinion task receives the reusable editorial template",
    (day) => {
      const standard = getC2ExamStandard(day);
      expect(standard.writeType).toBe("opinion");
      const template = buildC2OpinionWritingTemplate(standard);

      expect(template).toContain(`die Diskussion über „${standard.title}“`);
      expect(template).toContain("Sehr geehrte Damen und Herren,");
      expect(template).toContain("[Beitrag 1 mit eigenen Worten wiedergeben]");
      expect(template).toContain("[Beitrag 2 mit eigenen Worten wiedergeben]");
      expect(template).toContain("[Beitrag 3 mit eigenen Worten wiedergeben]");
      expect(template).toContain("Meines Erachtens lässt sich die Frage nicht einseitig beantworten.");
      expect(template).toContain("Zusammenfassend lässt sich festhalten");
      expect(template).toContain("Mit freundlichen Grüßen");
    },
  );

  test.each(Array.from({ length: 14 }, (_, index) => index * 2 + 2))(
    "Day %i remains a reformulation task without an essay template requirement",
    (day) => {
      expect(getC2ExamStandard(day).writeType).toBe("reformulation");
    },
  );
});
