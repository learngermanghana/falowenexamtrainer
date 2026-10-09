import { A2_MOCK_2_SCHREIBEN } from "./a2Mock2Schreiben";
describe("A2 Mock 2 Schreiben tasks", () => {
  test("has two tasks with the requested duration and word limits", () => {
    expect(A2_MOCK_2_SCHREIBEN.durationMinutes).toBe(30);
    expect([A2_MOCK_2_SCHREIBEN.teil1.minutes,A2_MOCK_2_SCHREIBEN.teil2.minutes]).toEqual([10,20]);
    expect([A2_MOCK_2_SCHREIBEN.teil1.minWords,A2_MOCK_2_SCHREIBEN.teil1.maxWords]).toEqual([20,30]);
    expect([A2_MOCK_2_SCHREIBEN.teil2.minWords,A2_MOCK_2_SCHREIBEN.teil2.maxWords]).toEqual([30,40]);
  });
  test("retains each writing situation and all three requirements", () => {
    expect(A2_MOCK_2_SCHREIBEN.teil1.situation).toMatch(/Julia/);
    expect(A2_MOCK_2_SCHREIBEN.teil1.situation).toMatch(/krank/);
    expect(A2_MOCK_2_SCHREIBEN.teil2.situation).toMatch(/München/);
    expect(A2_MOCK_2_SCHREIBEN.teil2.recipient).toMatch(/Alpenblick/);
    expect(A2_MOCK_2_SCHREIBEN.teil1.points).toHaveLength(3);
    expect(A2_MOCK_2_SCHREIBEN.teil2.points).toHaveLength(3);
  });
});
