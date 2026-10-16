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

  test("Day 18 career listening tests only details supported by the uploaded dialogue", () => {
    const listening = getB1ListeningTask(18);
    expect(listening.audioKey).toBe("b1/day-18/day-18.mp3");
    expect(listening.submitRequired).toBe(true);
    expect(listening.questions).toHaveLength(5);
    expect(listening.questions.map(({ stem }) => stem)).toEqual([
      "Was wollte der erste Sprecher als Kind werden?",
      "Was muss man laut Gespräch zuerst tun, um Zoologe zu werden?",
      "Welcher Beruf wird für Menschen genannt, die sich für Kunst interessieren?",
      "Wie kann man herausfinden, ob ein Beruf zu einem passt?",
      "Was zeigt das Beispiel des Freundes, der zuerst Ingenieur werden wollte?",
    ]);
    expect(listening.questions.map(({ options }, index) => {
      const correct = [1, 2, 0, 3, 1][index];
      expect(options).toHaveLength(4);
      expect(options.map(option => option.slice(0, 1).toUpperCase())).toEqual(["A", "B", "C", "D"]);
      return options[correct];
    })).toEqual([
      "b) Astronaut",
      "c) Biologie studieren",
      "a) Grafikdesigner",
      "d) Man kann ein Praktikum machen",
      "b) Berufspläne können sich ändern",
    ]);
    expect(listening.questions.map(({ stem }) => stem).join(" ")).not.toMatch(/Agentur für Arbeit|Berufsmesse|Ausbildung meistens|Lebenslauf/);
  });

  test("special non-audio cases stay explicit", () => {
    expect(getB1ListeningTask(19).audioKey).toBe("b1/day-19/day-19.mp3");
    expect(getB1ListeningTask(19).submitRequired).toBe(true);
    expect(getB1ListeningTask(21).status).toBe("unavailable");
    expect(getB1ListeningTask(22).mode).toBe("reading-fallback");
    expect(getB1ListeningTask(23).status).toBe("unavailable");
  });
});
