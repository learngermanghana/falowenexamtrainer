import { resolveWritingSupportItems } from "./B1WritingWorkspace";

describe("resolveWritingSupportItems", () => {
  test("Day 9 ignores stale Lisa/source structure after the source card is removed", () => {
    const items = resolveWritingSupportItems({
      day: 9,
      supportStructure: [
        "Einleitung zum Thema",
        "Reaktion auf Lisas Meinung",
        "Argumente dafür",
      ],
      taskPoints: ["Fassen Sie Lisas Meinung kurz zusammen."],
    }, "B1");

    expect(items).toEqual([
      "Erklären Sie einen Vorteil und einen Nachteil moderner Arbeitsmodelle für die Work-Life-Balance.",
      "Beschreiben Sie, welche Rolle flexible Arbeitszeiten oder Homeoffice spielen.",
      "Geben Sie ein Beispiel und formulieren Sie Ihre eigene Meinung.",
    ]);
    expect(items.join(" ")).not.toMatch(/Lisa/i);
  });

  test("Day 10 ignores stale Impulstext structure after the source card is removed", () => {
    const items = resolveWritingSupportItems({
      day: 10,
      supportStructure: [
        "Einleitung und Bezug zum Impulstext",
        "Vorteile einer digitalen Auszeit",
      ],
    }, "B1");

    expect(items).toEqual([
      "Nennen Sie zwei Vorteile einer digitalen Auszeit.",
      "Erklären Sie eine Schwierigkeit und nennen Sie konkrete Strategien für weniger Bildschirmzeit.",
      "Geben Sie ein persönliches Beispiel und formulieren Sie Ihre eigene Meinung.",
    ]);
    expect(items.join(" ")).not.toMatch(/Impulstext/i);
  });

  test("keeps the original support structure outside the cleaned Day 6 to 12 range", () => {
    expect(resolveWritingSupportItems({
      day: 20,
      supportStructure: ["Original structure"],
      taskPoints: ["Original task point"],
    }, "B1")).toEqual(["Original structure"]);
  });

  test("does not apply B1 cleanup points to A2 workbooks", () => {
    expect(resolveWritingSupportItems({
      day: 9,
      supportStructure: ["A2 structure"],
    }, "A2")).toEqual(["A2 structure"]);
  });
});
