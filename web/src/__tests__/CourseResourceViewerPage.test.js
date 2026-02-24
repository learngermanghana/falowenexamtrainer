import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import CourseResourceViewerPage from "../components/CourseResourceViewerPage";

describe("CourseResourceViewerPage", () => {
  it("shows fallback copy when url query is missing", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/resource-viewer?label=Workbook"]}>
        <Routes>
          <Route path="/campus/course/resource-viewer" element={<CourseResourceViewerPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/No resource link provided/i)).toBeInTheDocument();
  });

  it("shows full-screen helper link copy when url query is present", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/resource-viewer?label=Workbook&url=https%3A%2F%2Fexample.com%2Fdoc"]}>
        <Routes>
          <Route path="/campus/course/resource-viewer" element={<CourseResourceViewerPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/To view this document full screen, click/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /this link/i })).toHaveAttribute("href", "https://example.com/doc");
  });

  it("shows campus quick tabs so students can jump to other sections", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/resource-viewer?label=Grammar%20Book&url=https%3A%2F%2Fexample.com%2Fdoc"]}>
        <Routes>
          <Route path="/campus/course/resource-viewer" element={<CourseResourceViewerPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /my course/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /discussion/i })).toBeInTheDocument();
  });

});
