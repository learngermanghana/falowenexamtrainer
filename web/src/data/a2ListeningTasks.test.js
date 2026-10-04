import { A2_LISTENING_MODES, getA2ListeningTask } from "./a2ListeningTasks";

describe("A2 listening tasks", () => {
  test.each([
    [8, "3.8", "a2/day-08/day-08.mp3"],
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
