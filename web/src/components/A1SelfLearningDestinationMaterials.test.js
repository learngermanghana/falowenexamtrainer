import fs from "fs";
import path from "path";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { getA1SelfLearningJourneyResources } from "./A1CoursePracticeAutoMount";

describe("A1 canonical self-learning destination materials", () => {
  test("Day 14 keeps the canonical teacher lecture and a separate AI video", () => {
    const day14 = A1_CANONICAL_LESSON_CATALOG.find(
      (lesson) => lesson.kind === "practice" && Number(lesson.day) === 14 && String(lesson.chapter) === "3.6",
    );
    expect(day14).toBeTruthy();

    const resources = getA1SelfLearningJourneyResources(day14);
    expect(resources.radio?.youtubeId).toBe("GeHygJE7Hww");
    expect(resources.teacherVideo?.url).toBe("https://youtu.be/0zps4OYwShg");
    expect(resources.aiVideo?.url).toBeTruthy();
    expect(resources.aiVideo?.url).not.toBe(resources.teacherVideo?.url);
  });

  test("the canonical destination waits for Radio, then embeds lesson videos in the practice book", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1CoursePracticeAutoMount.js"),
      "utf8",
    );

    expect(source).toContain("const radioCompleted = hasCompletedRadioFromSearch(location.search)");
    expect(source).toContain("buildA1SelfLearningDestinationHref(practice.destination, location.search)");
    expect(source).toContain('mediaMount.id = "falowen-a1-practice-media-mount"');
    expect(source).toContain('data-a1-self-learning-workbook-media');
    expect(source).toContain("<A1WorkbookMediaPanel");
    expect(source).toContain("teacherVideo={journeyResources?.teacherVideo}");
    expect(source).toContain("aiVideo={journeyResources?.aiVideo}");
    expect(source).not.toContain("const materialsCompleted = hasCompletedSelfLearningMaterials(location.search)");
  });
});
