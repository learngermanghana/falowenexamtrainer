import { A2_LISTENING_MODES, getA2ListeningTask } from "./a2ListeningTasks";

describe("A2 listening tasks", () => {
  test("Day 28 uses the protected R2 recording and five transcript-based graded questions", () => {
    const task = getA2ListeningTask(28);

    expect(task).toMatchObject({
      chapter: "10.28",
      mode: A2_LISTENING_MODES.GRADED,
      audioKey: "a2/day-28/day-28.mp3",
      audioUrl: "",
    });
    expect(task.questions).toHaveLength(5);
    expect(task.questions.map((item) => item.stem)).toEqual([
      "Warum möchte Anna eine Weiterbildung im Bereich Tourismus machen?",
      "Was ist Annas berufliches Ziel in ungefähr drei Jahren?",
      "Warum möchte David nächstes Jahr einen Kurs in Webentwicklung beginnen?",
      "Wofür spart David jeden Monat Geld?",
      "Was plant Mariam für nächstes Jahr?",
    ]);
  });
});
