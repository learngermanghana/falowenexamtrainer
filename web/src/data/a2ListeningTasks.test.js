import { A2_LISTENING_MODES, getA2ListeningTask } from "./a2ListeningTasks";

describe("A2 listening tasks", () => {
  test.each([
    [6, "3.6", "a2/day-06/day-06.mp3"],
    [7, "3.7", "a2/day-07/day-07.mp3"],
    [8, "3.8", "a2/day-08/day-08.mp3"],
    [9, "4.9", "a2/day-09/day-09.mp3"],
    [10, "4.10", "a2/day-10/day-10.mp3"],
    [11, "4.11", "a2/day-11/day-11.mp3"],
    [12, "5.12", "a2/day-12/day-12.mp3"],
    [13, "5.13", "a2/day-13/day-13.mp3"],
    [15, "6.15", "a2/day-15/day-15.mp3"],
    [16, "6.16", "a2/day-16/day-16.mp3"],
    [24, "9.24", "a2/day-24/day-24.mp3"],
    [26, "10.26", "a2/day-26/day-26.mp3"],
    [27, "10.27", "a2/day-27/day-27.mp3"],
    [28, "10.28", "a2/day-28/day-28.mp3"],
  ])("Day %i uses protected R2 audio with five graded transcript questions", (day, chapter, audioKey) => {
    const task = getA2ListeningTask(day);

    expect(task).toMatchObject({
      chapter,
      mode: A2_LISTENING_MODES.GRADED,
      audioKey,
      audioUrl: "",
    });
    expect(task.questions).toHaveLength(5);
  });

  test("Day 16 five Lena–Max questions match the newly published listening answer choices", () => {
    const task = getA2ListeningTask(16);
    expect(task.questions.map((q) => q.stem)).toEqual([
      "Warum sieht Lena müde aus?",
      "Wann geht Max zum Yogakurs?",
      "Wie viel kostet die erste Yogastunde für Lena?",
      "Was macht Max, um abends besser zu schlafen?",
      "Wo treffen sich Lena und Max am Samstag?",
    ]);
    expect(task.questions.map((q, i) => q.options[({ B: 1, A: 0, C: 2 })["BACBA"[i]].slice(0, 1))).toEqual(["B", "A", "C", "B", "A"]);
    expect(task.task).toContain("Lena und Max");
  });

  test("Day 28 keeps the approved future-plans question set", () => {
    const task = getA2ListeningTask(28);
    expect(task.questions.map((item) => item.stem)).toEqual([
      "Warum möchte Anna eine Weiterbildung im Bereich Tourismus machen?",
      "Was ist Annas berufliches Ziel in ungefähr drei Jahren?",
      "Warum möchte David nächstes Jahr einen Kurs in Webentwicklung beginnen?",
      "Wofür spart David jeden Monat Geld?",
      "Was plant Mariam für nächstes Jahr?",
    ]);
  });
});
