import fs from "fs";
import path from "path";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { getA1SelfLearningJourneyResources } from "./A1CoursePracticeAutoMount";

describe("A1 canonical self-learning destination materials", () => {
  test("Day 14 keeps the saved teacher lecture and separate AI video", () => {
    const day14 = A1_CANONICAL_LESSON_CATALOG.find(
      (lesson) => lesson.kind === "practice" && Number(lesson.day) === 14 && String(lesson.chapter) === "3.6",
    );
    expect(day14).toBeTruthy();

    const resources = getA1SelfLearningJourneyResources(day14);
    expect(resources.radio?.youtubeId).toBe("GeHygJE7Hww");
    expect(resources.teacherVideo?.url).toBe("https://youtu.be/GJw1aJehYHU");
    expect(resources.aiVideo?.url).toBe("https://youtu.be/Wkj1-TnNUxY");
  });

  test("the canonical destination waits for Radio, then shows materials before workbook content", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A1CoursePracticeAutoMount.js"),
      "utf8",
    );

    expect(source).toContain("const radioCompleted = hasCompletedRadioFromSearch(location.search)");
    expect(source).toContain("const materialsCompleted = hasCompletedSelfLearningMaterials(location.search)");
    expect(source).toContain("materialsCompleted || (journeyResources?.radio && !radioCompleted)");
    expect(source).toContain("teacherVideo={resources.teacherVideo}");
    expect(source).toContain("aiVideo={resources.aiVideo}");
  });
});
