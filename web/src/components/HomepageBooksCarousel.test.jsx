import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import HomepageBooksCarousel from "./HomepageBooksCarousel";

afterEach(() => jest.useRealTimers());

test("signed-in homepage rotates five actual retail book covers and links to each detail page", () => {
  render(<HomepageBooksCarousel />);
  expect(screen.getByRole("region",{name:"Explore Falowen German books"})).toBeInTheDocument();
  expect(screen.getByRole("img",{name:"Deutsch A1 book cover"}))
    .toHaveAttribute("src","/books/a1-cover.svg");
  expect(screen.getByRole("link",{name:/View Book/}))
    .toHaveAttribute("href","/books/deutsch-a1-course-workbook");
  fireEvent.click(screen.getByRole("button",{name:"Next book"}));
  expect(screen.getByRole("img",{name:"German Writing Skills book cover"}))
    .toHaveAttribute("src","/books/writing-skills-a1-c2-cover.svg");
  expect(screen.getByRole("link",{name:/View Book/}))
    .toHaveAttribute("href","/books/how-to-unlock-your-german-writing-skills-a1-c2");
  for (const [name,cover,href] of [
    ["A1 Writing Model Exams","a1-writing-exams-cover.svg","goethe-a1-writing-model-exams"],
    ["A2 Exam Preparation","a2-exam-guide-cover.svg","goethe-a2-four-skills-exam-guide"],
    ["B1 Exam Preparation","b1-exam-guide-cover.svg","goethe-b1-four-skills-exam-guide"],
  ]) {
    fireEvent.click(screen.getByRole("button",{name:"Show "+name}));
    expect(screen.getByRole("img",{name:name+" book cover"}))
      .toHaveAttribute("src","/books/"+cover);
    expect(screen.getByRole("link",{name:/View Book/}))
      .toHaveAttribute("href","/books/"+href);
  }
  expect(screen.queryByRole("link",{name:/Buy now|Paystack|Coming soon/i})).not.toBeInTheDocument();
});
test("manual navigation and covers work without any backend fetch or pricing in the homepage", () => {
  const previous=global.fetch;global.fetch=jest.fn(()=>{throw Error("No homepage book API calls");});
  try {
    render(<HomepageBooksCarousel />);
    fireEvent.click(screen.getByRole("button",{name:"Previous book"}));
    expect(screen.getByRole("img",{name:"B1 Exam Preparation book cover"})).toBeInTheDocument();
    expect(screen.getByRole("link",{name:/View Book/}))
      .toHaveAttribute("href","/books/goethe-b1-four-skills-exam-guide");
    expect(global.fetch).not.toHaveBeenCalled();
  } finally {global.fetch=previous;}
});
