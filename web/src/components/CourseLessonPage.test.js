import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { LessonResourcesHub } from "./CourseLessonPage";
import { getLessonVideoResources, shouldShowTeacherLectureVideo } from "../data/lessonVideoDictionary";

const canonicalLesson = (resources) => ({ resources });
const videoLesson = (videos) => canonicalLesson({ videos, resourceGroups: [] });
const aiOverride = (lesson, aiOverrideUrl) => ({ ...lesson, aiVideo: aiOverrideUrl });

describe("canonical lesson resources", () => {
  test("CourseLessonPage does not resolve videos separately", () => {
    const source = fs.readFileSync(path.join(__dirname, "CourseLessonPage.js"), "utf8");
    expect(source).not.toContain('import { getLessonVideoResources }');
    expect(source).not.toMatch(/getLessonVideoResources\s*\(/);
  });

  test("LessonResourcesHub renders canonical links and videos without empty cards", () => {
    render(
      <LessonResourcesHub
        lesson={canonicalLesson({
          videos: [
            { key: "teacher-explanation", title: "Teacher explanation", url: "teacher" },
            { key: "ai-grammar-video", title: "AI grammar video", url: "ai" },
          ],
          resourceGroups: [
            { chapter: "1", grammarBook: { url: "grammar" }, workbook: { url: "workbook" } },
            { chapter: "2", grammarBook: null, workbook: null },
          ],
        })}
      />,
    );

    expect(screen.getByText("Kapitel 1 grammar book")).toBeInTheDocument();
    expect(screen.getByText("Kapitel 1 workbook")).toBeInTheDocument();
    expect(screen.getByText("Kapitel 1 teacher lecture video")).toBeInTheDocument();
    expect(screen.getByText("Kapitel 1 AI grammar video")).toBeInTheDocument();
    expect(screen.queryByText("Kapitel 2 grammar book")).not.toBeInTheDocument();
  });

  test("keeps chapter-specific canonical videos grouped in chapter order", () => {
    render(
      <LessonResourcesHub
        lesson={canonicalLesson({
          videos: [
            { key: "teacher-explanation", chapter: "2", url: "chapter-2" },
            { key: "teacher-explanation", chapter: "1", url: "chapter-1" },
          ],
          resourceGroups: [
            { chapter: "2", grammarBook: { url: "grammar-2" }, workbook: null },
            { chapter: "1", grammarBook: { url: "grammar-1" }, workbook: null },
          ],
        })}
      />,
    );

    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(links).toEqual(["grammar-2", "chapter-2", "grammar-1", "chapter-1"]);
  });
});

describe("lesson video visibility policy", () => {
  test("A1 with both videos renders teacher first and AI second with different URLs", () => {
    render(<LessonResourcesHub lesson={videoLesson([
      { key: "teacher-explanation", url: "https://example.com/teacher" },
      { key: "ai-grammar-video", url: "https://example.com/ai" },
    ])} />);

    expect(screen.getByText("Teacher Lecture")).toBeInTheDocument();
    expect(screen.getByText("AI Grammar Explainer")).toBeInTheDocument();
    const links = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(links).toEqual(["https://example.com/teacher", "https://example.com/ai"]);
    expect(links[0]).not.toBe(links[1]);
  });

  test("A1 with only teacher video renders only teacher section", () => {
    render(<LessonResourcesHub lesson={videoLesson([{ key: "teacher-explanation", url: "teacher-only" }])} />);
    expect(screen.getByText("Teacher Lecture")).toBeInTheDocument();
    expect(screen.queryByText("AI Grammar Explainer")).not.toBeInTheDocument();
  });

  test("A1 with only AI video renders AI without empty teacher section", () => {
    render(<LessonResourcesHub lesson={videoLesson([{ key: "ai-grammar-video", url: "ai-only" }])} />);
    expect(screen.queryByText("Teacher Lecture")).not.toBeInTheDocument();
    expect(screen.getByText("AI Grammar Explainer")).toBeInTheDocument();
  });

  test.each(["A2", "B1", "B2", "C1"])("%s shows teacher lecture when available and keeps AI video", (level) => {
    expect(shouldShowTeacherLectureVideo(level)).toBe(true);
    const resources = getLessonVideoResources(level, 99, {
      day: 99,
      teacherVideo: "teacher-url",
      aiVideo: "ai-url",
    });
    expect(resources.map((resource) => resource.url)).toEqual(["teacher-url", "ai-url"]);
    render(<LessonResourcesHub lesson={videoLesson(resources)} />);
    expect(screen.getByText("Teacher Lecture")).toBeInTheDocument();
    expect(screen.getByText("AI Grammar Explainer")).toBeInTheDocument();
  });

  test("AI override only sets aiVideo and preserves teacher URL fields", () => {
    const lesson = {
      teacherVideo: "teacher-field",
      video: "video-field",
      youtube_link: "youtube-field",
    };
    expect(aiOverride(lesson, "ai-field")).toEqual({
      teacherVideo: "teacher-field",
      video: "video-field",
      youtube_link: "youtube-field",
      aiVideo: "ai-field",
    });
  });

  test("duplicate AI and tutor URLs render only one player", () => {
    render(<LessonResourcesHub lesson={videoLesson([
      { key: "teacher-explanation", url: "same-url" },
      { key: "ai-grammar-video", url: "same-url" },
    ])} />);
    expect(screen.getAllByRole("link", { name: /Watch .* video/i })).toHaveLength(1);
    expect(screen.getByText("Teacher Lecture")).toBeInTheDocument();
    expect(screen.queryByText("AI Grammar Explainer")).not.toBeInTheDocument();
  });
});
