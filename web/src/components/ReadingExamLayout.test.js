import fs from "fs";
import path from "path";
import { getA2ReadingTask } from "../data/a2ReadingTasks";
import {
  getReadingExamVariant,
  parseLetteredOfferSources,
  readingSourceLabel,
  splitReadingSourceText,
} from "./ReadingExamLayout";

const read = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("shared A2-C2 Lesen exam layout", () => {
  test("keeps long single texts as documents", () => {
    expect(getReadingExamVariant({ format: "Kurze Nachricht", sourceCount: 1 })).toBe("document");
    expect(getReadingExamVariant({ format: "Lesetext", sourceCount: 1 })).toBe("document");
    expect(splitReadingSourceText("Absatz eins.\n\nAbsatz zwei.", "Kurze Nachricht")).toEqual([
      "Absatz eins.\n\nAbsatz zwei.",
    ]);
  });

  test("splits independent Goethe-style sources into cards", () => {
    const sources = splitReadingSourceText(
      "Wohnung A: 1 Zimmer.\n\nWohnung B: 2 Zimmer.\n\nWohnung C: WG-Zimmer.",
      "Anzeigen zuordnen",
    );
    expect(sources).toHaveLength(3);
    expect(getReadingExamVariant({ format: "Anzeigen zuordnen", sourceCount: sources.length })).toBe("sources");
    expect(readingSourceLabel(0)).toBe("Text A");
    expect(readingSourceLabel(2)).toBe("Text C");
  });

  test("A2 Day 15 uses the original Angebot A–E labels and a separate heading", () => {
    const task = getA2ReadingTask(15);
    const group = parseLetteredOfferSources(task.text, task.format);
    expect(group.heading).toBe("SPORTVEREIN NORD – KURSE IM FRÜHLING");
    expect(group.offers).toHaveLength(5);
    expect(group.offers.map((offer) => offer.label)).toEqual([
      "Angebot A", "Angebot B", "Angebot C", "Angebot D", "Angebot E",
    ]);
    expect(group.offers.map((offer) => offer.title)).toEqual([
      "Laufgruppe", "Schwimmen", "Badminton", "Familienfitness",
      "Fitnesskurs „Rücken & Bewegung“",
    ]);
    expect(group.offers[0].description).toContain("Keine Anmeldung nötig");
    expect(group.offers[4].description).toContain("nach einer längeren Pause");
    // Student answer choices remain A–D even when the correct offer is E.
    expect(task.questions[0].options[3]).toBe("D) Angebot E");
    expect(read("A2ReadingTaskPanel.js")).toContain("day15Offers ? source.label : readingSourceLabel(index)");
  });

  test("lettered offer parsing falls back on malformed source lists", () => {
    expect(parseLetteredOfferSources(
      "SPORTVEREIN NORD\\n\\nA – Laufen\\nTraining\\n\\nC – Schwimmen\\nMittwoch\\n\\nD – Yoga\\nFreitag",
      "Sportangebote zuordnen",
    )).toBeNull();
  });

  test("A2 uses adaptive document/source rendering from its canonical task format", () => {
    const source = read("A2ReadingTaskPanel.js");
    expect(source).toContain("splitReadingSourceText");
    expect(source).toContain("getReadingExamVariant");
    expect(source).toContain("<ReadingSourceGrid>");
    expect(source).toContain("<ReadingExamDocument");
  });

  test("B1 wraps canonical Lesen content in the shared exam renderer", () => {
    const source = read("B1StandardWorkbookPage.js");
    expect(source).toContain('level="B1"');
    expect(source).toContain("<ReadingExamDocument");
    expect(source).toContain("examGrid ? ReadingQuestionGrid : React.Fragment");
    expect(source).toContain("reading.additionalTexts?.length");
  });

  test("B2 and C2 use document-style exam reading with responsive question grids", () => {
    const b2 = read("B2UnifiedGuidedWorkbookPage.js");
    const c2 = read("C2UnifiedGuidedWorkbookPage.js");
    expect(b2).toContain('level="B2"');
    expect(b2).toContain("data-b2-reading-text");
    expect(b2).toContain("<ReadingQuestionGrid>");
    expect(c2).toContain('level="C2"');
    expect(c2).toContain("<ReadingExamDocument");
    expect(c2).toContain("<ReadingQuestionGrid>");
  });

  test("C1 standardizes its existing Lesen practice surface without inventing a fixed passage", () => {
    const source = read("C1SelfLearningCourse.js");
    expect(source).toContain('label === "Lesen"');
    expect(source).toContain('level="C1"');
    expect(source).toContain('format="Lesen · Selbstlernauftrag"');
    expect(source).toContain("Lesen AI öffnen");
  });
});
