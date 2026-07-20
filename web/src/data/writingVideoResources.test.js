import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "./writingVideoResources";

describe("writing video resources", () => {
  test.each([
    ["B1", 1, "https://youtu.be/nG1PUrvrS_s"],
    ["B1", 2, "https://youtu.be/94IXPx5dTNY"],
    ["B1", 3, "https://youtu.be/8uAMihJTzvo"],
    ["B1", 4, "https://youtu.be/mHQiEdVVRSQ"],
    ["B2", 1, "https://youtu.be/w8TaNHk-a0U"],
    ["B2", 3, "https://youtu.be/qCO2p1Ahy7U"],
    ["B2", 4, "https://youtu.be/ltTxYa_T2xc"],
    ["B2", 12, "https://youtu.be/3xWokVVz8cs"],
    ["C1", 8, "https://youtu.be/VdczhJS9ClY"],
    ["C1", 9, "https://youtu.be/tpj8TV8DaH8"],
    ["C1", 10, "https://youtu.be/I5OU_ZXz4c0"],
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

  test("keeps the B1 Day 3 resource inside the Schreiben section", () => {
    expect(getWritingVideoResource("B1", 3)).toEqual(
      expect.objectContaining({
        key: "b1-day3-erfolgsgeschichten-writing-video",
        title: expect.stringContaining("Erfolgsgeschichten"),
        url: "https://youtu.be/8uAMihJTzvo",
      }),
    );
  });

  test("maps B1 Day 4 to the Wohnung suchen Teil 2 writing video", () => {
    expect(getWritingVideoResource("B1", 4)).toEqual(
      expect.objectContaining({
        key: "b1-day4-wohnung-suchen-writing-video",
        title: expect.stringContaining("Wohnung suchen"),
        url: "https://youtu.be/mHQiEdVVRSQ",
      }),
    );
  });

  test("maps B2 Day 4 Chapter 1.4 to its Schreiben video", () => {
    expect(getWritingVideoResource("B2", 4)).toEqual(
      expect.objectContaining({
        key: "b2-day4-bildung-lernen-writing-video",
        chapter: "1.4",
        title: expect.stringContaining("Bildung und Lernen"),
        url: "https://youtu.be/ltTxYa_T2xc",
      }),
    );
  });

  test("maps B2 Day 3 and C1 Day 10 to their writing pages", () => {
    expect(getWritingVideoResource("B2", 3)).toEqual(
      expect.objectContaining({
        key: "b2-day3-oeffentliches-privates-leben-writing-video",
        url: "https://youtu.be/qCO2p1Ahy7U",
      }),
    );
    expect(getWritingVideoResource("C1", 10)).toEqual(
      expect.objectContaining({
        key: "c1-day10-integration-gesellschaft-writing-video",
        url: "https://youtu.be/I5OU_ZXz4c0",
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
    expect(getWritingVideoResource("B1", 5)).toBeNull();
  });

  test.each([
    ["https://youtu.be/w8TaNHk-a0U", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["https://youtu.be/94IXPx5dTNY", "https://www.youtube.com/embed/94IXPx5dTNY"],
    ["https://youtu.be/8uAMihJTzvo", "https://www.youtube.com/embed/8uAMihJTzvo"],
    ["https://youtu.be/mHQiEdVVRSQ", "https://www.youtube.com/embed/mHQiEdVVRSQ"],
    ["https://youtu.be/qCO2p1Ahy7U", "https://www.youtube.com/embed/qCO2p1Ahy7U"],
    ["https://youtu.be/ltTxYa_T2xc", "https://www.youtube.com/embed/ltTxYa_T2xc"],
    ["https://youtu.be/I5OU_ZXz4c0", "https://www.youtube.com/embed/I5OU_ZXz4c0"],
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
