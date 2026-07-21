import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { buildA1WorkbookVideoModel } from "./A1WorkbookVideoHeader";
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from "./A1ChapterResourceHubRoute";

test("shows the A1 teacher lecture in the chapter hub and keeps the AI video for the workbook", async () => {
  render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/1?chapter=0.1&hub=1&radio=done"]}>
      <Routes>
        <Route
          path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByText("A1")).toBeVisible();
  expect(screen.getByText((_, element) => element?.textContent === "🎬 Kapitel 0.1 teacher lecture video")).toBeVisible();
  expect(screen.getByRole("link", { name: /Watch teacher video/i })).toHaveAttribute(
    "href",
    "https://youtu.be/CqFbBQG9M3U",
  );
  expect(screen.queryByText("Kapitel 0.1 AI grammar video")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Watch AI video/i })).not.toBeInTheDocument();

  expect(
    buildA1WorkbookVideoModel({
      pathname: "/campus/course/a1-day-1-greetings-workbook",
      search: "?assignmentKey=A1-0.1&assignmentId=A1-0.1&level=A1&radio=done",
    }),
  ).toEqual(
    expect.objectContaining({
      lessonId: "A1-0.1",
      youtubeId: "5WIMkENgdGE",
      sourceUrl: "https://youtu.be/5WIMkENgdGE",
    }),
  );
});
