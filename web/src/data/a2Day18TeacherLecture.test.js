import { getTeacherLectureVideoResources, hasTeacherLectureVideoResources } from "./teacherLectureVideoResources";
import { getLessonVideoResources, shouldShowTeacherLectureVideo } from "./lessonVideoDictionary";
import { getA2B1GrammarVideoModel } from "../components/A2B1GrammarVideoCard";
import { getA2ListeningTask } from "./a2ListeningTasks";
import fs from "fs";
import path from "path";

describe("A2 Day 18 · Die Bank anrufen · teacher lecture", () => {
  const newLectureUrl = "https://youtu.be/bPqDeZXwXm4";

  test("uses the supplied teacher YouTube recording for Kapitel 7.18", () => {
    expect(hasTeacherLectureVideoResources("A2", 18)).toBe(true);
    expect(shouldShowTeacherLectureVideo("A2", 18)).toBe(true);
    expect(getTeacherLectureVideoResources("A2", 18)).toEqual([
      expect.objectContaining({
        chapter: "7.18",
        url: newLectureUrl,
        description: expect.stringContaining("Die Bank anrufen"),
      }),
    ]);
    expect(getLessonVideoResources("A2", 18)).toEqual(
      expect.arrayContaining([expect.objectContaining({ url: newLectureUrl })]),
    );
  });

  test("also makes the teacher lecture available in the direct Day 18 workbook", () => {
    const component = fs.readFileSync(
      path.resolve(__dirname, "../components/A2StandardTabbedWorkbookPage.js"),
      "utf8",
    );
    expect(component).toContain("[16, 17, 18].includes(Number(day))");
    expect(component).toContain("data-a2-day18-teacher-lecture");
    expect(component).toContain("getTeacherLectureVideoResources(\"A2\", day)");
    expect(component).toContain("https://www.youtube-nocookie.com/embed/");
  });

  test("preserves the independent AI grammar video and Hören for this lesson", () => {
    const ai = getA2B1GrammarVideoModel("A2", 18);
    expect(ai.sourceUrl).toBe("https://youtu.be/jdhvRlRMiIc");
    expect(ai.youtubeId).toBe("jdhvRlRMiIc");
    const listening = getA2ListeningTask(18);
    expect(listening.audioUrl).toBe("https://youtu.be/cHKVQOLWv7c");
    expect(listening.questions).toHaveLength(5);
    expect(listening.audioUrl).not.toBe(newLectureUrl);
  });
});
