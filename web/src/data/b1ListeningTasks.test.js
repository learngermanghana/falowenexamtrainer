import { B1_LISTENING_TASKS, getB1ListeningTask } from "./b1ListeningTasks";

describe("B1 canonical listening registry", () => {
  test("covers all 28 B1 workbook days exactly once", () => {
    expect(Object.keys(B1_LISTENING_TASKS).map(Number).sort((a, b) => a - b))
      .toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
  });

  test.each(Array.from({ length: 28 }, (_, index) => index + 1))(
    "Day %i has an explicit listening contract",
    (day) => {
      const task = getB1ListeningTask(day);
      expect(task).toBeTruthy();
      expect(task.title).toBeTruthy();
      expect(task.instructions).toBeTruthy();
      expect(typeof task.submitRequired).toBe("boolean");
    }
  );

  test("submitted audio days keep questions and playable media", () => {
    for (const day of [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18]) {
      const task = getB1ListeningTask(day);
      expect(task.submitRequired).toBe(true);
      expect(task.questions).toHaveLength(5);
      expect(task.audioKey || task.embedUrl || task.videoId).toBeTruthy();
    }
  });

  test("Day 15 and Day 16 use the uploaded protected R2 recordings", () => {
    const day15 = getB1ListeningTask(15);
    const day16 = getB1ListeningTask(16);

    expect(day15.audioKey).toBe("audio/day_15.mp3");
    expect(day16.audioKey).toBe("audio/day_16.mp3");
    expect(day15.embedUrl || day15.videoId || day15.externalUrl).toBeFalsy();
    expect(day16.embedUrl || day16.videoId || day16.externalUrl).toBeFalsy();
    expect(day15.questions).toHaveLength(5);
    expect(day16.questions).toHaveLength(5);
  });

  test("special non-audio cases stay explicit", () => {
    expect(getB1ListeningTask(19).audioKey).toBe("b1/day-19/day-19.mp3");
    expect(getB1ListeningTask(19).submitRequired).toBe(true);
    expect(getB1ListeningTask(21).status).toBe("unavailable");
    expect(getB1ListeningTask(22).mode).toBe("reading-fallback");
    expect(getB1ListeningTask(23).status).toBe("unavailable");
  });
});


describe("B1 Day 18 dialogue listening", () => {
  test("asks only questions answered in the recording and keeps the answer order B B B C A", () => {
    const task = getB1ListeningTask(18);
    expect(task.questions.map(({ stem }) => stem)).toEqual([
      "Was wollte der erste Sprecher als Kind werden?",
      "Welche Berufe schlägt der erste Sprecher für jemanden vor, der Kunst liebt?",
      "Welches Beispiel für ein Praktikum erwähnt der zweite Sprecher?",
      "Welchen ungewöhnlichen Berufsweg erwähnt einer der Sprecher?",
      "Womit wird Neugier bei der Berufswahl im Gespräch verglichen?",
    ]);
    expect(task.questions.map(({ options }) => options.map((option) => option.slice(0, 2)))).toEqual(
      Array.from({ length: 5 }, () => ["A)", "B)", "C)", "D)"])
    );
    expect(task.questions[0].options[1]).toBe("B) Astronaut");
    expect(task.questions[1].options[1]).toBe("B) Grafikdesigner, Innenarchitekt oder Kunsttherapeut");
    expect(task.questions[2].options[1]).toBe("B) Ein Praktikum im Kinderheim");
    expect(task.questions[3].options[2]).toBe("C) Ein Mann wollte Ingenieur werden, arbeitet aber heute als Koch");
    expect(task.questions[4].options[0]).toBe("A) Mit einem Kompass für die Karriere");
  });
});
