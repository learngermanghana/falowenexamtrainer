import { getA2ReadingTask } from "./a2ReadingTasks";

describe("A2 Day 15 reading difficulty", () => {
  test("uses multi-condition matching rather than direct fact lookup", () => {
    const task = getA2ReadingTask(15);
    expect(task.format).toBe("Sportangebote zuordnen");
    expect(task.text).toMatch(/Anmeldung erforderlich/);
    expect(task.text).toMatch(/Anfänger/);
    expect(task.questions).toHaveLength(5);
    expect(task.questions[0].stem).toMatch(/lange keinen Sport gemacht.*wieder anfangen/i);
    expect(task.questions[1].stem).toMatch(/Freitag.*keinen eigenen Schläger/i);
    expect(task.questions[2].stem).toMatch(/Tochter.*spontan/i);
    expect(task.questions[3].stem).toMatch(/mittwochs abends.*gut schwimmen/i);
    expect(task.questions[4].stem).toMatch(/nichts bezahlen.*zweimal pro Woche.*nicht vorher anmelden/i);
  });
});
