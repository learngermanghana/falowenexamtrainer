import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("./SharedTimedAssignment", () => ({
  TimedAssignmentPanel: () => null,
}));

import A1CourseBookOffer from "./A1CourseBookOffer";
import { A1SharedWorkbookTabBar } from "./A1SharedAssignmentWorkbookLayout";

test("A1 complete textbook offer is optional and never asks to buy before using the workbook", () => {
  render(<A1CourseBookOffer />);
  const card = screen.getByRole("complementary", { name: "Complete A1 course book" });
  expect(card).toHaveAttribute("data-pdf-exclude", "a1-course-book-offer");
  expect(card).toHaveTextContent("250-page");
  expect(card).toHaveTextContent("Digital GH₵99");
  expect(card).toHaveTextContent("Printed on demand GH₵800");
  expect(screen.getByRole("link", { name: /View complete A1 book/ })).toHaveAttribute(
    "href", "/books/deutsch-a1-course-workbook"
  );
  expect(screen.getByRole("img", { name: /Deutsch A1 Course & Workbook cover/ }))
    .toHaveAttribute("src", "/books/a1-cover.svg");
});

test("native A1 tutor workbook keeps all tabs and progress but replaces section-PDF button with book offer", () => {
  render(
    <MemoryRouter initialEntries={["/campus/course/a1-day-1-greetings-workbook?workbookTab=overview"]}>
      <A1SharedWorkbookTabBar
        assignment={{ assignmentKey: "A1-0.1" }}
        sections={[{ key: "teil-2", number: 2, label: "Reading + Questions" }]}
        activeTab="overview"
        onSelect={() => {}}
        hasGrammar
        hasMusic
      />
    </MemoryRouter>
  );
  for (const name of ["Overview", "Grammar", "Reading + Questions", "♫ Music", "Review & Submit"]) {
    expect(screen.getByRole("tab", { name })).toBeInTheDocument();
  }
  expect(screen.getByRole("progressbar", { name: "A1 workbook section progress" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /View complete A1 book/ })).toHaveAttribute(
    "href", "/books/deutsch-a1-course-workbook"
  );
  expect(screen.queryByRole("button", { name: /Save .* as PDF/ })).not.toBeInTheDocument();
});
