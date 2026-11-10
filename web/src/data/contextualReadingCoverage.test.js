import fs from "fs";
import path from "path";
import { contextualReadingVocabulary } from "./contextualReadingVocabulary";
import { B1_READING_TASKS } from "./b1ReadingTasks";
import { B1_DAY6_READING_PARAGRAPHS } from "./b1Day6WorkbookData";
import { B1_DAY7_READING_PARAGRAPHS } from "./b1Day7WorkbookData";
import { B1_DAY8_READING_PARAGRAPHS } from "./b1Day8WorkbookData";
import { segmentReadingPhrases } from "./readingPhraseTranslations";

const components = path.resolve(__dirname, "../components");
const files = fs.readdirSync(components);
const workbook = prefix => fs.readFileSync(path.join(components, files.find(name =>
  name.startsWith(prefix) && /(?:WorkbookPage|WorkbookCorePage)\.js$/.test(name))), "utf8");

function check(level, day, source) {
  for (const [de, en] of contextualReadingVocabulary[level][day]) {
    expect({ level, day, de, matched: segmentReadingPhrases(source, [{ de, en }]).some(part => part.en) })
      .toEqual({ level, day, de, matched: true });
  }
}

test("A1 expressions occur in their workbook sources", () => {
  const lessons = { 1: ["1Greetings"], 3: ["3Kapitel12", "3Pronouns"], 4: ["4Numbers"], 10: ["10Objects"],
    11: ["11Understanding"], 12: ["12Twenty"], 14: ["14ModalVerbsWorkbookCore"], 16: ["16FoodAndDaily", "16FoodAndNegation"],
    17: ["17Standard"], 18: ["18Kapitel121"], 21: ["21Weather"], 22: ["22Health"] };
  expect(Object.keys(contextualReadingVocabulary.A1)).toEqual(Object.keys(lessons));
  for (const [day, names] of Object.entries(lessons)) {
    check("A1", day, names.map(name => workbook("A1Day" + name)).join("\n").replace(/\s+/g, " "));
  }
});

test("all 28 B1 days have contextual expressions in the passage", () => {
  const embedded = {1:"1Traumwelt", 2:"2Freunde", 3:"3Erfolg", 4:"4Wohnung", 11:"11Team",
    19:"19Vorstellung", 20:"20Beruf", 22:"22Beziehung"};
  const paragraphs = {6:B1_DAY6_READING_PARAGRAPHS, 7:B1_DAY7_READING_PARAGRAPHS, 8:B1_DAY8_READING_PARAGRAPHS};
  for (let day = 1; day <= 28; day++) {
    const block = B1_READING_TASKS[day].text;
    let source = paragraphs[day] || block?.paragraphs || block?.situations?.map(s => s.description);
    if (embedded[day]) {
      const page = workbook("B1Day" + embedded[day]);
      source = Array.from(page.matchAll(/text=\{("(?:\\.|[^"\\])*")\}/g), match => JSON.parse(match[1]));
      if (day === 2 || day === 3) source = page.match(/\{\[([\s\S]*?)\]\.map\(\(paragraph\)/)?.[1];
    }
    check("B1", day, Array.isArray(source) ? source.join("\n") : source);
  }
});

test("each advanced workbook paragraph offers a contextual German paraphrase on its first three highlights", () => {
  const { getReadingPhraseTranslations } = require("./readingPhraseTranslations");
  const sources = {
    B2: require("./b2ReadingPractice").B2_READING_PRACTICE,
    C1: require("./c1ReadingPractice").C1_READING_PRACTICE,
    C2: require("./c2ReadingPractice").C2_READING_PRACTICE,
  };
  for (const [level, days] of Object.entries(sources)) {
    for (const [day, reading] of Object.entries(days)) {
      const entries = getReadingPhraseTranslations(level, day);
      for (const [index, paragraph] of (reading.text || reading.paragraphs).entries()) {
        const highlights = segmentReadingPhrases(paragraph, entries, 3);
        expect({ level, day, index, supported: highlights.some(part => part.simple && part.en) })
          .toEqual({ level, day, index, supported: true });
      }
    }
  }
});
