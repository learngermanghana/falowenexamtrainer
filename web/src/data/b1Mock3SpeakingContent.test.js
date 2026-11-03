import { B1_MOCK3_SPEAKING, buildB1Mock3SpeakingTasks } from "./b1Mock3SpeakingContent";
import { MOCK_EXAM_CATALOG } from "./mockExamCatalog";

describe("B1 Mock 3 Sprechen source content", () => {
  const mock = B1_MOCK3_SPEAKING;

  test("preserves 15-minute preparation, 15-minute pair exam, and source scoring orientation", () => {
    expect(mock.mockId).toBe("b1-mock-03");
    expect(mock.preparationMinutes).toBe(15);
    expect(mock.durationMinutes).toBe(15);
    expect(mock.assessment).toEqual({ maxPoints: 100, passPoints: 60, status: "practice-only" });
  });

  test("Teil 1 uses the actual accident, hospital visit, gift and next-week help task", () => {
    expect(mock.teil1.situation).toContain("Unfall");
    expect(mock.teil1.situation).toContain("Krankenhaus");
    expect(mock.teil1.situation).toContain("Nächste Woche");
    expect(mock.teil1.points).toHaveLength(4);
    expect(mock.teil1.points[0]).toContain("Wann besuchen?");
    expect(mock.teil1.points[1]).toContain("Wie hinkommen?");
    expect(mock.teil1.points[2]).toContain("Was mitnehmen?");
    expect(mock.teil1.points[3]).toContain("Wie kann man helfen?");
    expect(mock.teil1.phrases).toHaveLength(4);
  });

  test("Teil 2 gives two precise source topics and five standardized Folien", () => {
    expect(mock.teil2.topics.map(item => item.title)).toEqual([
      "Brauchen Kinder Mobiltelefone?", "Sehen Kinder zu viel fern?",
    ]);
    expect(mock.teil2.slides.map(item => item.number)).toEqual([1,2,3,4,5]);
    expect(mock.teil2.slides.map(item => item.label)).toEqual([
      "Thema & Struktur", "Eigene Erfahrungen", "Situation im Heimatland",
      "Vor- und Nachteile & Meine Meinung", "Abschluss & Dank",
    ]);
  });

  test("Teil 3 requires feedback, one question and a response to the partner question", () => {
    expect(mock.teil3.steps).toHaveLength(3);
    expect(mock.teil3.steps[0].label).toBe("Feedback geben");
    expect(mock.teil3.steps[1].label).toBe("Frage stellen");
    expect(mock.teil3.steps[2].label).toBe("Frage beantworten & Dank");
  });

  test("live examiner tasks carry independent practice identity and the chosen topic", () => {
    const first = buildB1Mock3SpeakingTasks("a");
    const second = buildB1Mock3SpeakingTasks("b");
    expect(first.map(x => x.teil)).toEqual(["1","2","3"]);
    expect(first[0].prompt).toContain("Krankenhaus");
    expect(first[1].keywords).toBe("Brauchen Kinder Mobiltelefone?");
    expect(second[1].keywords).toBe("Sehen Kinder zu viel fern?");
    expect(first[1].prompt).toContain("Folie 5");
    expect(second[2].prompt).toContain("Feedback");
  });

  test("Mock 3 is a set of separate practice modules, not a verified full mock", () => {
    const item = MOCK_EXAM_CATALOG["b1-mock-03-pending"];
    expect(item.status).toBe("preview");
    expect(item.mode).toBe("section-preview");
    expect(item.sections).toContain("Sprechen · 3 parts");
    expect(item.sections).toContain("Hören · 30 questions");
  });
});
