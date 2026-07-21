import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "B1Day19VorstellungsgespraechWorkbookPage.js"),
  "utf8",
);

describe("B1 Day 19 Teil 2 Schreiben video", () => {
  test("embeds only the requested writing support video inside the Schreiben section", () => {
    expect(source).toContain('const WritingSupportVideo = () => (');
    expect(source).toContain('src="https://www.youtube-nocookie.com/embed/clZoeBjLesQ"');
    expect(source).toContain('href="https://youtu.be/clZoeBjLesQ"');

    const schreibenStart = source.indexOf('activeTab === "schreiben"');
    const lesenStart = source.indexOf('activeTab === "lesen"');
    const schreibenSection = source.slice(schreibenStart, lesenStart);

    expect(schreibenSection).toContain("<WritingSupportVideo />");
    expect(source.match(/<WritingSupportVideo \/>/g)).toHaveLength(1);
  });
});
