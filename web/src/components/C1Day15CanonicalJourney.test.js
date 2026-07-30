import { readFileSync } from "node:fs";
import path from "node:path";
import c1Day15BildungUndLebenslangesLernen from "../data/selfLearningLessons/c1/day15BildungUndLebenslangesLernen";
import { __TESTING__ as workbookRouteTesting } from "./C1Day15BildungUndLebenslangesLernenWorkbookPage";
import { __TESTING__ as grammarRouteTesting } from "./C1Day15BildungUndLebenslangesLernenGrammarNotesPage";

const guidedPageSource = readFileSync(
  path.join(process.cwd(), "src/components/C1Day15To17GuidedLessonPage.js"),
  "utf8",
);
const legacyWorkbookSource = readFileSync(
  path.join(
    process.cwd(),
    "src/components/C1Day15BildungUndLebenslangesLernenWorkbookPage.js",
  ),
  "utf8",
);

const CANONICAL_BASE = "/campus/course/lesson/C1/15?chapter=3.5";

describe("C1 Day 15 canonical lesson journey", () => {
  test("sends the legacy workbook and grammar URLs into the canonical C1 lesson", () => {
    expect(workbookRouteTesting.C1_DAY15_WORKBOOK_ROUTE).toBe(
      `${CANONICAL_BASE}&view=workbook`,
    );
    expect(grammarRouteTesting.C1_DAY15_GRAMMAR_ROUTE).toBe(
      `${CANONICAL_BASE}&view=grammar`,
    );

    expect(c1Day15BildungUndLebenslangesLernen.resources.workbook.url).toBe(
      `${CANONICAL_BASE}&view=workbook`,
    );
    expect(c1Day15BildungUndLebenslangesLernen.resources.grammarBook.url).toBe(
      `${CANONICAL_BASE}&view=grammar`,
    );
  });

  test("uses the C1 Learn, Speak, Write, Finish and Ref structure", () => {
    expect(guidedPageSource).toContain(
      'const tabs = ["learn", "speak", "write", "finish", "references"]',
    );
    expect(guidedPageSource).toContain('learn: "1. Learn"');
    expect(guidedPageSource).toContain('speak: "2. Speak"');
    expect(guidedPageSource).toContain('write: "3. Write"');
    expect(guidedPageSource).toContain('finish: "4. Finish"');
    expect(guidedPageSource).toContain('references: "5. Ref"');
    expect(guidedPageSource).toContain("<EmbeddedSpeechPracticePanel />");

    expect(legacyWorkbookSource).not.toContain("RouteSpeakingMindMap");
    expect(legacyWorkbookSource).not.toContain(
      '["sprechen", "schreiben", "lesen", "hören"]',
    );
  });

  test("embeds the approved AI video in Learn and keeps C1 speaking content", () => {
    expect(c1Day15BildungUndLebenslangesLernen.videoResource).toEqual(
      expect.objectContaining({
        key: "c1-day15-bildung-lebenslanges-lernen-ai-video",
        chapter: "3.5",
        url: "https://youtu.be/yd036VzKm_U",
      }),
    );
    expect(c1Day15BildungUndLebenslangesLernen.speakingBuilder.branches).toHaveLength(6);
    expect(
      c1Day15BildungUndLebenslangesLernen.speakingBuilder.branches.map(
        (branch) => branch.id,
      ),
    ).toEqual([
      "individuum",
      "unternehmen",
      "staat",
      "zugang",
      "lernformen",
      "wirkung",
    ]);

    expect(guidedPageSource).toContain(
      "lesson.videoResource || canonicalLesson?.resources?.aiVideo",
    );
    expect(guidedPageSource).toContain('active === "learn"');
  });
});
