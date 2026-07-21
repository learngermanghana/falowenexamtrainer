import {
  resolveCanonicalA1LessonRouteEntry,
} from "../utils/lessonRouteEntry";
import {
  A1_SPEAKING_EXAM_INTRO_ENTRY_PATH,
  A1_SPEAKING_EXAM_INTRO_HUB_PATH,
  buildA1SpeakingExamIntroHubDestination,
} from "./A1SpeakingExamIntroEntryRoute";

describe("A1 speaking-exam self-learning entry flow", () => {
  test("opens the Kapitel 4.7 supporting-resource hub before the workbook", () => {
    expect(A1_SPEAKING_EXAM_INTRO_ENTRY_PATH).toBe(
      "/campus/course/speaking-exams-intro-4-7",
    );
    expect(A1_SPEAKING_EXAM_INTRO_HUB_PATH).toBe(
      "/campus/course/lesson/A1/15?chapter=4.7&hub=1",
    );
    expect(buildA1SpeakingExamIntroHubDestination("")).toBe(
      A1_SPEAKING_EXAM_INTRO_HUB_PATH,
    );
  });

  test("the supporting hub contains the teacher lecture and a separate workbook link", () => {
    const entry = resolveCanonicalA1LessonRouteEntry({ day: 15, chapter: "4.7" });

    expect(entry).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 15,
        chapter: "4.7",
        hideAiVideoInLessonHub: true,
        video: "https://youtu.be/o9nn_hSDzw8",
        workbookRoute: "/campus/course/speaking-exams-intro-4-7?view=workbook",
      }),
    );
    expect(entry.resources).toEqual([
      expect.objectContaining({
        chapter: "4.7",
        teacherVideo: "https://youtu.be/o9nn_hSDzw8",
        workbook_link: "/campus/course/speaking-exams-intro-4-7?view=workbook",
      }),
    ]);
  });

  test("preserves unrelated query parameters while preventing a redirect loop", () => {
    expect(
      buildA1SpeakingExamIntroHubDestination("?level=A1&radio=done&view=workbook"),
    ).toBe(
      "/campus/course/lesson/A1/15?level=A1&radio=done&chapter=4.7&hub=1",
    );
  });
});
