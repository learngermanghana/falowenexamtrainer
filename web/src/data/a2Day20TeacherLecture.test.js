import fs from "fs";
import path from "path";
import { getTeacherLectureVideoResources, hasTeacherLectureVideoResources } from "./teacherLectureVideoResources";
import { getLessonVideoResources, shouldShowTeacherLectureVideo } from "./lessonVideoDictionary";
import { getA2ListeningTask } from "./a2ListeningTasks";

test("A2 Day 20 keeps the tutor lecture distinct from its protected listening exercise", () => {
  const url = "https://youtu.be/WTSF68FkTqk";
  expect(hasTeacherLectureVideoResources("A2", 20)).toBe(true);
  expect(shouldShowTeacherLectureVideo("A2", 20)).toBe(true);
  expect(getTeacherLectureVideoResources("A2", 20)).toEqual([
    expect.objectContaining({ chapter: "7.20", url, description: expect.stringContaining("Typische Reklamationssituationen") }),
  ]);
  expect(getLessonVideoResources("A2", 20)).toEqual(expect.arrayContaining([expect.objectContaining({url})]));
  const listening = getA2ListeningTask(20);
  expect(listening.audioKey).toBe("a2/day-20/day-20.mp3");
  expect(listening.audioUrl).toBe("");
  const source = fs.readFileSync(path.resolve(__dirname, "../components/A2StandardTabbedWorkbookPage.js"), "utf8");
  expect(source).toContain("data-a2-day20-teacher-lecture");
  expect(source).toContain("[16, 17, 18, 20].includes(Number(day))");
});
