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

  test("Day 15 ignores stale Daniel/source structure", () => {
    const items = resolveWritingSupportItems({
      day: 15,
      supportStructure: [
        "Reaktion: Ich stimme Daniel zu / nur teilweise zu, weil ...",
        "Vorteile: E-Mails, Videokonferenzen und digitale Tools ermöglichen ...",
      ],
    }, "B1");

    expect(items).toEqual([
      "Erklären Sie, wie digitale Medien das Arbeiten im Homeoffice erleichtern können.",
      "Nennen Sie mindestens ein Problem oder Risiko digitaler Medien im Homeoffice.",
      "Schlagen Sie eine Lösung vor und formulieren Sie Ihre eigene Meinung.",
    ]);
    expect(items.join(" ")).not.toMatch(/Daniel/i);
  });

  test("Day 19 gets the same three points even without page-provided supportStructure", () => {
    const items = resolveWritingSupportItems({ day: 19 }, "B1");

    expect(items).toEqual([
      "Sagen Sie, ob Vorstellungsgespräche schwierig oder stressig sind, und begründen Sie Ihre Meinung.",
      "Erklären Sie, wie man sich auf ein Vorstellungsgespräch vorbereiten kann.",
      "Nennen Sie, was für ein erfolgreiches Gespräch besonders wichtig ist.",
    ]);
  });

  test("Day 21 ignores stale Mara/source structure", () => {
    const items = resolveWritingSupportItems({
      day: 21,
      supportStructure: [
        "Einleitung zum Thema",
        "Reaktion auf Maras Meinung",
        "Eigene Meinung",
      ],
    }, "B1");

    expect(items).toEqual([
      "Vergleichen Sie Familie, Wohngemeinschaft und Singleleben und nennen Sie wichtige Vor- oder Nachteile.",
      "Sagen Sie, welche Lebensform für Sie am besten passt.",
      "Begründen Sie Ihre Meinung mit einem persönlichen Beispiel oder der Situation in Ihrem Heimatland.",
    ]);
    expect(items.join(" ")).not.toMatch(/Mara/i);
  });

  test("Day 23 ignores stale Sophie/source structure", () => {
    const items = resolveWritingSupportItems({
      day: 23,
      supportStructure: [
        "Reaktion auf Sophies Meinung",
        "Argument für die Bedeutung des ersten Dates",
      ],
    }, "B1");

    expect(items).toEqual([
      "Sagen Sie, wie wichtig der erste Eindruck bei einem ersten Date sein kann.",
      "Erklären Sie, warum ein erstes Date auch täuschen kann.",
      "Geben Sie ein Beispiel und begründen Sie Ihre eigene Meinung.",
    ]);
    expect(items.join(" ")).not.toMatch(/Sophie/i);
  });

  test("Day 25 uses the same three complaint-letter points as the cleaned task card", () => {
    const items = resolveWritingSupportItems({
      day: 25,
      supportStructure: [
        "Anrede: Sehr geehrte Damen und Herren,",
        "Bestellung und Schaden genau beschreiben.",
        "Grußformel und Name.",
      ],
    }, "B1");

    expect(items).toEqual([
      "Erklären Sie, wann Sie das Handy gekauft haben und was bei der Lieferung kaputt war.",
      "Beschreiben Sie, wann und wie Sie das Handy zurückgeschickt haben.",
      "Sagen Sie, welche Lösung Sie erwarten, und bitten Sie höflich um eine schnelle Antwort.",
    ]);
  });

  test("Day 27 ignores stale Ahmed/source structure", () => {
    const items = resolveWritingSupportItems({
      day: 27,
      supportStructure: [
        "Reaktion auf Ahmeds Meinung",
        "Argumente und Beispiele",
      ],
    }, "B1");

    expect(items).toEqual([
      "Erklären Sie, warum umweltfreundliches Leben wichtig ist, und nennen Sie Beispiele aus dem Alltag.",
      "Beschreiben Sie eine Schwierigkeit, die umweltfreundliches Verhalten erschweren kann.",
      "Begründen Sie Ihre eigene Meinung und formulieren Sie einen klaren Schluss.",
    ]);
    expect(items.join(" ")).not.toMatch(/Ahmed/i);
  });

  test("Day 28 replaces the old model structure with the concise climate task", () => {
    const items = resolveWritingSupportItems({
      day: 28,
      supportStructure: ["Einleitung", "Eigene Meinung", "Beispiele", "Schwierigkeiten", "Begründung", "Schluss"],
    }, "B1");

    expect(items).toEqual([
      "Nennen Sie konkrete Möglichkeiten, im Verkehr, beim Einkaufen oder zu Hause klimafreundlicher zu leben.",
      "Beschreiben Sie eine Schwierigkeit, zum Beispiel Geld, Wohnort oder Gewohnheiten.",
      "Sagen Sie, ob jeder Mensch klimafreundlich leben kann, und begründen Sie Ihre Meinung.",
    ]);
  });

  test("keeps the original support structure outside the cleaned Day 6 to 28 range", () => {
    expect(resolveWritingSupportItems({
      day: 29,
      supportStructure: ["Original structure"],
      taskPoints: ["Original task point"],
    }, "B1")).toEqual(["Original structure"]);
  });

  test("does not apply B1 cleanup points to A2 workbooks", () => {
    expect(resolveWritingSupportItems({
      day: 21,
      supportStructure: ["A2 structure"],
    }, "A2")).toEqual(["A2 structure"]);
  });
});
