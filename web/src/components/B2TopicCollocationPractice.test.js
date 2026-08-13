import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B2 topic collocations", () => {
  test("covers all B2 days", () => {
    const source = read("B2TopicCollocationPractice.jsx");
    for (let day = 1; day <= 28; day += 1) expect(source).toContain(`${day}:[`);
    expect(source).toContain("Kollokationen · Verben mit Präpositionen");
    expect(source).toContain("Jetzt produzieren");
  });

  test("mounts before the grammar check", () => {
    const source = read("B2KnowledgeChoicePractice.js");
    expect(source).toContain("B2TopicCollocationPractice");
    expect(source).toContain("B2KnowledgeChoiceCore");
  });
});
