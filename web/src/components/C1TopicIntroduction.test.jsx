import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import C1TopicIntroduction, { C1_TOPIC_FOUNDATIONS, getC1TopicFoundation } from "./C1TopicIntroduction";
import { getC1ContentProfile } from "../data/c1ContentRefresh";

const PAGE_FAMILIES = [
  "C1Day1To6GuidedLessonPage.js",
  "C1Day8To10GuidedLessonPage.js",
  "C1Day12To14GuidedLessonPage.js",
  "C1Day15To17GuidedLessonPage.js",
  "C1Day18To20GuidedLessonPage.js",
  "C1Day21To25SelfTutoringPage.js",
  "C1Day24To26GuidedLessonPage.js",
  "C1Day27To28GuidedLessonPage.js",
  "CompactC1LessonPage.js",
];

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("C1 topic foundations before grammar", () => {
  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i has a concise C1 foundation tied to the current content profile", (day) => {
    const foundation = getC1TopicFoundation(day);
    const profile = getC1ContentProfile(day);

    expect(foundation).toEqual(expect.objectContaining({
      day,
      intro: expect.any(String),
      example: expect.any(String),
      tension: expect.any(String),
      question: profile.question,
    }));
    expect(foundation.intro.length).toBeGreaterThan(100);
    expect(foundation.intro.length).toBeLessThan(650);
    expect(foundation.example.length).toBeGreaterThan(45);
    expect(foundation.tension).toContain("↔");
    expect(foundation.question.endsWith("?")).toBe(true);
  });

  test("covers exactly Days 1–28", () => {
    expect(Object.keys(C1_TOPIC_FOUNDATIONS).map(Number)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
  });

  test("renders concept, concrete example, perspectives and Leitfrage with readable label spacing", () => {
    render(<C1TopicIntroduction day={25} title="Wissenschaft und Forschung" />);

    expect(screen.getByText("C1 · Thema verstehen")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Wissenschaft und Forschung" })).toBeVisible();
    expect(screen.getByText("Konkretes Beispiel")).toBeVisible();
    expect(screen.getByText("Zielkonflikt / Perspektiven")).toBeVisible();
    expect(screen.getByText("Leitfrage")).toBeVisible();

    ["Konkretes Beispiel", "Zielkonflikt / Perspektiven", "Leitfrage"].forEach((label) => {
      expect(screen.getByText(label).parentElement).toHaveStyle({ display: "grid", gap: "4px" });
    });
  });

  test("mounts the reusable topic foundation in every live C1 page family", () => {
    PAGE_FAMILIES.forEach((name) => {
      const source = read(name);
      expect(source).toContain('import C1TopicIntroduction from "./C1TopicIntroduction"');
      expect(source).toContain("<C1TopicIntroduction");
    });
  });

  test("keeps topic understanding before grammar, collocations or knowledge checks", () => {
    PAGE_FAMILIES.forEach((name) => {
      const source = read(name);
      const introIndex = source.indexOf("<C1TopicIntroduction");
      const candidates = [
        "<C1KnowledgeChoicePractice",
        "<C1Day15To17GrammarNotes",
        "<C1Day18To20GrammarNotes",
        "<GrammarNotes",
        "<C1TopicCollocationPractice",
        "{isC1Day7Grammar ?",
      ]
        .map((token) => source.indexOf(token, introIndex))
        .filter((index) => index >= 0);

      expect(introIndex).toBeGreaterThan(-1);
      expect(candidates.length).toBeGreaterThan(0);
      expect(Math.min(...candidates)).toBeGreaterThan(introIndex);
    });
  });

  test("keeps the Day 28 foundation aligned with the demographic-change topic", () => {
    const day28 = getC1TopicFoundation(28);
    expect(day28.intro).toMatch(/demografischer Wandel/i);
    expect(day28.example).toMatch(/Rente|Pflege/i);
    expect(day28.tension).toMatch(/Generation/i);
    expect(day28.question).toMatch(/alternde Gesellschaft|Generation/i);
  });
});
