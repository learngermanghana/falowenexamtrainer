import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "./writingVideoResources";

describe("writing video resources", () => {
  test.each([
    ["B1", 1, "https://youtu.be/nG1PUrvrS_s"],
    ["B2", 1, "https://youtu.be/w8TaNHk-a0U"],
    ["C1", 8, "https://youtu.be/VdczhJS9ClY"],
    ["C1", 9, "https://youtu.be/tpj8TV8DaH8"],
  ])("returns the requested %s Day %i writing video", (level, day, url) => {
    expect(getWritingVideoResource(level, day)).toEqual(
      expect.objectContaining({ url }),
    );
  });

  test("normalizes level casing and numeric day values", () => {
    expect(getWritingVideoResource(" b2 ", "1")).toEqual(
      expect.objectContaining({
        key: "b2-day1-persoenliche-identitaet-writing-video",
      }),
    );
  });

  test("returns null when no writing video has been added", () => {
    expect(getWritingVideoResource("B1", 2)).toBeNull();
  });

  test.each([
    ["https://youtu.be/w8TaNHk-a0U", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["https://www.youtube.com/watch?v=nG1PUrvrS_s", "https://www.youtube.com/embed/nG1PUrvrS_s"],
    ["https://youtube.com/embed/VdczhJS9ClY", "https://www.youtube.com/embed/VdczhJS9ClY"],
    ["https://youtu.be/tpj8TV8DaH8", "https://www.youtube.com/embed/tpj8TV8DaH8"],
  ])("creates a safe YouTube embed URL for %s", (url, expected) => {
    expect(getYouTubeEmbedUrl(url)).toBe(expected);
  });

  test("rejects non-YouTube and malformed links", () => {
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBe("");
    expect(getYouTubeEmbedUrl("not-a-url")).toBe("");
  });
});
