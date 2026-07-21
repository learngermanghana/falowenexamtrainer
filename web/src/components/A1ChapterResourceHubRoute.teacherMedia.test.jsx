import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import A1ChapterResourceHubRoute from "./A1ChapterResourceHubRoute";

test("shows both the A1 teacher lecture and AI video in the Day 1 chapter hub", () => {
  render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/1?chapter=0.1&hub=1&radio=done"]}>
      <Routes>
        <Route
          path="/campus/course/lesson/A1/:day"
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("A1")).toBeVisible();
  expect(screen.getByText("Kapitel 0.1 teacher lecture video")).toBeVisible();
  expect(screen.getByRole("link", { name: /Watch teacher video/i })).toHaveAttribute(
    "href",
    "https://youtu.be/CqFbBQG9M3U",
  );
  expect(screen.getByText("Kapitel 0.1 AI grammar video")).toBeVisible();
  expect(screen.getByRole("link", { name: /Watch AI video/i })).toHaveAttribute(
    "href",
    "https://youtu.be/5WIMkENgdGE",
  );
});
