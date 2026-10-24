import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import B2TopicIntroduction, { B2_TOPIC_FOUNDATIONS, getB2TopicFoundation } from "./B2TopicIntroduction";
import { B2_LESSON_CONTENT_ALIGNMENT } from "../data/b2LessonContentAlignment";

const ACTIVE_B2_PAGES = [
  "B2Day1To4GuidedLessonPage.js",
  "B2Day6To10SelfTutoringPage.jsx",
  "B2Day11To15SelfTutoringPage.jsx",
  "B2Day16To20SelfTutoringPage.jsx",
  "B2Day21To25SelfTutoringPage.jsx",
  "B2Day26To28SelfTutoringPage.jsx",
];

const LEGACY_B2_PAGES = [
  "B2Day7To16GuidedLessonPage.js",
  "B2Day17To20GuidedLessonPage.js",
  "B2Day21To24GuidedLessonPage.js",
  "B2Day25To28GuidedLessonPage.js",
];

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B2 concise topic foundations", () => {
  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i matches the current B2 curriculum", (day) => {
    const foundation = getB2TopicFoundation(day);
    const lesson = B2_LESSON_CONTENT_ALIGNMENT[day];

    expect(foundation).toEqual(expect.objectContaining({
      day,
      chapter: lesson.chapter,
      title: lesson.title,
      englishIntro: expect.any(String),
      intro: expect.any(String),
      example: expect.any(String),
      tension: expect.any(String),
      question: expect.any(String),
    }));
    expect(foundation.englishIntro.length).toBeGreaterThan(80);
    expect(foundation.englishIntro.length).toBeLessThan(650);
    expect(foundation.intro.length).toBeGreaterThan(90);
    expect(foundation.intro.length).toBeLessThan(600);
    expect(foundation.example.length).toBeGreaterThan(35);
    expect(foundation.tension).toContain("↔");
    expect(foundation.question.endsWith("?")).toBe(true);
  });

  test("covers exactly all 28 B2 days", () => {
    expect(Object.keys(B2_TOPIC_FOUNDATIONS).map(Number)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
  });

  test("renders English topic meaning before German and grammar", () => {
    const { container } = render(<B2TopicIntroduction day={19} />);

    expect(screen.getByText("B2 · Thema zuerst verstehen")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Homeoffice, ständige Erreichbarkeit und Work-Life-Balance" })).toBeVisible();
    expect(screen.getByText("In simple English")).toBeVisible();
    expect(screen.getByText("Auf Deutsch")).toBeVisible();
    expect(screen.getByText("Konkretes Beispiel")).toBeVisible();
    expect(screen.getByText("Abwägung")).toBeVisible();
    expect(screen.getByText("Leitfrage")).toBeVisible();

    const source = container.textContent || "";
    expect(source.indexOf("In simple English")).toBeLessThan(source.indexOf("Auf Deutsch"));
    expect(source.indexOf("Auf Deutsch")).toBeLessThan(source.indexOf("Konkretes Beispiel"));
    expect(screen.getByText("In simple English").parentElement).toHaveStyle({ display: "grid", gap: "4px" });
    expect(screen.getByText("Auf Deutsch").parentElement).toHaveStyle({ display: "grid", gap: "4px" });
  });

  test("supports a current-topic review without old static summaries", () => {
    render(<B2TopicIntroduction day={17} mode="review" />);

    expect(screen.getByText("B2 · Thema wiederholen")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Familie, Kinderbetreuung und Vereinbarkeit mit dem Beruf" })).toBeVisible();
    expect(screen.queryByText(/Mobilität und Stadtleben/i)).not.toBeInTheDocument();
  });

  test("puts topic understanding before grammar in every active B2 page family", () => {
    ACTIVE_B2_PAGES.forEach((name) => {
      const source = read(name);
      expect(source).toContain('import B2TopicIntroduction from "./B2TopicIntroduction"');
      const introIndex = source.indexOf("<B2TopicIntroduction day={day} />");
      const grammarPreviewIndex = Math.min(
        ...[
          source.indexOf("<QuickGrammarPreview", introIndex),
          source.indexOf("<B2QuizFirstLearnPreview", introIndex),
          source.indexOf("<GrammarNotes", introIndex),
          source.indexOf("<B2Day25To28GrammarNotes", introIndex),
        ].filter((index) => index >= 0),
      );
      expect(introIndex).toBeGreaterThan(-1);
      expect(grammarPreviewIndex).toBeGreaterThan(introIndex);
    });
  });

  test("legacy B2 pages no longer expose their stale fixed-topic summaries", () => {
    const joined = LEGACY_B2_PAGES.map(read).join("\n");

    [
      "Mobilität und Stadtleben: Lebensqualität in deutschen Städten",
      "Natur, Klima und Verantwortung: Klimaschutz konkret erklären",
      "Freiwilligenarbeit und Engagement: Gesellschaft mitgestalten",
      "Migration und neue Lebenswege: Ankommen und Chancen nutzen",
      "Demokratie und Mitbestimmung: Verantwortung im Alltag",
      "Nachhaltiger Konsum: Bewusste Entscheidungen treffen",
      "Behörden, Termine und formelle Kommunikation: Klar schreiben",
    ].forEach((staleTitle) => expect(joined).not.toContain(staleTitle));

    LEGACY_B2_PAGES.forEach((name) => {
      const source = read(name);
      expect(source).toContain("<B2TopicIntroduction day={day} />");
      expect(source).toContain('<B2TopicIntroduction day={day} mode="review" />');
    });
  });
});
