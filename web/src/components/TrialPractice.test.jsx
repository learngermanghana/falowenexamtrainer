import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TrialCoursePage, TrialExamPage } from "./TrialPractice";

test.each(["A1", "A2", "B1", "B2", "C1"])("protects Day 2 direct links at %s", level => {
  const page = day => <MemoryRouter><TrialCoursePage level={level} active path={"/campus/course/lesson/" + level + "/" + day}>
    <p>Lesson content</p></TrialCoursePage></MemoryRouter>;
  const {rerender} = render(page(1));
  expect(screen.getByText("Lesson content")).toBeVisible();
  rerender(page(2));
  expect(screen.queryByText("Lesson content")).toBeNull();
  expect(screen.getByRole("link", {name:"Choose a payment option"})).toHaveAttribute("href","/mock/payment");
});

test.each(["/campus/course/a1-final-mock-exam", "/campus/course/a2-final-mock-exam", "/exams/lesen/a1/sample-2"])("A1 trial locks %s", path => {
  render(<MemoryRouter><TrialExamPage level="A1" path={path}>Protected questions</TrialExamPage></MemoryRouter>);
  expect(screen.queryByText("Protected questions")).toBeNull();
  expect(screen.getByRole("link",{name:"Choose a payment option"})).toBeVisible();
});
