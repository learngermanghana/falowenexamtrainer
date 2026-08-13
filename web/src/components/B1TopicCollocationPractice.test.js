import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B1 topic-matched collocations", () => {
  test("defines support for all 28 B1 days", () => {
    const source = read("B1TopicCollocationPractice.jsx");
    for (let day = 1; day <= 28; day += 1) {
      expect(source).toContain(`${day}: { topic:`);
    }
    expect(source).toContain("Verben mit Präpositionen");
    expect(source).toContain("Jetzt selbst bilden");
  });

  test("includes high-value B1 verb-preposition combinations", () => {
    const source = read("B1TopicCollocationPractice.jsx");
    expect(source).toContain('"sich verlassen auf + Akk"');
    expect(source).toContain('"teilnehmen an + Dat"');
    expect(source).toContain('"abhängen von + Dat"');
    expect(source).toContain('"sich bewerben um + Akk"');
    expect(source).toContain('"warnen vor + Dat"');
    expect(source).toContain('"beitragen zu + Dat"');
  });

  test("mounts collocations in the B1 tutor lesson before resources", () => {
    const page = read("B1TutorLessonPage.js");
    expect(page).toContain('import B1TopicCollocationPractice from "./B1TopicCollocationPractice"');
    expect(page).toContain("<B1TopicCollocationPractice day={day} />");
    expect(page.indexOf("<B1TopicCollocationPractice day={day} />")).toBeLessThan(page.indexOf("<B1TutorResources canonicalLesson={canonicalLesson} />"));
  });
});
