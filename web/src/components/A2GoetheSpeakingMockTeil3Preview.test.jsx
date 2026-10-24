import { A2_GOETHE_SPEAKING_TEIL3 } from "./A2GoetheSpeakingMockTeil3Preview";

describe("A2 Sprechen Teil 3 preview", () => {
  test("uses one planning scenario with four required points", () => {
    expect(A2_GOETHE_SPEAKING_TEIL3.points).toHaveLength(4);
    expect(A2_GOETHE_SPEAKING_TEIL3.maxRecordingSeconds).toBe(90);
  });

  test("requires reaction, proposal, and a final shared plan", () => {
    expect(A2_GOETHE_SPEAKING_TEIL3.partner).toContain("Ins Schwimmbad möchte ich nicht");
    expect(A2_GOETHE_SPEAKING_TEIL3.finalRequirement).toContain("Reagieren");
    expect(A2_GOETHE_SPEAKING_TEIL3.finalRequirement).toContain("gemeinsamen Plan");
  });
});
