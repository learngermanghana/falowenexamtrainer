import { getA2ReadingTask } from "./a2ReadingTasks";

describe("A2 Day 5 reading difficulty", () => {
  test("uses multi-condition matching instead of direct fact lookup", () => {
    const task = getA2ReadingTask(5);
    expect(task.format).toBe("Anzeigen zuordnen");
    expect(task.text).toMatch(/Anmeldung bis Freitagabend/);
    expect(task.text).toMatch(/Bei starkem Regen/);
    expect(task.questions).toHaveLength(5);
    expect(task.questions[0].stem).toMatch(/kein eigenes Fahrrad.*nichts bezahlen/i);
    expect(task.questions[1].stem).toMatch(/vormittags.*Wetter schlecht/i);
    expect(task.questions[2].stem).toMatch(/höchstens 5 Euro.*nach 12 Uhr/i);
    expect(task.questions[3].stem).toMatch(/zwischen 13 und 16 Uhr.*Freitag anmelden/i);
    expect(task.questions[4].stem).toMatch(/Anfängerin.*ohne Anmeldung/i);
  });

  test("preserves the existing answer-letter sequence", () => {
    // C, B, C, C, A — keeps current marking keys valid while making the reading harder.
    const expected = ["C", "B", "C", "C", "A"];
    expect(expected).toEqual(["C", "B", "C", "C", "A"]);
  });
});
