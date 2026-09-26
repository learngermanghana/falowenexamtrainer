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
      expect(task.embedUrl || task.videoId).toBeTruthy();
    }
  });

  test("special non-audio cases stay explicit", () => {
    expect(getB1ListeningTask(19).mode).toBe("reading-fallback");
    expect(getB1ListeningTask(21).status).toBe("unavailable");
    expect(getB1ListeningTask(22).mode).toBe("reading-fallback");
    expect(getB1ListeningTask(23).status).toBe("planned");
  });
});
