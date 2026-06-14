import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { LessonResourcesHub } from "./CourseLessonPage";

const canonicalLesson = (resources) => ({ resources });

describe("canonical lesson resources", () => {
  test("CourseLessonPage does not resolve videos separately", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "CourseLessonPage.js"),
      "utf8",
    );
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
            {
              chapter: "1",
              grammarBook: { url: "grammar" },
              workbook: { url: "workbook" },
            },
            { chapter: "2", grammarBook: null, workbook: null },
          ],
        })}
      />,
    );

    expect(screen.getByText("Kapitel 1 grammar book")).toBeInTheDocument();
    expect(screen.getByText("Kapitel 1 workbook")).toBeInTheDocument();
    expect(screen.getByText("Teacher explanation")).toBeInTheDocument();
    expect(screen.getByText("AI grammar video")).toBeInTheDocument();
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
