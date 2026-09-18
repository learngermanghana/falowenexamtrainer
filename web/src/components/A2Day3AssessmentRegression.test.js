import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

const extractQuestionBlock = (source, variableName) => {
  const match = source.match(new RegExp(`const ${variableName} = \\[([\\s\\S]*?)\\n\\];`));
  if (!match) throw new Error(`Could not find ${variableName}`);
  return match[1];
};

describe("A2 Day 3 canonical assessment regression", () => {
  const source = read("A2Day3ComparisonsWorkbookPage.js");
  const reading = extractQuestionBlock(source, "readingQuestions");
  const listening = extractQuestionBlock(source, "listeningQuestions");
  const manifest = JSON.parse(read("../../../functions/data/answerKeyManifest.json"));
  const answerKey = manifest["A2 1.3 Dinge und Personen vergleichen"];

  test("keeps Teil 3 at the canonical seven Anna and Max questions", () => {
    expect((reading.match(/stem:/g) || [])).toHaveLength(7);
    expect(reading).toContain('stem: "Wie alt ist Anna?"');
    expect(reading).toContain('stem: "Was macht Anna in ihrer Freizeit?"');
    expect(reading).toContain('stem: "Wo arbeitet Anna?"');
    expect(reading).toContain('stem: "Welches Tier hat Anna?"');
    expect(reading).toContain('stem: "Was unterrichtet Max?"');
    expect(reading).toContain('stem: "Was macht Max oft mit seinen Freunden?"');
    expect(reading).toContain('stem: "Was unternehmen Anna und Max am Wochenende?"');

    expect(source).toContain("Anna arbeitet als Krankenschwester in einem Krankenhaus");
    expect(source).toContain("einen kleinen Hund namens Bruno");
    expect(source).toContain("Ausflüge in die Natur oder Museumsbesuche");
    expect(reading).not.toContain('stem:"Wer ist älter?"');
  });

  test("keeps Teil 4 at the canonical five Julia and Tobias questions", () => {
    expect((listening.match(/stem:/g) || [])).toHaveLength(5);
    expect(listening).toContain('stem: "Wie alt ist Julia?"');
    expect(listening).toContain('stem: "Was macht Julia beruflich?"');
    expect(listening).toContain('stem: "Wo lebt Tobias?"');
    expect(listening).toContain('stem: "Was möchte Tobias in Zukunft machen?"');
    expect(listening).toContain('stem: "Was machen Julia und Tobias oft am Wochenende?"');
    expect(listening).toContain("b) Sie kochen gemeinsam mit Sophie.");
    expect(source).toContain('hoerenAudioUrl="https://youtu.be/z0hve7zCDEo"');
  });

  test("stays aligned with the A2-1.3 answer key", () => {
    expect(answerKey.assignment_id).toBe("A2-1.3");
    expect(Object.keys(answerKey.answers.teil3)).toHaveLength(7);
    expect(Object.keys(answerKey.answers.teil4)).toHaveLength(5);
    expect(answerKey.answers.teil3.Answer1).toContain("Anna ist 25 Jahre alt");
    expect(answerKey.answers.teil3.Answer7).toContain("Anna und Max");
    expect(answerKey.answers.teil4.Answer1).toContain("Julia ist 26 Jahre alt");
    expect(answerKey.answers.teil4.Answer5).toContain("Sophie");
  });
});
