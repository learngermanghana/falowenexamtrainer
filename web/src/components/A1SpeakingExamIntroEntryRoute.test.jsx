import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { normalizeLesson } from "../data/lessonModel";
import {
  resolveCanonicalA1LessonRouteEntry,
} from "../utils/lessonRouteEntry";
import A1SpeakingExamIntroEntryRoute, {
  A1_SPEAKING_EXAM_INTRO_ENTRY_PATH,
  A1_SPEAKING_EXAM_INTRO_HUB_PATH,
  buildA1SpeakingExamIntroHubDestination,
} from "./A1SpeakingExamIntroEntryRoute";
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ studentProfile: null, saveStudentProfile: jest.fn() }),
}));

jest.mock("./SpeakingExamIntroPage", () => function SpeakingWorkbookProbe() {
  const { useExam } = require("../context/ExamContext");
  const { level } = useExam();
  return <div data-testid="speaking-workbook">Speaking workbook ({level})</div>;
});

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

  test("renders the workbook directly for completed material URLs instead of nesting App routes", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/speaking-exams-intro-4-7?view=workbook&radio=done&materials=done",
        ]}
      >
        <A1SpeakingExamIntroEntryRoute />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("speaking-workbook")).toHaveTextContent("Speaking workbook (A1)");
  });

  test("the supporting hub contains teacher and AI videos plus a separate workbook link", () => {
    const entry = resolveCanonicalA1LessonRouteEntry({ day: 15, chapter: "4.7" });
    const resources = normalizeLesson(entry, "A1").resources;

    expect(entry).toEqual(
      expect.objectContaining({
        level: "A1",
        day: 15,
        chapter: "4.7",
        video: "https://youtu.be/o9nn_hSDzw8",
        workbookRoute: "/campus/course/speaking-exams-intro-4-7?view=workbook",
      }),
    );
    expect(entry).not.toHaveProperty("hideAiVideoInLessonHub");
    expect(entry.resources).toEqual([
      expect.objectContaining({
        chapter: "4.7",
        teacherVideo: "https://youtu.be/o9nn_hSDzw8",
        workbook_link: "/campus/course/speaking-exams-intro-4-7?view=workbook",
      }),
    ]);
    expect(resources.teacherVideo).toEqual(
      expect.objectContaining({ url: "https://youtu.be/o9nn_hSDzw8" }),
    );
    expect(resources.aiVideo).toEqual(
      expect.objectContaining({ url: "https://youtu.be/FLe36q-tONA" }),
    );
  });

  test("preserves unrelated query parameters while preventing a redirect loop", () => {
    expect(
      buildA1SpeakingExamIntroHubDestination("?level=A1&radio=done&view=workbook"),
    ).toBe(
      "/campus/course/lesson/A1/15?level=A1&radio=done&chapter=4.7&hub=1",
    );
  });
});
