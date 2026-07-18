import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "./writingVideoResources";

describe("writing video resources", () => {
  test.each([
    ["B1", 1, "https://youtu.be/nG1PUrvrS_s"],
    ["B1", 2, "https://youtu.be/94IXPx5dTNY"],
    ["B2", 1, "https://youtu.be/w8TaNHk-a0U"],
    ["B2", 12, "https://youtu.be/3xWokVVz8cs"],
    ["C1", 8, "https://youtu.be/VdczhJS9ClY"],
    ["C1", 9, "https://youtu.be/tpj8TV8DaH8"],
  ])("returns the requested %s Day %i writing video", (level, day, url) => {
    expect(getWritingVideoResource(level, day)).toEqual(
      expect.objectContaining({ url }),
    );
  });

  test("keeps the B1 Day 2 resource classified as Schreiben support", () => {
    expect(getWritingVideoResource("B1", 2)).toEqual(
      expect.objectContaining({
        key: "b1-day2-freunde-fuers-leben-writing-video",
        title: expect.stringContaining("Schreiben explanation"),
      }),
    );
  });

  test("classifies B2 Day 12 as a letter-writing guide", () => {
    expect(getWritingVideoResource("B2", 12)).toEqual(
      expect.objectContaining({
        key: "b2-day12-kultur-freizeit-letter-writing-video",
        format: "letter",
        title: expect.stringContaining("Brief schreiben"),
        badge: "Watch before writing · Letter guide",
        heading: "Learn how to write this B2 letter",
        url: "https://youtu.be/3xWokVVz8cs",
      }),
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
    expect(getWritingVideoResource("B1", 3)).toBeNull();
  });

  test.each([
    ["https://youtu.be/w8TaNHk-a0U", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["https://youtu.be/94IXPx5dTNY", "https://www.youtube.com/embed/94IXPx5dTNY"],
    ["https://youtu.be/3xWokVVz8cs", "https://www.youtube.com/embed/3xWokVVz8cs"],
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
