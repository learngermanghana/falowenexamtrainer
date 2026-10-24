import { getWritingVideoResource } from "./writingVideoResources";

describe("B2 Day 4 Schreiben video after the topic redesign", () => {
  test("does not reuse the old Bildung und Lernen writing video", () => {
    expect(getWritingVideoResource("B2", 4)).toBeNull();
  });
});
