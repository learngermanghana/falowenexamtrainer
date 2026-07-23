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
    ["B1", 5, "https://youtu.be/n1whPCP2KzA"],
    ["B1", 6, "https://youtu.be/bklCB9MdTcA?si=qGzQjqY9xuypNTJD"],
    ["B1", 20, "https://youtu.be/og1iVBKnIb0"],
    ["B1", 21, "https://youtu.be/1JYyJfnumig"],
    ["B2", 1, "https://youtu.be/w8TaNHk-a0U"],
    ["B2", 3, "https://youtu.be/qCO2p1Ahy7U"],
    ["B2", 5, "https://youtu.be/-6_zmU9ibJI?si=Mvlld1_jVP7nU1nL"],
    ["B2", 12, "https://youtu.be/3xWokVVz8cs"],
    ["C1", 8, "https://youtu.be/VdczhJS9ClY"],
    ["C1", 9, "https://youtu.be/tpj8TV8DaH8"],
    ["C1", 10, "https://youtu.be/I5OU_ZXz4c0"],
    ["C1", 11, "https://youtu.be/Ww6gq3lmmpk"],
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

  test("maps B1 Day 5, Day 6, Day 20 and Day 21 to their Teil 2 Schreiben videos", () => {
    expect(getWritingVideoResource("B1", 5)).toEqual(
      expect.objectContaining({
        key: "b1-day5-besichtigungstermin-writing-video",
        title: expect.stringContaining("Besichtigungstermin"),
        url: "https://youtu.be/n1whPCP2KzA",
      }),
    );
    expect(getWritingVideoResource("B1", 6)).toEqual(
      expect.objectContaining({
        key: "b1-day6-stadt-oder-land-writing-video",
        title: expect.stringContaining("Stadt oder Land"),
        url: "https://youtu.be/bklCB9MdTcA?si=qGzQjqY9xuypNTJD",
      }),
    );
    expect(getWritingVideoResource("B1", 20)).toEqual(
      expect.objectContaining({
        key: "b1-day20-beruf-qualifikationen-writing-video",
        title: expect.stringContaining("Ausbildung und Qualifikationen"),
        url: "https://youtu.be/og1iVBKnIb0",
      }),
    );
    expect(getWritingVideoResource("B1", 21)).toEqual(
      expect.objectContaining({
        key: "b1-day21-lebensformen-heute-writing-video",
        title: expect.stringContaining("Lebensformen heute"),
        url: "https://youtu.be/1JYyJfnumig",
      }),
    );
  });

  test("maps B2 Day 5 to the Bildung und Lernen Write page", () => {
    expect(getWritingVideoResource("B2", 5)).toEqual(
      expect.objectContaining({
        key: "b2-day5-bildung-lernen-writing-video",
        chapter: "1.5",
        title: expect.stringContaining("Bildung und Lernen"),
        url: "https://youtu.be/-6_zmU9ibJI?si=Mvlld1_jVP7nU1nL",
      }),
    );
  });

  test("maps B2 Day 3 and C1 Day 10 and Day 11 to their writing pages", () => {
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
    expect(getWritingVideoResource("C1", 11)).toEqual(
      expect.objectContaining({
        key: "c1-day11-engagement-ehrenamt-writing-video",
        url: "https://youtu.be/Ww6gq3lmmpk",
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
    expect(getWritingVideoResource("B1", 7)).toBeNull();
  });

  test.each([
    ["https://youtu.be/w8TaNHk-a0U", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["https://youtu.be/94IXPx5dTNY", "https://www.youtube.com/embed/94IXPx5dTNY"],
    ["https://youtu.be/8uAMihJTzvo", "https://www.youtube.com/embed/8uAMihJTzvo"],
    ["https://youtu.be/mHQiEdVVRSQ", "https://www.youtube.com/embed/mHQiEdVVRSQ"],
    ["https://youtu.be/n1whPCP2KzA", "https://www.youtube.com/embed/n1whPCP2KzA"],
    ["https://youtu.be/bklCB9MdTcA?si=qGzQjqY9xuypNTJD", "https://www.youtube.com/embed/bklCB9MdTcA"],
    ["https://youtu.be/og1iVBKnIb0", "https://www.youtube.com/embed/og1iVBKnIb0"],
    ["https://youtu.be/1JYyJfnumig", "https://www.youtube.com/embed/1JYyJfnumig"],
    ["https://youtu.be/qCO2p1Ahy7U", "https://www.youtube.com/embed/qCO2p1Ahy7U"],
    ["https://youtu.be/-6_zmU9ibJI?si=Mvlld1_jVP7nU1nL", "https://www.youtube.com/embed/-6_zmU9ibJI"],
    ["https://youtu.be/I5OU_ZXz4c0", "https://www.youtube.com/embed/I5OU_ZXz4c0"],
    ["https://youtu.be/Ww6gq3lmmpk", "https://www.youtube.com/embed/Ww6gq3lmmpk"],
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
