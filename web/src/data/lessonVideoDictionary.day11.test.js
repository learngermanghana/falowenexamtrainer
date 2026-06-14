import { getLessonVideoResources } from "./lessonVideoDictionary";

test("A2 Day 11 uses the corrected transport comparison AI video", () => {
  expect(getLessonVideoResources("A2", 11)).toEqual([
    expect.objectContaining({
      key: "ai-grammar-video",
      url: "https://youtu.be/-mcgpnwRQRo",
    }),
  ]);
});
