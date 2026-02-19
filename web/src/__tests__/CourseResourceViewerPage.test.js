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
});
