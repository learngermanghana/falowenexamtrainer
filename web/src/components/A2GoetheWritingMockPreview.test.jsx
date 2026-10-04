import { A2_GOETHE_WRITING_MOCK } from "./A2GoetheWritingMockPreview";

describe("A2 Schreiben mock preview", () => {
  test("keeps the two Goethe-style writing parts", () => {
    expect(A2_GOETHE_WRITING_MOCK.teil1.points).toHaveLength(3);
    expect(A2_GOETHE_WRITING_MOCK.teil2.points).toHaveLength(3);
  });

  test("keeps the intended word limits", () => {
    expect(A2_GOETHE_WRITING_MOCK.teil1.instruction).toContain("20–30");
    expect(A2_GOETHE_WRITING_MOCK.teil2.instruction).toContain("30–40");
  });

  test("keeps Teil 1 informal and Teil 2 formal", () => {
    expect(A2_GOETHE_WRITING_MOCK.teil1.situation).toContain("Freundin Mila");
    expect(A2_GOETHE_WRITING_MOCK.teil2.situation).toContain("Frau Becker");
  });
});
