import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppPageShell from "./AppPageShell";

test("renders shared page navigation, heading, actions, and content", () => {
  render(
    <MemoryRouter>
      <AppPageShell title="Lesson" subtitle="Practice today" backLabel="Course Book" rightActions={<button>Save</button>}>
        <p>Lesson content</p>
      </AppPageShell>
    </MemoryRouter>
  );

  expect(screen.getByRole("button", { name: "Course Book" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Lesson" })).toBeInTheDocument();
  expect(screen.getByText("Practice today")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(screen.getByText("Lesson content")).toBeInTheDocument();
});
