import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Days 23-28 assessment integrity", () => {
  const day23 = read("A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js");
  const day24 = read("A2Day24EinenUrlaubPlanenWorkbookPage.js");
  const day25 = read("A2Day25TagesablaufWorkbookPage.js");
  const day26 = read("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
  const day27 = read("A2Day27DigitaleKommunikationWorkbookPage.js");
  const day28 = read("A2Day28UeberDieZukunftSprechenWorkbookPage.js");
  const radioDictionary = read("../data/lessonRadioDictionary.js");
  const additionalRadio = read("../data/additionalA2RadioEntries.js");

  test("Day 23 keeps original reading and separate Teil 4 Hören", () => {
    expect(day23).toContain("Wohin fuhr Matthias?");
    expect(day23).toContain("C) An die Nordsee");
    expect(day23).toContain("6DA1dYfqEZo");
    expect(additionalRadio).toContain('youtubeId: "LtARwiCljLY"');
    expect(day23).not.toContain('hoerenAudioUrl="https://youtu.be/LtARwiCljLY"');
  });

  test("Day 24 keeps Anzeige reading and separate Teil 4 Hören", () => {
    expect(day24).toContain("Sarah heiratet bald");
    expect(day24).toContain("Anzeigen (a–f)");
    expect(day24).toContain("iPScKV6JWaA");
    expect(additionalRadio).toContain('youtubeId: "UXiBiiXwqwY"');
    expect(day24).not.toContain('hoerenAudioUrl="https://youtu.be/UXiBiiXwqwY"');
  });

  test("Day 25 does not present Falowen Radio as Teil 4", () => {
    expect(day25).toContain("showHoeren={false}");
    expect(additionalRadio).toContain('youtubeId: "m7nP2qE9gNg"');
    expect(day25).not.toContain("m7nP2qE9gNg");
  });

  test("Day 26 uses separate Hören instead of its Falowen Radio", () => {
    expect(day26).toContain("JEJZypJfrD8");
    expect(radioDictionary).toContain('youtubeId: "9OVfA1B-nuU"');
    expect(day26).not.toContain('hoerenAudioUrl="https://youtu.be/9OVfA1B-nuU"');
  });

  test("Day 27 keeps its listening separate from Falowen Radio", () => {
    expect(day27).toContain("JEJZypJfrD8");
    expect(radioDictionary).toContain('youtubeId: "XLyXDfsM-HY"');
    expect(day27).not.toContain('hoerenAudioUrl="https://youtu.be/XLyXDfsM-HY"');
  });

  test("Day 28 keeps its listening separate from Falowen Radio", () => {
    expect(day28).toContain("Teuu287XY_M");
    expect(additionalRadio).toContain('youtubeId: "ftnD96p9Ncg"');
    expect(day28).not.toContain('hoerenAudioUrl="https://youtu.be/ftnD96p9Ncg"');
  });
});
