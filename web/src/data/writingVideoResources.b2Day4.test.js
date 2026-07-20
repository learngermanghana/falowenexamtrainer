import { getWritingVideoResource, getYouTubeEmbedUrl } from "./writingVideoResources";

describe("B2 Day 4 Schreiben video", () => {
  test("maps Chapter 1.4 to the approved writing video", () => {
    expect(getWritingVideoResource("B2", 4)).toEqual(
      expect.objectContaining({
        key: "b2-day4-bildung-lernen-writing-video",
        chapter: "1.4",
        title: expect.stringContaining("Bildung und Lernen"),
        url: "https://youtu.be/ltTxYa_T2xc",
      }),
    );
    expect(getYouTubeEmbedUrl("https://youtu.be/ltTxYa_T2xc")).toBe(
      "https://www.youtube.com/embed/ltTxYa_T2xc",
    );
  });
});
